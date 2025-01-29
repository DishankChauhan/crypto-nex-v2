import { ethers } from 'ethers';
import { PAYMENT_CONTRACT_ABI } from './contracts/PaymentContract';

// Replace this with your deployed contract address
export const PAYMENT_CONTRACT_ADDRESS = "0x7b0e4EE0B7d9Bf3Ab245e0362D6890EA0498FAE4"; // Update this after deployment

export const getPaymentContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return new ethers.Contract(
    PAYMENT_CONTRACT_ADDRESS,
    PAYMENT_CONTRACT_ABI,
    signerOrProvider
  );
};