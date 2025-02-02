import React, { useEffect, useState } from 'react';
import { LineChart, TrendingUp } from 'lucide-react';

interface PriceData {
  timestamp: number;
  price: number;
}

export function PriceChart() {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7&interval=daily'
        );
        const data = await response.json();
        
        const formattedData = data.prices.map(([timestamp, price]: [number, number]) => ({
          timestamp,
          price
        }));
        
        setPriceData(formattedData);
      } catch (error) {
        console.error('Error fetching price data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
    const interval = setInterval(fetchPriceData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg animate-pulse">
        <div className="h-64 bg-[#00f3ff]/10 rounded"></div>
      </div>
    );
  }

  const latestPrice = priceData[priceData.length - 1]?.price || 0;
  const previousPrice = priceData[priceData.length - 2]?.price || 0;
  const priceChange = ((latestPrice - previousPrice) / previousPrice) * 100;

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl text-[#00f3ff] font-semibold flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          ETH/USD Price
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#00f3ff]">
            ${latestPrice.toFixed(2)}
          </span>
          <span className={`flex items-center ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`h-4 w-4 ${priceChange >= 0 ? '' : 'transform rotate-180'}`} />
            {Math.abs(priceChange).toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="h-64 relative">
        {/* Add your preferred charting library here */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Chart visualization would go here
        </div>
      </div>
    </div>
  );
}