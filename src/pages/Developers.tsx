import React, { useState } from 'react';
import { Code, Copy, Terminal, Book, Key, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Developers() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('quickstart');
  const [copied, setCopied] = useState('');

  const apiKey = 'YOUR_API_KEY'; // In production, this would come from your backend

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const apiDocs = {
    endpoints: [
      {
        name: 'Create Payment',
        method: 'POST',
        path: '/api/v1/payments',
        description: 'Create a new crypto payment',
        parameters: [
          { name: 'amount', type: 'string', required: true, description: 'Amount in ETH' },
          { name: 'recipient', type: 'string', required: true, description: 'Recipient address' },
          { name: 'description', type: 'string', required: false, description: 'Payment description' }
        ]
      },
      {
        name: 'Get Transaction',
        method: 'GET',
        path: '/api/v1/transactions/:id',
        description: 'Get transaction details',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Transaction ID' }
        ]
      },
      {
        name: 'List Transactions',
        method: 'GET',
        path: '/api/v1/transactions',
        description: 'List all transactions',
        parameters: [
          { name: 'limit', type: 'number', required: false, description: 'Number of results' },
          { name: 'offset', type: 'number', required: false, description: 'Pagination offset' }
        ]
      }
    ]
  };

  const sdkDocs = {
    installation: `npm install @cryptonex/sdk`,
    initialization: `import { CryptoNex } from '@cryptonex/sdk';

const cryptonex = new CryptoNex({
  apiKey: 'YOUR_API_KEY',
  network: 'sepolia' // or 'mainnet'
});`,
    examples: [
      {
        title: 'Create Payment',
        code: `const payment = await cryptonex.createPayment({
  amount: '0.1',
  recipient: '0x...',
  description: 'Payment for services'
});`
      },
      {
        title: 'Get Transaction',
        code: `const tx = await cryptonex.getTransaction('tx_123');`
      },
      {
        title: 'List Transactions',
        code: `const txs = await cryptonex.listTransactions({
  limit: 10,
  offset: 0
});`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
          <h1 className="text-3xl text-[#00f3ff] font-bold mb-8">Developer Documentation</h1>

          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('quickstart')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'quickstart'
                  ? 'bg-[#00f3ff] text-[#0a0a1f]'
                  : 'border border-[#00f3ff] text-[#00f3ff]'
              }`}
            >
              Quick Start
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'api'
                  ? 'bg-[#00f3ff] text-[#0a0a1f]'
                  : 'border border-[#00f3ff] text-[#00f3ff]'
              }`}
            >
              API Reference
            </button>
            <button
              onClick={() => setActiveTab('sdk')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'sdk'
                  ? 'bg-[#00f3ff] text-[#0a0a1f]'
                  : 'border border-[#00f3ff] text-[#00f3ff]'
              }`}
            >
              SDK Documentation
            </button>
          </div>

          {activeTab === 'api' && (
            <div className="space-y-8">
              <h2 className="text-xl text-[#00f3ff] font-semibold mb-4">API Reference</h2>
              
              <div className="space-y-6">
                {apiDocs.endpoints.map((endpoint, index) => (
                  <div key={index} className="border border-[#00f3ff]/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg text-[#00f3ff] font-medium">{endpoint.name}</h3>
                      <span className="px-3 py-1 bg-[#00f3ff]/10 rounded text-[#00f3ff] text-sm">
                        {endpoint.method} {endpoint.path}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">{endpoint.description}</p>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-[#00f3ff]">Parameters:</h4>
                      {endpoint.parameters.map((param, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <span className="text-[#ff00ff] w-24">{param.name}</span>
                          <span className="text-gray-400 w-20">{param.type}</span>
                          <span className="text-gray-400">
                            {param.required && <span className="text-red-400 mr-2">required</span>}
                            {param.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sdk' && (
            <div className="space-y-8">
              <h2 className="text-xl text-[#00f3ff] font-semibold mb-4">SDK Documentation</h2>
              
              <div className="space-y-6">
                <div className="border border-[#00f3ff]/20 rounded-lg p-6">
                  <h3 className="text-lg text-[#00f3ff] font-medium mb-4">Installation</h3>
                  <div className="bg-[#0a0a1f] p-4 rounded-lg relative">
                    <code className="text-[#00f3ff]">{sdkDocs.installation}</code>
                    <button
                      onClick={() => handleCopy(sdkDocs.installation, 'install')}
                      className="absolute right-4 top-4 text-gray-400 hover:text-[#00f3ff]"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="border border-[#00f3ff]/20 rounded-lg p-6">
                  <h3 className="text-lg text-[#00f3ff] font-medium mb-4">Initialization</h3>
                  <div className="bg-[#0a0a1f] p-4 rounded-lg relative">
                    <pre className="text-[#00f3ff] whitespace-pre-wrap">{sdkDocs.initialization}</pre>
                    <button
                      onClick={() => handleCopy(sdkDocs.initialization, 'init')}
                      className="absolute right-4 top-4 text-gray-400 hover:text-[#00f3ff]"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="border border-[#00f3ff]/20 rounded-lg p-6">
                  <h3 className="text-lg text-[#00f3ff] font-medium mb-4">Examples</h3>
                  {sdkDocs.examples.map((example, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h4 className="text-[#00f3ff] font-medium mb-2">{example.title}</h4>
                      <div className="bg-[#0a0a1f] p-4 rounded-lg relative">
                        <pre className="text-[#00f3ff] whitespace-pre-wrap">{example.code}</pre>
                        <button
                          onClick={() => handleCopy(example.code, `example-${index}`)}
                          className="absolute right-4 top-4 text-gray-400 hover:text-[#00f3ff]"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}