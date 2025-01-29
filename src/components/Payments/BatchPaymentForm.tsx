import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPaymentContract } from '../../lib/web3Config';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface BatchPayment {
  recipient: string;
  amount: string;
}

export function BatchPaymentForm({ provider, signer }: { 
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}) {
  const [payments, setPayments] = useState<BatchPayment[]>([{ recipient: '', amount: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const addPayment = () => {
    setPayments([...payments, { recipient: '', amount: '' }]);
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !provider || !user) return;

    try {
      setLoading(true);
      setError(null);

      const recipients: string[] = [];
      const amounts: ethers.BigNumber[] = [];
      let totalAmount = ethers.BigNumber.from(0);

      // Validate all payments
      for (const payment of payments) {
        if (!ethers.utils.isAddress(payment.recipient)) {
          throw new Error(`Invalid recipient address: ${payment.recipient}`);
        }
        const amount = ethers.utils.parseEther(payment.amount);
        if (amount.lte(0)) {
          throw new Error('Amount must be greater than 0');
        }
        recipients.push(payment.recipient);
        amounts.push(amount);
        totalAmount = totalAmount.add(amount);
      }

      const contract = getPaymentContract(signer);
      
      // Send batch transaction
      const tx = await contract.batchPayment(recipients, amounts, {
        value: totalAmount
      });

      // Wait for confirmation
      const receipt = await tx.wait();

      // Store transactions in Firebase
      const userAddress = await signer.getAddress();
      for (let i = 0; i < payments.length; i++) {
        await addDoc(collection(db, 'transactions'), {
          from: userAddress.toLowerCase(),
          to: payments[i].recipient.toLowerCase(),
          amount: payments[i].amount,
          timestamp: Date.now(),
          status: 'completed',
          txHash: receipt.transactionHash,
          userId: user.uid
        });
      }

      setPayments([{ recipient: '', amount: '' }]);
    } catch (err: any) {
      setError(err.message || 'Batch payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
      <h3 className="text-xl text-[#00f3ff] font-semibold mb-4 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Batch Payments
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {payments.map((payment, index) => (
          <div key={index} className="space-y-2">
            <div className="flex gap-4">
              <input
                type="text"
                value={payment.recipient}
                onChange={(e) => {
                  const newPayments = [...payments];
                  newPayments[index].recipient = e.target.value;
                  setPayments(newPayments);
                }}
                className="flex-1 bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2"
                placeholder="Recipient Address"
              />
              <input
                type="number"
                value={payment.amount}
                onChange={(e) => {
                  const newPayments = [...payments];
                  newPayments[index].amount = e.target.value;
                  setPayments(newPayments);
                }}
                className="w-32 bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2"
                placeholder="Amount (ETH)"
                step="0.0001"
              />
              {payments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePayment(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={addPayment}
            className="cyber-button px-4 py-2 rounded-md"
          >
            Add Payment
          </button>
          <button
            type="submit"
            disabled={loading || !signer}
            className="cyber-button px-4 py-2 rounded-md"
          >
            {loading ? 'Processing...' : 'Send Batch Payment'}
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}