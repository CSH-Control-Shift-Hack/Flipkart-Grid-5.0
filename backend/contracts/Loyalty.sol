pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Interface for ERC20 token

contract ECommerceLoyalty {

    // Structs
    struct User {
        address userAddress;
        uint256 loyaltyPoints;
        uint256[] orderIds;
    }

    struct Seller {
        address sellerAddress;
        uint256[] productIds;
    }

    struct Product {
        uint256 productId;
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

    mapping(address => User) public users;
    mapping(address => Seller) public sellers;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;

    uint256 public nextProductId = 1;
    uint256 public nextOrderId = 1;

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
    constructor(address _loyaltyTokenAddress) {
        admin = msg.sender;
        loyaltyToken = IERC20(_loyaltyTokenAddress);
    }

    // Functions
    function registerSeller() external {
        require(sellers[msg.sender].sellerAddress == address(0), "Seller already registered");
        sellers[msg.sender] = Seller(msg.sender, new uint256[](0));
    }

    function addProduct(uint256 _price, uint256 _rewardPoints, uint256 _quantity, string memory _imageURI) external onlySeller {
        products[nextProductId] = Product(nextProductId, _quantity, msg.sender, _price, _rewardPoints, _imageURI);
        sellers[msg.sender].productIds.push(nextProductId);
        nextProductId++;
    }

    function purchaseProduct(uint256 _productId, uint256 _quantity, bool fullPaymentInMatic) external {
        Product memory product = products[_productId];
        require(product.productId != 0, "Product not found");
        require(product.quantity >= _quantity);

        product.quantity -= _quantity;

        uint256 totalCost = product.price * _quantity;
        uint256 commission = (totalCost * COMMISSION) / 100; // 5% commission in MATIC
        uint256 payableInMatic = totalCost - product.loyaltyTokensAccepted * _quantity; // Remaining amount to be paid in MATIC

        require(msg.value >= payableInMatic, "Incorrect MATIC sent");
        require(loyaltyToken.transferFrom(msg.sender, product.sellerAddress, product.loyaltyTokensAccepted), "FLIP transfer failed");

        // Transfer commission to the contract
        payable(address(this)).transfer(commission);

        // Transfer remaining MATIC (after commission) to the seller
        payable(product.sellerAddress).transfer(payableInMatic - commission);

        // Issue loyalty points to the buyer
        loyaltyToken.transfer(msg.sender, product.rewardPoints * _quantity);

        // Record the order
        orders[nextOrderId] = Order(nextOrderId, msg.sender, _productId, _quantity);
        users[msg.sender].orderIds.push(nextOrderId);
        nextOrderId++;
    }

    // ... Additional functions for other functionalities ...

    // Function to exchange LRT for MATIC
    function exchangeLRTForMATIC(uint256 lrtAmount) external {
        require(lrtAmount > 0, "Amount should be greater than 0");
        uint256 maticAmount = lrtAmount.mul(RATE);

        // Transfer LRT from seller to this contract
        require(loyaltyToken.transferFrom(msg.sender, address(this), lrtAmount), "LRT transfer failed");

        // Send MATIC to seller
        payable(msg.sender).transfer(maticAmount);
    }

    // Function to exchange MATIC for LRT
    function exchangeMATICForLRT() external payable {
        require(msg.value > 0, "MATIC amount should be greater than 0");
        uint256 lrtAmount = msg.value.div(RATE);

        // Ensure the contract has enough LRT
        require(loyaltyToken.balanceOf(address(this)) >= lrtAmount, "Not enough LRT in contract");

        // Transfer LRT to the seller
        require(loyaltyToken.transfer(msg.sender, lrtAmount), "LRT transfer failed");
    }

    // In case you want to update the LRT token address (for flexibility)
    function setLRTToken(address _lrtToken) external onlyOwner {
        lrtToken = IERC20(_lrtToken);
    }

    // To withdraw accidentally sent tokens or MATIC from the contract
    function withdrawTokens(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }

    function withdrawMATIC(uint256 amount) external onlyOwner {
        payable(owner).transfer(amount);
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
