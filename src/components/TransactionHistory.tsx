import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  hash?: string;
}

interface TransactionHistoryProps {
  provider: ethers.providers.Web3Provider | null;
}

export function TransactionHistory({ provider }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !provider) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const txs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Transaction[];
          
          setTransactions(txs);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, provider]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
        <h3 className="text-xl text-[#00f3ff] font-semibold mb-4">Transaction History</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-[#00f3ff]/10 rounded"></div>
          <div className="h-12 bg-[#00f3ff]/10 rounded"></div>
          <div className="h-12 bg-[#00f3ff]/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
      <h3 className="text-xl text-[#00f3ff] font-semibold mb-4">Transaction History</h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-500 mt-2">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="border border-[#00f3ff]/20 rounded-lg p-4 hover:bg-[#0a0a1f]/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(tx.status)}
                  <span className="text-[#00f3ff]">
                    {ethers.utils.formatEther(tx.amount)} SepoliaETH
                  </span>
                </div>
                {tx.hash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00f3ff] flex items-center space-x-1"
                  >
                    <span className="text-sm">View</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                <p>To: {tx.to}</p>
                <p>
                  {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}