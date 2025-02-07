import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';

interface ExchangeRate {
  symbol: string;
  rate: number;
}

export function CryptoFiatConverter() {
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState('ETH');
  const [selectedFiat, setSelectedFiat] = useState('USD');
  const [loading, setLoading] = useState(true);

  const cryptos = ['ETH', 'BTC', 'SOL', 'USDT'];
  const fiats = ['USD', 'EUR', 'GBP', 'JPY'];

  const cryptoIds = {
    ETH: 'ethereum',
    BTC: 'bitcoin',
    SOL: 'solana',
    USDT: 'tether'
  };

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(cryptoIds).join(',')}&vs_currencies=${fiats.join(',').toLowerCase()}`
        );
        const data = await response.json();
        
        const newRates: ExchangeRate[] = [];
        Object.entries(data).forEach(([cryptoId, rates]: [string, any]) => {
          const crypto = Object.entries(cryptoIds).find(([_, id]) => id === cryptoId)?.[0];
          if (crypto) {
            Object.entries(rates).forEach(([fiat, rate]: [string, unknown]) => {
              const numericRate = Number(rate);
              if (!isNaN(numericRate)) {
                newRates.push({
                  symbol: `${crypto}_${fiat.toUpperCase()}`,
                  rate: numericRate
                });
              }
              newRates.push({
                symbol: `${crypto}_${fiat.toUpperCase()}`,
                rate: Number(rate)
              });
            });
          }
        });
        
        setRates(newRates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rates:', error);
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleCryptoChange = (value: string) => {
    setCryptoAmount(value);
    if (value && !isNaN(Number(value))) {
      const rate = rates.find(r => 
        r.symbol === `${selectedCrypto}_${selectedFiat}`
      )?.rate || 0;
      setFiatAmount((Number(value) * rate).toFixed(2));
    } else {
      setFiatAmount('');
    }
  };

  const handleFiatChange = (value: string) => {
    setFiatAmount(value);
    if (value && !isNaN(Number(value))) {
      const rate = rates.find(r => 
        r.symbol === `${selectedCrypto}_${selectedFiat}`
      )?.rate || 0;
      if (rate > 0) {
        setCryptoAmount((Number(value) / rate).toFixed(6));
      }
    } else {
      setCryptoAmount('');
    }
  };

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
      <h3 className="text-xl text-[#00f3ff] font-semibold mb-4 flex items-center gap-2">
        <RefreshCw className="h-5 w-5" />
        Crypto-Fiat Converter
      </h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f3ff]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Crypto Amount
              </label>
              <input
                type="number"
                value={cryptoAmount}
                onChange={(e) => handleCryptoChange(e.target.value)}
                className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white"
                placeholder="0.0"
                step="0.000001"
                min="0"
              />
            </div>

            <select
              value={selectedCrypto}
              onChange={(e) => {
                setSelectedCrypto(e.target.value);
                handleCryptoChange(cryptoAmount);
              }}
              className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white"
            >
              {cryptos.map((crypto) => (
                <option key={crypto} value={crypto}>{crypto}</option>
              ))}
            </select>

            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-[#00f3ff]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Fiat Amount
              </label>
              <input
                type="number"
                value={fiatAmount}
                onChange={(e) => handleFiatChange(e.target.value)}
                className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white"
                placeholder="0.0"
                step="0.01"
                min="0"
              />
            </div>

            <select
              value={selectedFiat}
              onChange={(e) => {
                setSelectedFiat(e.target.value);
                handleCryptoChange(cryptoAmount);
              }}
              className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white"
            >
              {fiats.map((fiat) => (
                <option key={fiat} value={fiat}>{fiat}</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-400">
            Exchange Rate: 1 {selectedCrypto} = {
              rates.find(r => r.symbol === `${selectedCrypto}_${selectedFiat}`)?.rate.toFixed(2)
            } {selectedFiat}
          </div>
        </div>
      )}
    </div>
  );
}