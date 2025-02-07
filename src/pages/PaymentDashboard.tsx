import React from 'react';
import { ArrowLeft, TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { ethers } from 'ethers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function PaymentDashboard() {
  const { user } = useAuth();
  const { transactions, loading } = useTransactions(user?.uid);

  const stats = React.useMemo(() => {
    if (!transactions.length) return {
      totalVolume: 0,
      avgAmount: 0,
      successRate: 0,
      recentTrend: 0
    };

    const completed = transactions.filter(tx => tx.status === 'completed');
    const totalVolume = completed.reduce((sum, tx) => 
      sum + parseFloat(ethers.utils.formatEther(tx.amount)), 0);

    // Calculate trend (last 7 days vs previous 7 days)
    const now = Date.now();
    const last7Days = completed.filter(tx => 
      tx.timestamp > now - 7 * 24 * 60 * 60 * 1000
    ).reduce((sum, tx) => sum + parseFloat(ethers.utils.formatEther(tx.amount)), 0);
    
    const previous7Days = completed.filter(tx => 
      tx.timestamp <= now - 7 * 24 * 60 * 60 * 1000 &&
      tx.timestamp > now - 14 * 24 * 60 * 60 * 1000
    ).reduce((sum, tx) => sum + parseFloat(ethers.utils.formatEther(tx.amount)), 0);

    const trend = previous7Days ? ((last7Days - previous7Days) / previous7Days) * 100 : 0;

    return {
      totalVolume,
      avgAmount: totalVolume / completed.length || 0,
      successRate: (completed.length / transactions.length) * 100 || 0,
      recentTrend: trend
    };
  }, [transactions]);

  const chartData = React.useMemo(() => {
    if (!transactions.length) return [];

    const last30Days = [...Array(30)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }).reverse();

    return last30Days.map(timestamp => {
      const dayTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.timestamp);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === timestamp;
      });

      const volume = dayTransactions.reduce((sum, tx) => 
        sum + parseFloat(ethers.utils.formatEther(tx.amount)), 0);

      return {
        date: new Date(timestamp).toLocaleDateString(),
        volume
      };
    });
  }, [transactions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-20 bg-[#0a0a1f]/80 rounded-lg"></div>
            <div className="h-96 bg-[#0a0a1f]/80 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-[#00f3ff] hover:text-[#00f3ff]/80 flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-[#00f3ff]" />
                <span className="text-2xl font-bold text-[#00f3ff]">
                  {stats.totalVolume.toFixed(2)} ETH
                </span>
              </div>
              <p className="text-gray-400">Total Volume</p>
            </div>

            <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-[#00f3ff]" />
                <span className="text-2xl font-bold text-[#00f3ff]">
                  {stats.avgAmount.toFixed(4)} ETH
                </span>
              </div>
              <p className="text-gray-400">Average Amount</p>
            </div>

            <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                {stats.recentTrend >= 0 ? (
                  <ArrowUpRight className="h-5 w-5 text-green-400" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-400" />
                )}
                <span className={`text-2xl font-bold ${
                  stats.recentTrend >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {Math.abs(stats.recentTrend).toFixed(1)}%
                </span>
              </div>
              <p className="text-gray-400">7-Day Trend</p>
            </div>

            <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-[#00f3ff]" />
                <span className="text-2xl font-bold text-[#00f3ff]">
                  {stats.successRate.toFixed(1)}%
                </span>
              </div>
              <p className="text-gray-400">Success Rate</p>
            </div>
          </div>

          <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
            <h3 className="text-xl text-[#00f3ff] font-semibold mb-6">
              30-Day Volume
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a" />
                  <XAxis
                    dataKey="date"
                    stroke="#4a4a6a"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#4a4a6a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a1f',
                      border: '1px solid #00f3ff',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar
                    dataKey="volume"
                    fill="#00f3ff"
                    name="Volume (ETH)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}