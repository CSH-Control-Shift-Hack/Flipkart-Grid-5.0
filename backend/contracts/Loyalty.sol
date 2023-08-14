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
        address sellerAddress;
        uint256 price;
        uint256 rewardPoints;
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

    function addProduct(uint256 _price, uint256 _rewardPoints) external onlySeller {
        products[nextProductId] = Product(nextProductId, msg.sender, _price, _rewardPoints);
        sellers[msg.sender].productIds.push(nextProductId);
        nextProductId++;
    }

    function purchaseProduct(uint256 _productId, uint256 _quantity) external {
        Product memory product = products[_productId];
        require(product.productId != 0, "Product not found");

        // Transfer funds and issue loyalty points
        // This is a simplified example; in a real-world scenario, you'd use an ERC20 token for payments as well
        payable(product.sellerAddress).transfer(product.price * _quantity);
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
