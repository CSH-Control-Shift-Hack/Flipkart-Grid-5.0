// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Interface for ERC20 token
import "@openzeppelin/contracts/utils/math/SafeMath.sol"; // SafeMath
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract ECommerceLoyalty is AutomationCompatibleInterface {
    using SafeMath for uint256;

    error InvalidMatidSent(uint256 _maticSent);

    // Structs
    struct User {
        address userAddress;
        uint256 loyaltyPoints;
        uint256 points;
        uint256[] orderIds;
    }

    struct Seller {
        address sellerAddress;
        uint256[] productIds;
    }

    struct Product {
        uint256 productId;
        string name;
        string description;
        uint256 quantity;
        address sellerAddress;
        uint256 price;
        uint256 rewardPoints;
        uint256 loyaltyTokensAccepted; // how many loyalty tokens are accepted.
        string imageURI; // for storing the image of product
    }

    struct Order {
        uint256 orderId;
        address buyerAddress;
        uint256 productId;
        uint256 quantity;
    }

    // State Variables
    address public admin;
    IERC20 public loyaltyToken; // ERC20 token instance for loyalty points

    // Exchange rates (for simplicity, assuming 1 LRT = 1 MATIC)
    uint256 public constant RATE = 1e18; // 1 LRT = 1 MATIC (taking into account 18 decimals)
    uint256 public constant COMMISSION = 5; // 5% commission for Flipkart.

    uint256 public immutable interval; // time after which the leaderboard needs to be reset.
    uint256 public lastTimestamp; // the last timestamp at which the leaderboard was reset.

    address[] public leaderboard; // this array to be updated by sorting the users by their points.

    mapping(address => User) public users;
    mapping(address => Seller) public sellers;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;

    uint256 public nextProductId = 1;
    uint256 public nextOrderId = 1;

    // Seller issuance cap
    uint256 public constant SELLER_CAP = 5000 * (10 ** 18);
    mapping(address => uint256) public monthlyIssuedBySeller;
    mapping(address => uint256) public lastIssuedMonth;

    // Events
    event SellerRegistered(address indexed sellerAddress);
    event UserRegistered(address indexed userAddress);
    event ProductAdded(uint256 indexed productId, address indexed sellerAddress, string name, uint256 price);
    event ProductPurchased(uint256 indexed orderId, address indexed buyerAddress, uint256 indexed productId, uint256 quantity);
    event PointsEarned(address indexed buyerAddress, uint256 pointsEarned);
    event LRTExchangedForMATIC(address indexed sellerAddress, uint256 lrtAmount, uint256 maticAmount);
    event MATICExchangedForLRT(address indexed sellerAddress, uint256 maticAmount, uint256 lrtAmount);
    event LRTTokenAddressUpdated(address indexed admin, address newLRTTokenAddress);
    event TokensWithdrawn(address indexed admin, uint256 amount);
    event MATICWithdrawn(address indexed admin, uint256 amount);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlySeller() {
        require(sellers[msg.sender].sellerAddress != address(0), "Only sellers can call this function");
        _;
    }

    // Constructor
    constructor(address _loyaltyTokenAddress, uint256 _interval) {
        admin = msg.sender;
        loyaltyToken = IERC20(_loyaltyTokenAddress);
        interval = _interval;
        lastTimestamp = block.timestamp;
    }

    // Functions
    function registerSeller() external {
        require(sellers[msg.sender].sellerAddress == address(0), "Seller already registered");
        sellers[msg.sender] = Seller(msg.sender, new uint256[](0));

        emit SellerRegistered(msg.sender);
    }

    function registerUser() external {
        require(users[msg.sender].userAddress == address(0), "User already registered");

        users[msg.sender] = User(msg.sender, 0, 0, new uint256[](0));

        emit UserRegistered(msg.sender);
    }

    function addProduct(string memory name, string memory _description, uint256 _quantity, uint256 _price, uint256 _rewardPoints, uint256 loyaltyTokensAccepted, string memory _imageURI) external onlySeller {
        products[nextProductId] = Product(nextProductId, name, _description, _quantity, msg.sender, _price, _rewardPoints, loyaltyTokensAccepted, _imageURI);
        sellers[msg.sender].productIds.push(nextProductId);

        emit ProductAdded(nextProductId, msg.sender, name, _price);

        nextProductId++;
    }

    function purchaseProducts(uint256[] memory _productIds, uint256[] memory _quantities, bool[] memory _fullPaymentInMatic, uint256 totalCost, uint256 totalLoyaltyTokensUsed) external payable {
        
        require(_productIds.length == _quantities.length, "Mismatch in product IDs and quantities length");

        // Check if the ordered quantity for each product is available
        for (uint256 i = 0; i < _productIds.length; i++) {
            require(products[_productIds[i]].quantity >= _quantities[i], "Ordered quantity not available");
        }

        uint256 commission = (totalCost * COMMISSION) / 100; // 5% commission in MATIC
        uint256 payableInMatic = totalCost - totalLoyaltyTokensUsed; // Remaining amount to be paid in MATIC

        if(msg.value < payableInMatic) {
            
            revert InvalidMatidSent(payableInMatic);
        }

        // require(msg.value >= payableInMatic, "Incorrect MATIC sent");

        // Transfer commission to the contract
        payable(address(this)).transfer(commission);

        // Distribute the remaining MATIC (after commission) among sellers
        for (uint256 i = 0; i < _productIds.length; i++) {
            Product storage product = products[_productIds[i]]; // Use storage to modify the product directly

            // Reduce product's quantity
            product.quantity = product.quantity.sub(_quantities[i]);
            
            uint256 productCost = product.price * _quantities[i];

            // Calculate 10% of the selling price of the product
            uint256 pointsEarned = productCost / 10;

            // Add the points to the user's account
            users[msg.sender].points = users[msg.sender].points.add(pointsEarned);

            emit PointsEarned(msg.sender, pointsEarned);

            if(_fullPaymentInMatic[i]) {
                payable(product.sellerAddress).transfer(productCost - (productCost * COMMISSION) / 100); // Deducting commission for each seller

                // For this, the seller must approve this smart contract while uploading a product to spend rewardPoints on his behalf.
                require(loyaltyToken.transferFrom(product.sellerAddress, msg.sender, product.rewardPoints * _quantities[i]), "Reward Points transfer failed");
            } else {
                payable(product.sellerAddress).transfer(productCost - product.loyaltyTokensAccepted * _quantities[i] - (productCost * COMMISSION) / 100); // Deducting commission for each product

                // For this, the buyer must approve this smart contract while placing order to spend loyaltyTokens on his behalf.
                require(loyaltyToken.transferFrom(msg.sender, product.sellerAddress, product.loyaltyTokensAccepted * _quantities[i]), "Loyalty Token transfer failed");
            }

            // Record the order
            orders[nextOrderId] = Order(nextOrderId, msg.sender, _productIds[i], _quantities[i]);
            users[msg.sender].orderIds.push(nextOrderId);

            emit ProductPurchased(nextOrderId, msg.sender, _productIds[i], _quantities[i]);

            nextOrderId++;
        }

    }

    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory productList = new Product[](nextProductId - 1);

        for (uint256 i = 1; i < nextProductId; i++) {
            productList[i - 1] = products[i];
        }

        return productList;
    }

    function getUserOrders(address _add) public view returns (Product[] memory) {

        Product[] memory productList = new Product[](users[_add].orderIds.length);

        for (uint256 i = 0; i < users[_add].orderIds.length; i++) {
            productList[i - 1] = products[orders[users[_add].orderIds[i]].productId];
        }

        return productList;
    }

    function searchUser(address _add) public view returns (User memory) {
        return users[_add];
    }

    function searchSeller(address _add) public view returns (Seller memory) {
        return sellers[_add];
    }

    function getLeaderBoard() public view returns (address[] memory){
        return leaderboard;
    }

    // Functions for Chainlink Automation oracles
    function checkUpkeep(bytes memory /* checkData */) public view returns (bool upkeepNeeded, bytes memory performData) {
        
        bool timePassed = ((block.timestamp - lastTimestamp) > interval);

        address[] memory leaders = new address[](100); // initialising empty array.
        uint256[] memory leaderPoints = new uint256[](100); // stores the points of the leaders.

        // Constructing the arrays leaders and leaderPoints.
        uint256 minIdx = (nextOrderId-100 > 0) ? nextOrderId-100 : 0;
        for (uint256 i = minIdx; i < nextOrderId; i++) {
            leaders[i - 1] = orders[i].buyerAddress;
            leaderPoints[i - 1] = users[orders[i].buyerAddress].points;
        }

        // Bubble sort for sorting the leaders array based on leaderPoints.
        for (uint256 i = 0; i < leaderPoints.length; i++) {
            for (uint256 j = 0; j < leaderPoints.length - 1; j++) {
                if (leaderPoints[j] < leaderPoints[j + 1]) {
                    uint256 temp = leaderPoints[j];
                    leaderPoints[j] = leaderPoints[j + 1];
                    leaderPoints[j + 1] = temp;

                    address tempAddr = leaders[j];
                    leaders[j] = leaders[j + 1];
                    leaders[j + 1] = tempAddr;
                }
            }
        }

        upkeepNeeded = timePassed;
        performData = abi.encode(leaders);

        return (upkeepNeeded, performData);
    }

    function performUpkeep(bytes calldata performData) external {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert("Upkeep not needed");
        }

        // decode performData
        address[] memory leaders = abi.decode(performData, (address[]));

        // assign decoded data to the leaderboard.
        leaderboard = leaders;

        // reset the lastTimestamp
        lastTimestamp = block.timestamp;
    }

    // ... Additional functions for other functionalities ...

    function issueTokens(address to, uint256 amount) public onlyAdmin {
        require(amount <= loyaltyToken.balanceOf(address(this)), "Not enough tokens in treasury");
        loyaltyToken.transfer(to, amount);
    }

    function issueTokensBySeller(address to, uint256 amount) public onlySeller {
        require(amount <= SELLER_CAP, "Exceeds monthly cap");

        // Reset monthly issued amount if a new month
        if (block.timestamp > lastIssuedMonth[msg.sender] + 30 days) {
            monthlyIssuedBySeller[msg.sender] = 0;
            lastIssuedMonth[msg.sender] = block.timestamp;
        }

        require(monthlyIssuedBySeller[msg.sender].add(amount) <= SELLER_CAP, "Exceeds monthly cap for seller");
        require(amount <= loyaltyToken.balanceOf(address(this)), "Not enough tokens in treasury");

        loyaltyToken.transfer(to, amount);
        monthlyIssuedBySeller[msg.sender] = monthlyIssuedBySeller[msg.sender].add(amount);
    }

    // Function to exchange LRT for MATIC
    function exchangeLRTForMATIC(uint256 lrtAmount) external {

        require(lrtAmount > 0, "Amount should be greater than 0");

        uint256 maticAmount = lrtAmount;

        // Transfer LRT from seller to this contract
        require(loyaltyToken.transferFrom(msg.sender, address(this), lrtAmount), "LRT transfer failed");

        require(address(this).balance >= maticAmount, "Not enough MATIC in contract");

        // Send MATIC to seller
        payable(msg.sender).transfer(maticAmount);

        emit LRTExchangedForMATIC(msg.sender, lrtAmount, maticAmount);
    }

    // Function to exchange MATIC for LRT
    function exchangeMATICForLRT() public payable {
        require(msg.value > 0, "MATIC amount should be greater than 0");
        uint256 lrtAmount = msg.value;

        // Ensure the contract has enough LRT
        require(loyaltyToken.balanceOf(address(this)) >= lrtAmount, "Not enough LRT in contract");

        // Transfer LRT to the seller
        require(loyaltyToken.transfer(msg.sender, lrtAmount), "LRT transfer failed");

        emit MATICExchangedForLRT(msg.sender, msg.value, lrtAmount);
    }

    // In case you want to update the LRT token address (for flexibility)
    function setLRTToken(address _lrtToken) external onlyAdmin {
        loyaltyToken = IERC20(_lrtToken);

        emit LRTTokenAddressUpdated(msg.sender, _lrtToken);
    }

    // To withdraw accidentally sent tokens or MATIC from the contract
    function withdrawTokens(uint256 amount) external onlyAdmin {
        loyaltyToken.transfer(admin, amount);

        emit TokensWithdrawn(msg.sender, amount);
    }

    function withdrawMATIC(uint256 amount) external onlyAdmin {
        payable(admin).transfer(amount);

        emit MATICWithdrawn(msg.sender, amount);
    }

    // This function is executed on plain Ether transfers
    receive() external payable {
        // Call the function to exchange MATIC for LRT
        exchangeMATICForLRT();
    }

    // Fallback function to handle non-data calls to the contract
    fallback() external payable {
        revert("Operation not supported");
    }

}