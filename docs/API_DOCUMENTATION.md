# CryptoNex API Documentation

## Smart Contract API

### PaymentContract

Base Contract Address (Sepolia): `${PAYMENT_CONTRACT_ADDRESS}`

#### Methods

##### createPayment
```solidity
function createPayment(address recipient) external payable
```
Creates a new payment transaction.

Parameters:
- `recipient`: Ethereum address of the payment recipient

##### signPayment
```solidity
function signPayment(bytes32 paymentId) external
```
Signs a multi-signature payment.

Parameters:
- `paymentId`: Unique identifier of the payment

##### togglePause
```solidity
function togglePause() external
```
Pauses/unpauses the contract (owner only).

#### Events

##### PaymentProcessed
```solidity
event PaymentProcessed(address indexed payer, address indexed recipient, uint256 amount)
```
Emitted when a payment is successfully processed.

##### PaymentSigned
```solidity
event PaymentSigned(bytes32 indexed paymentId, address indexed signer)
```
Emitted when a payment receives a signature.

## Web3 Integration

### Configuration
```typescript
import { ethers } from 'ethers';
import { PAYMENT_CONTRACT_ABI } from './contracts/PaymentContract';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(PAYMENT_CONTRACT_ADDRESS, PAYMENT_CONTRACT_ABI, signer);
```

### Example Usage
```typescript
// Create payment
const amount = ethers.utils.parseEther("1.0");
const tx = await contract.createPayment(recipientAddress, { value: amount });
await tx.wait();

// Sign payment
await contract.signPayment(paymentId);
```

## Security Considerations

### Rate Limiting
- Maximum 5 transactions per hour per user
- Enforced at contract level

### Multi-signature
- Minimum 2 signatures required for execution
- All signers must be authorized

### Emergency Controls
- Contract can be paused by owner
- Automatic pause on suspicious activity