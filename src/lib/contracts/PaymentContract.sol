// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentContract {
    address public owner;
    bool public paused;
    uint256 public constant RATE_LIMIT_PERIOD = 1 hours;
    uint256 public constant MAX_TRANSACTIONS_PER_PERIOD = 10;
    uint256 public constant MIN_SIGNERS = 2;
    
    struct Payment {
        uint256 amount;
        uint256 timestamp;
        bool executed;
        uint256 signatureCount;
        mapping(address => bool) signatures;
    }
    
    struct TransactionLimit {
        uint256 count;
        uint256 resetTime;
    }
    
    mapping(address => TransactionLimit) public transactionLimits;
    mapping(bytes32 => Payment) public payments;
    mapping(address => bool) public authorizedSigners;
    uint256 public signerCount;
    
    event PaymentProcessed(address indexed payer, address indexed recipient, uint256 amount);
    event PaymentVerified(address indexed recipient, uint256 amount);
    event PaymentSigned(bytes32 indexed paymentId, address indexed signer);
    event EmergencyPause(bool paused);
    event SignerAdded(address indexed signer);
    event SignerRemoved(address indexed signer);
    
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
        authorizedSigners[msg.sender] = true;
        signerCount = 1;
    }
    
    function togglePause() external onlyOwner {
        paused = !paused;
        emit EmergencyPause(paused);
    }
    
    function addSigner(address signer) external onlyOwner {
        require(!authorizedSigners[signer], "Already a signer");
        authorizedSigners[signer] = true;
        signerCount++;
        emit SignerAdded(signer);
    }
    
    function removeSigner(address signer) external onlyOwner {
        require(signer != owner, "Cannot remove owner");
        require(authorizedSigners[signer], "Not a signer");
        require(signerCount > MIN_SIGNERS, "Cannot have fewer than minimum signers");
        authorizedSigners[signer] = false;
        signerCount--;
        emit SignerRemoved(signer);
    }
    
    function createPayment(address recipient) external payable notPaused withinRateLimit {
        require(msg.value > 0, "Payment amount must be greater than 0");
        bytes32 paymentId = keccak256(abi.encodePacked(msg.sender, recipient, msg.value, block.timestamp));
        Payment storage payment = payments[paymentId];
        payment.amount = msg.value;
        payment.timestamp = block.timestamp;
        payment.signatureCount = 1;
        payment.signatures[msg.sender] = true;
        
        emit PaymentSigned(paymentId, msg.sender);
    }
    
    function signPayment(bytes32 paymentId) external notPaused {
        require(authorizedSigners[msg.sender], "Not authorized signer");
        Payment storage payment = payments[paymentId];
        require(!payment.executed, "Payment already executed");
        require(!payment.signatures[msg.sender], "Already signed");
        
        payment.signatures[msg.sender] = true;
        payment.signatureCount++;
        
        emit PaymentSigned(paymentId, msg.sender);
        
        if (payment.signatureCount >= MIN_SIGNERS) {
            executePayment(paymentId);
        }
    }
    
    function executePayment(bytes32 paymentId) internal {
        Payment storage payment = payments[paymentId];
        require(!payment.executed, "Payment already executed");
        require(payment.signatureCount >= MIN_SIGNERS, "Insufficient signatures");
        
        payment.executed = true;
        emit PaymentProcessed(msg.sender, address(this), payment.amount);
    }
}