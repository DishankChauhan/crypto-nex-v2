import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getPaymentContract } from '../lib/web3Config';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';

interface PaymentFormProps {
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  onSuccess?: (txHash: string) => void;
}

export function PaymentForm({ provider, signer, onSuccess }: PaymentFormProps) {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadPaymentDetails = async () => {
      try {
        const linkRecipient = searchParams.get('to');
        const linkAmount = searchParams.get('amount');
        const linkDescription = searchParams.get('description');

        if (linkAmount) {
          setAmount(ethers.utils.formatEther(linkAmount));
        }
        if (linkRecipient) {
          setRecipient(linkRecipient);
        }
        if (linkDescription) {
          setDescription(linkDescription);
        }
      } catch (error) {
        console.error('Error loading payment details:', error);
        setError('Invalid payment link parameters');
      }
    };

    loadPaymentDetails();
  }, [searchParams]);

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

      // Store transaction in Firebase
      const userAddress = await signer.getAddress();
      await addDoc(collection(db, 'transactions'), {
        from: userAddress.toLowerCase(),
        to: recipient.toLowerCase(),
        amount: parsedAmount.toString(),
        description: description,
        timestamp: Date.now(),
        status: 'completed',
        txHash: receipt.transactionHash,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        merchantData: {
          redirectUrl: searchParams.get('redirect_url'),
          merchantId: searchParams.get('merchant_id'),
          orderId: searchParams.get('order_id')
        }
      });

      // Call onSuccess callback with transaction hash
      if (onSuccess) {
        onSuccess(receipt.transactionHash);
      }

      // Clear form
      setAmount('');
      setRecipient('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            readOnly
            className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Amount (ETH)
          </label>
          <input
            type="text"
            value={amount}
            readOnly
            className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            readOnly
            className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white"
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
          className="cyber-button w-full px-4 py-2 rounded-md flex items-center justify-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>{loading ? 'Processing...' : 'Send Payment'}</span>
        </button>
      </form>

      <div className="text-sm text-gray-400">
        <p>* Transaction will be processed on the Sepolia network</p>
        <p>* You will be redirected back after successful payment</p>
      </div>
    </div>
  );
}