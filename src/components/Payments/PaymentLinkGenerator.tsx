import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Copy, QrCode } from 'lucide-react';
import { ethers } from 'ethers';
import QRCode from 'qrcode.react';

interface PaymentLinkGeneratorProps {
  userAddress: string | Promise<string>;
}

export function PaymentLinkGenerator({ userAddress }: PaymentLinkGeneratorProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Resolve the promise to get the actual address
    const resolveAddress = async () => {
      if (typeof userAddress === 'string') {
        setAddress(userAddress);
      } else if (userAddress && typeof userAddress.then === 'function') {
        const resolvedAddress = await userAddress;
        setAddress(resolvedAddress);
      }
    };
    resolveAddress();
  }, [userAddress]);

  const generatePaymentLink = () => {
    // Use the actual domain in production
    const baseUrl = import.meta.env.PROD 
      ? 'https://crypto-nex-v2.netlify.app/' // Replace with your actual domain
      : window.location.origin;
    
    const params = new URLSearchParams({
      to: address,
      amount: ethers.utils.parseEther(amount || '0').toString(),
      description: description
    });
    return `${baseUrl}/pay?${params.toString()}`;
  };

  const handleCopy = async () => {
    const link = generatePaymentLink();
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
      <h3 className="text-xl text-[#00f3ff] font-semibold mb-4 flex items-center gap-2">
        <LinkIcon className="h-5 w-5" />
        Generate Payment Link
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Amount (ETH)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white"
            placeholder="0.0"
            step="0.0001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 text-white"
            placeholder="Payment for..."
          />
        </div>

        {amount && address && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0a0a1f] border border-[#00f3ff] rounded-md">
              <span className="text-sm text-gray-400 break-all">
                {generatePaymentLink()}
              </span>
              <button
                onClick={handleCopy}
                className="ml-2 p-2 hover:bg-[#00f3ff]/10 rounded-md"
                title="Copy link"
              >
                <Copy className="h-4 w-4 text-[#00f3ff]" />
              </button>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowQR(!showQR)}
                className="cyber-button px-4 py-2 rounded-md flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                {showQR ? 'Hide' : 'Show'} QR Code
              </button>
              {copied && (
                <span className="text-[#00f3ff] text-sm">Link copied!</span>
              )}
            </div>

            {showQR && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCode value={generatePaymentLink()} size={200} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}