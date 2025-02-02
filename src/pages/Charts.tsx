import React, { useState, useEffect } from 'react';
import { LineChart as LineChartIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface CryptoPrice {
  id: string;
  name: string;
  data: Array<{ timestamp: number; price: number }>;
}

export function Charts() {
  const [selectedCrypto, setSelectedCrypto] = useState('ethereum');
  const [timeframe, setTimeframe] = useState('7d');
  const [prices, setPrices] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const cryptos = [
    { id: 'ethereum', name: 'ETH/USD' },
    { id: 'bitcoin', name: 'BTC/USD' },
    { id: 'solana', name: 'SOL/USD' },
    { id: 'cardano', name: 'ADA/USD' },
    { id: 'polkadot', name: 'DOT/USD' }
  ];

  const timeframes = [
    { id: '24h', name: '24H' },
    { id: '7d', name: '7D' },
    { id: '30d', name: '30D' },
    { id: '90d', name: '90D' }
  ];

  useEffect(() => {
    const fetchPriceData = async (attempt = 1) => {
      try {
        setLoading(true);
        setError(false);

        const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;

        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart?vs_currency=usd&days=${days}`
        );
        
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();

        console.log("API Response:", data);

        if (data.prices && Array.isArray(data.prices) && data.prices.length > 0) {
          setPrices({
            id: selectedCrypto,
            name: cryptos.find(c => c.id === selectedCrypto)?.name || '',
            data: data.prices.map(([timestamp, price]: [number, number]) => ({
              timestamp: new Date(timestamp).toLocaleDateString(),
              price
            }))
          });
        } else {
          console.warn("No valid price data found.");
          setPrices(null);
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
        
        // Retry fetching data up to 3 times if it fails
        if (attempt < 3) {
          console.warn(`Retrying... (${attempt}/3)`);
          setTimeout(() => fetchPriceData(attempt + 1), 2000);
        } else {
          setPrices(null);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [selectedCrypto, timeframe]);

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-[#00f3ff] hover:text-[#00f3ff]/80 flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>

        <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl text-[#00f3ff] font-bold flex items-center gap-2">
              <LineChartIcon className="h-6 w-6" />
              Crypto Price Charts
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-400 mb-2">Select Cryptocurrency</label>
              <div className="flex flex-wrap gap-2">
                {cryptos.map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => setSelectedCrypto(crypto.id)}
                    className={`px-4 py-2 rounded-md ${
                      selectedCrypto === crypto.id
                        ? 'bg-[#00f3ff] text-[#0a0a1f]'
                        : 'border border-[#00f3ff] text-[#00f3ff]'
                    }`}
                  >
                    {crypto.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Timeframe</label>
              <div className="flex flex-wrap gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setTimeframe(tf.id)}
                    className={`px-4 py-2 rounded-md ${
                      timeframe === tf.id
                        ? 'bg-[#00f3ff] text-[#0a0a1f]'
                        : 'border border-[#00f3ff] text-[#00f3ff]'
                    }`}
                  >
                    {tf.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-[600px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f3ff]"></div>
              </div>
            ) : error || !prices ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                No data available. Try again later.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prices.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a" />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#4a4a6a"
                  />
                  <YAxis stroke="#4a4a6a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a1f',
                      border: '1px solid #00f3ff',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#00f3ff"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
