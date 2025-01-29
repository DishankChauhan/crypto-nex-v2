import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, Power, AlertCircle, RefreshCw } from 'lucide-react';

interface Web3WalletProps {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

export function Web3Wallet({ provider, signer }: Web3WalletProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBalance = async () => {
    if (provider && address) {
      try {
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        console.error('Error fetching balance:', err);
      }
    }
  };

  useEffect(() => {
    if (signer) {
      signer.getAddress().then(setAddress);
    }
  }, [signer]);

  useEffect(() => {
    const checkNetwork = async () => {
      if (provider) {
        const network = await provider.getNetwork();
        setNetwork(network.name);
        
        // If not on Sepolia, prompt to switch
        if (network.name !== 'sepolia') {
          setError('Please switch to Sepolia network');
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
            });
          } catch (err: any) {
            console.error('Error switching network:', err);
          }
        } else {
          setError(null);
        }
      }
    };

    checkNetwork();
    updateBalance();

    // Set up event listeners for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', () => {
          window.location.reload();
        });
      }
    };
  }, [provider, address]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Request switch to Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
        });
      } catch (err: any) {
        console.error('Error switching to Sepolia:', err);
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
    setNetwork(null);
  };

  if (address && balance) {
    return (
      <div className="cyber-border bg-[#0a0a1f]/80 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-[#00f3ff]" />
            <span className="text-[#00f3ff] font-semibold">Web3 Wallet</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={updateBalance}
              className="cyber-button px-2 py-1 rounded-md"
              title="Refresh balance"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={disconnectWallet}
              className="cyber-button px-3 py-1 rounded-md flex items-center space-x-2 text-sm"
            >
              <Power className="h-4 w-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">
            Network: <span className="text-[#00f3ff] capitalize">{network || 'Unknown'}</span>
          </p>
          <p className="text-gray-400 text-sm">
            Address: <span className="text-[#00f3ff]">{address.slice(0, 6)}...{address.slice(-4)}</span>
          </p>
          <p className="text-gray-400 text-sm">
            Balance: <span className="text-[#00f3ff]">{parseFloat(balance).toFixed(4)} SepoliaETH</span>
          </p>
        </div>
        {error && (
          <div className="mt-2 text-red-400 text-sm flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-4 rounded-lg">
      <div className="flex items-center space-x-2 mb-4">
        <AlertCircle className="h-5 w-5 text-[#ff00ff]" />
        <span className="text-[#ff00ff] font-semibold">Wallet Required</span>
      </div>
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="cyber-button w-full px-4 py-2 rounded-md flex items-center justify-center space-x-2"
      >
        <Wallet className="h-4 w-4" />
        <span>
          {isConnecting ? 'Connecting...' : 'Connect to Sepolia'}
        </span>
      </button>
    </div>
  );
}