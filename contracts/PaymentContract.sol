// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentContract {
    address public owner;
    bool public paused;
    uint256 public constant RATE_LIMIT_PERIOD = 1 hours;
    uint256 public constant MAX_TRANSACTIONS_PER_PERIOD = 10;
    
    struct TransactionLimit {
        uint256 count;
        uint256 resetTime;
    }
    
    mapping(address => TransactionLimit) public transactionLimits;
    
    event PaymentProcessed(address indexed payer, address indexed recipient, uint256 amount);
    event EmergencyPause(bool paused);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier notPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier withinRateLimit() {
        TransactionLimit storage limit = transactionLimits[msg.sender];
        if (block.timestamp >= limit.resetTime) {
            limit.count = 0;
            limit.resetTime = block.timestamp + RATE_LIMIT_PERIOD;
        }
        require(limit.count < MAX_TRANSACTIONS_PER_PERIOD, "Rate limit exceeded");
        limit.count++;
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function togglePause() external onlyOwner {
        paused = !paused;
        emit EmergencyPause(paused);
    }
    
    function createPayment(address recipient) external payable notPaused withinRateLimit {
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient address");
        
        // Transfer the payment to the recipient
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Payment failed");
        
        emit PaymentProcessed(msg.sender, recipient, msg.value);
    }

    // Function to handle batch payments
    function batchPayment(address[] calldata recipients, uint256[] calldata amounts) 
        external 
        payable 
        notPaused 
        withinRateLimit 
    {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty recipients array");
        
        uint256 totalAmount = 0;
        for(uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(msg.value == totalAmount, "Incorrect total amount");
        
        for(uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            require(amounts[i] > 0, "Amount must be greater than 0");
            
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            require(success, "Payment failed");
            
            emit PaymentProcessed(msg.sender, recipients[i], amounts[i]);
        }
    }
}