// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Interface for ERC20 token
import "@openzeppelin/contracts/utils/math/SafeMath.sol"; // SafeMath

contract ECommerceLoyalty {
    using SafeMath for uint256;

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

    mapping(address => User) public users;
    mapping(address => Seller) public sellers;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;

    uint256 public nextProductId = 1;
    uint256 public nextOrderId = 1;

    // Events
    event SellerRegistered(address indexed sellerAddress);
    event ProductAdded(uint256 indexed productId, address indexed sellerAddress, string name, uint256 price);
    event ProductPurchased(uint256 indexed orderId, address indexed buyerAddress, uint256 indexed productId, uint256 quantity);
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
    constructor(address _loyaltyTokenAddress) {
        admin = msg.sender;
        loyaltyToken = IERC20(_loyaltyTokenAddress);
    }

    // Functions
    function registerSeller() external {
        require(sellers[msg.sender].sellerAddress == address(0), "Seller already registered");
        sellers[msg.sender] = Seller(msg.sender, new uint256[](0));

        emit SellerRegistered(msg.sender);
    }

    function addProduct(string memory name, string memory _description, uint256 _quantity, uint256 _price, uint256 _rewardPoints, uint256 loyaltyTokensAccepted, string memory _imageURI) external onlySeller {
        products[nextProductId] = Product(nextProductId, name, _description, _quantity, msg.sender, _price, _rewardPoints, loyaltyTokensAccepted, _imageURI);
        sellers[msg.sender].productIds.push(nextProductId);

        emit ProductAdded(nextProductId, msg.sender, name, _price);

        nextProductId++;
    }

    function purchaseProducts(uint256[] memory _productIds, uint256[] memory _quantities, bool[] memory _fullPaymentInMatic, uint256 totalCost, uint256 totalRewardPoints, uint256 totalLoyaltyTokensUsed) external payable {
        
        require(_productIds.length == _quantities.length, "Mismatch in product IDs and quantities length");

        uint256 commission = (totalCost * COMMISSION) / 100; // 5% commission in MATIC
        uint256 payableInMatic = totalCost - totalLoyaltyTokensUsed; // Remaining amount to be paid in MATIC

        require(msg.value >= payableInMatic, "Incorrect MATIC sent");
        require(loyaltyToken.transferFrom(msg.sender, address(loyaltyToken), totalLoyaltyTokensUsed), "Loyalty Token transfer failed");

        // Transfer commission to the contract
        payable(address(this)).transfer(commission);

        // Distribute the remaining MATIC (after commission) among sellers
        for (uint256 i = 0; i < _productIds.length; i++) {
            Product memory product = products[_productIds[i]];
            uint256 productCost = product.price * _quantities[i];

            if(_fullPaymentInMatic[i]) {
                payable(product.sellerAddress).transfer(productCost - (productCost * COMMISSION) / 100); // Deducting commission for each product
            } else {
                payable(product.sellerAddress).transfer(productCost - product.loyaltyTokensAccepted - (productCost * COMMISSION) / 100); // Deducting commission for each product
                loyaltyToken.transfer(product.sellerAddress, product.loyaltyTokensAccepted);
            }

            // Record the order
            orders[nextOrderId] = Order(nextOrderId, msg.sender, _productIds[i], _quantities[i]);
            users[msg.sender].orderIds.push(nextOrderId);

            emit ProductPurchased(nextOrderId, msg.sender, _productIds[i], _quantities[i]);

            nextOrderId++;
        }

        // Issue total loyalty points to the buyer
        loyaltyToken.transfer(msg.sender, totalRewardPoints);
    }

    // ... Additional functions for other functionalities ...

    // Function to exchange LRT for MATIC
    function exchangeLRTForMATIC(uint256 lrtAmount) external {
        require(lrtAmount > 0, "Amount should be greater than 0");
        uint256 maticAmount = lrtAmount.mul(RATE);

        // Transfer LRT from seller to this contract
        require(loyaltyToken.transferFrom(msg.sender, address(loyaltyToken), lrtAmount), "LRT transfer failed");

        // Send MATIC to seller
        payable(msg.sender).transfer(maticAmount);

        emit LRTExchangedForMATIC(msg.sender, lrtAmount, maticAmount);
    }

    // Function to exchange MATIC for LRT
    function exchangeMATICForLRT() public payable {
        require(msg.value > 0, "MATIC amount should be greater than 0");
        uint256 lrtAmount = msg.value.div(RATE);

        // Ensure the contract has enough LRT
        require(loyaltyToken.balanceOf(address(loyaltyToken)) >= lrtAmount, "Not enough LRT in contract");

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
