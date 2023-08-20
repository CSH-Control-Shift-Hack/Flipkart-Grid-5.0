// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol"; // SafeMath

contract LoyaltyRewardToken is ERC20, Ownable {
    using SafeMath for uint256;

    // Initial supply and treasury fund
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** 18); // Including decimals
    uint256 public constant TREASURY_FUND = 500000 * (10 ** 18);

    // Decay mechanism
    uint256 public constant DECAY_RATE = 5; // 5%
    uint256 public constant DECAY_INTERVAL = 30 days; // 6 months
    mapping(address => uint256) public lastActive;

    // Seller issuance cap
    uint256 public constant SELLER_CAP = 5000 * (10 ** 18);
    mapping(address => uint256) public monthlyIssuedBySeller;
    mapping(address => uint256) public lastIssuedMonth;

    constructor() ERC20("Loyalty Reward Token", "LRT") {
        _mint(msg.sender, INITIAL_SUPPLY); // Mint initial supply minus treasury to deployer
    }

    function decay(address user) public {
        require(block.timestamp.sub(lastActive[user]) > DECAY_INTERVAL, "Decay interval not reached");
        uint256 decayAmount = balanceOf(user).mul(DECAY_RATE).div(100);
        _burn(user, decayAmount);
        lastActive[user] = block.timestamp;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);

        // Update the last active time for the sender and receiver
        lastActive[from] = block.timestamp;
        lastActive[to] = block.timestamp;
    }

    // Function to mint new tokens
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Mint to the zero address");
        require(amount > 0, "Amount must be greater than 0");
        
        _mint(to, amount);
    }
    
}
