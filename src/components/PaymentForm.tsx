import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getPaymentContract } from '../lib/web3Config';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface PaymentFormProps {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

export function PaymentForm({ provider, signer }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !provider || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Validate recipient address
      if (!ethers.utils.isAddress(recipient)) {
        throw new Error('Invalid recipient address');
      }

      // Validate amount
      const parsedAmount = ethers.utils.parseEther(amount);
      if (parsedAmount.lte(0)) {
        throw new Error('Amount must be greater than 0');
      }

      // Get contract instance
      const contract = getPaymentContract(signer);

      // Send transaction
      const tx = await contract.createPayment(recipient, {
        value: parsedAmount
      });

      // Wait for confirmation
      const receipt = await tx.wait();

      // Store transaction in Firebase with correct amount format
      const userAddress = await signer.getAddress();
      await addDoc(collection(db, 'transactions'), {
        from: userAddress.toLowerCase(),
        to: recipient.toLowerCase(),
        amount: parsedAmount.toString(), // Store as string to preserve precision
        timestamp: Date.now(),
        status: 'completed',
        txHash: receipt.transactionHash,
        userId: user.uid
      });

      // Clear form
      setAmount('');
      setRecipient('');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
      <h3 className="text-xl text-[#00f3ff] font-semibold mb-4">Send Payment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-400 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00f3ff]"
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
            Amount (ETH)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="0"
            className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00f3ff]"
            placeholder="0.0"
            required
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !signer}
          className="cyber-button w-full px-4 py-2 rounded-md flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>{loading ? 'Processing...' : 'Send Payment'}</span>
        </button>
      </form>
    </div>
  );
}