import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface CryptoPrice {
  id: string;
  symbol: string;
  price: number;
  change24h: number;
}

export function CryptoPriceTracker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Using CoinGecko API v3 with proper headers
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,solana&vs_currencies=usd&include_24hr_change=true',
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || Object.keys(data).length === 0) {
          throw new Error('No data received from API');
        }

        const formattedPrices: CryptoPrice[] = Object.entries(data).map(([id, details]: [string, any]) => ({
          id,
          symbol: id.substring(0, 3).toUpperCase(),
          price: details.usd,
          change24h: details.usd_24h_change
        }));
        
        setPrices(formattedPrices);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
        // Set some default prices if API fails
        setPrices([
          { id: 'bitcoin', symbol: 'BTC', price: 40000, change24h: 0.5 },
          { id: 'ethereum', symbol: 'ETH', price: 2200, change24h: 1.2 },
          { id: 'ripple', symbol: 'XRP', price: 0.5, change24h: -0.3 },
        ]);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      setOffset((prev) => {
        const newOffset = prev - 0.5;
        return newOffset <= -100 ? 0 : newOffset;
      });
    };
    
    const intervalId = setInterval(animate, 50); // Smoother animation
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-[#0a0a1f]/80 border-y border-[#00f3ff] shadow-lg shadow-[#00f3ff]/20">
      <div
        className="flex items-center space-x-8 py-2 transition-transform duration-100 ease-linear"
        style={{ transform: `translateX(${offset}%)` }}
      >
        {[...prices, ...prices, ...prices].map((crypto, index) => (
          <div
            key={`${crypto.id}-${index}`}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <TrendingUp className={`h-4 w-4 ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-[#00f3ff] font-mono">
              {crypto.symbol}: ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className={`text-sm ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {crypto.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}