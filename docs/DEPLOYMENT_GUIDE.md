# Deployment Guide

## Prerequisites

1. Install dependencies:
```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers @nomiclabs/hardhat-waffle ethereum-waffle chai @openzeppelin/contracts dotenv
```

2. Create `.env` file with:
```
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
```

## Hardhat Setup

1. Create hardhat.config.js:
```javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

2. Create deployment script:
```javascript
const hre = require("hardhat");

async function main() {
  const PaymentContract = await hre.ethers.getContractFactory("PaymentContract");
  const payment = await PaymentContract.deploy();
  await payment.deployed();
  console.log("PaymentContract deployed to:", payment.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Deployment Steps

1. Compile contract:
```bash
npx hardhat compile
```

2. Run tests:
```bash
npx hardhat test
```

3. Deploy to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. Update contract address:
- Copy deployed contract address
- Update `PAYMENT_CONTRACT_ADDRESS` in `src/lib/web3Config.ts`

## Verification

1. Verify contract on Sepolia Etherscan:
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

2. Test contract:
- Send test transaction
- Verify event emissions
- Check multi-signature functionality

## Frontend Deployment

1. Build application:
```bash
npm run build
```

2. Deploy to hosting service:
```bash
# Example for Netlify
netlify deploy --prod
```

## Post-Deployment

1. Update documentation with new contract address
2. Test all features on production
3. Monitor initial transactions
4. Set up alerts for contract events