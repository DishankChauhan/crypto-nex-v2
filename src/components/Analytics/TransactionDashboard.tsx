import React from 'react';
import { BarChart, Activity, Users, Calendar } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useAuth } from '../../contexts/AuthContext';

export function TransactionDashboard() {
  const { user } = useAuth();
  const { transactions, loading } = useTransactions(user?.uid);

  const stats = React.useMemo(() => {
    if (!transactions.length) return {
      totalTransactions: 0,
      totalVolume: 0,
      avgAmount: 0,
      successRate: 0
    };

    const completed = transactions.filter(tx => tx.status === 'completed');
    const totalVolume = completed.reduce((sum, tx) => 
      sum + parseFloat(tx.amount), 0);

    return {
      totalTransactions: transactions.length,
      totalVolume: totalVolume,
      avgAmount: totalVolume / completed.length || 0,
      successRate: (completed.length / transactions.length) * 100 || 0
    };
  }, [transactions]);

  if (loading) {
    return (
      <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-[#00f3ff] mb-6 flex items-center gap-2">
          <BarChart className="h-6 w-6" />
          Transaction Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="cyber-border p-4 rounded-lg animate-pulse">
              <div className="h-8 bg-[#00f3ff]/10 rounded mb-2"></div>
              <div className="h-4 bg-[#00f3ff]/10 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-[#00f3ff] mb-6 flex items-center gap-2">
        <BarChart className="h-6 w-6" />
        Transaction Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-border p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Activity className="h-8 w-8 text-[#00f3ff]" />
            <span className="text-2xl font-bold text-[#00f3ff]">
              {stats.totalTransactions}
            </span>
          </div>
          <p className="mt-2 text-gray-400">Total Transactions</p>
        </div>

        <div className="cyber-border p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Users className="h-8 w-8 text-[#ff00ff]" />
            <span className="text-2xl font-bold text-[#ff00ff]">
              {stats.successRate.toFixed(1)}%
            </span>
          </div>
          <p className="mt-2 text-gray-400">Success Rate</p>
        </div>

        <div className="cyber-border p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Calendar className="h-8 w-8 text-[#00f3ff]" />
            <span className="text-2xl font-bold text-[#00f3ff]">
              {stats.avgAmount.toFixed(4)} ETH
            </span>
          </div>
          <p className="mt-2 text-gray-400">Average Amount</p>
        </div>

        <div className="cyber-border p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <BarChart className="h-8 w-8 text-[#ff00ff]" />
            <span className="text-2xl font-bold text-[#ff00ff]">
              {stats.totalVolume.toFixed(4)} ETH
            </span>
          </div>
          <p className="mt-2 text-gray-400">Total Volume</p>
        </div>
      </div>
    </div>
  );
}