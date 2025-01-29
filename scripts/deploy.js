// Switch to CommonJS for Hardhat compatibility
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