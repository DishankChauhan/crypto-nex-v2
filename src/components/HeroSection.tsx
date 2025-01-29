import React from 'react';
import { Shield, Zap, Globe, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-[#0a0a1f] min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-[#00f3ff]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gradient-to-t from-[#ff00ff]/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl tracking-tight font-extrabold text-[#00f3ff] sm:text-5xl md:text-6xl mb-8">
            <span className="block mb-4">The Future of</span>
            <span className="block text-[#ff00ff]">Crypto Payments</span>
          </h1>
          <p className="mt-8 mb-12 text-base text-gray-400 sm:text-lg md:text-xl max-w-2xl mx-auto">
            Experience seamless, secure, and lightning-fast cryptocurrency transactions. Join the revolution of decentralized finance.
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="cyber-border bg-[#0a0a1f]/90 p-6 rounded-lg">
              <div className="text-3xl font-bold text-[#00f3ff] mb-2">$10M+</div>
              <div className="text-gray-400">Total Volume</div>
            </div>
            <div className="cyber-border bg-[#0a0a1f]/90 p-6 rounded-lg">
              <div className="text-3xl font-bold text-[#ff00ff] mb-2">50K+</div>
              <div className="text-gray-400">Transactions</div>
            </div>
            <div className="cyber-border bg-[#0a0a1f]/90 p-6 rounded-lg">
              <div className="text-3xl font-bold text-[#00f3ff] mb-2">10K+</div>
              <div className="text-gray-400">Users</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="cyber-border bg-[#0a0a1f]/90 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
              <Shield className="h-12 w-12 text-[#00f3ff] mx-auto mb-4" />
              <h3 className="text-xl text-[#00f3ff] font-semibold mb-3">Secure</h3>
              <p className="text-gray-400">Advanced encryption and multi-sig security for your peace of mind</p>
            </div>
            
            <div className="cyber-border bg-[#0a0a1f]/90 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
              <Zap className="h-12 w-12 text-[#ff00ff] mx-auto mb-4" />
              <h3 className="text-xl text-[#ff00ff] font-semibold mb-3">Fast</h3>
              <p className="text-gray-400">Lightning-fast transaction processing with minimal fees</p>
            </div>
            
            <div className="cyber-border bg-[#0a0a1f]/90 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
              <Globe className="h-12 w-12 text-[#00f3ff] mx-auto mb-4" />
              <h3 className="text-xl text-[#00f3ff] font-semibold mb-3">Global</h3>
              <p className="text-gray-400">Borderless transactions worldwide with instant settlements</p>
            </div>
          </div>

          {/* Web3 Integration Section */}
          <div className="mt-20">
            <div className="cyber-border bg-[#0a0a1f]/90 p-8 rounded-lg max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#00f3ff] mb-6">Web3 Integration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <ArrowRight className="h-5 w-5 text-[#ff00ff]" />
                    <span className="text-gray-400">MetaMask Integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ArrowRight className="h-5 w-5 text-[#ff00ff]" />
                    <span className="text-gray-400">Smart Contract Security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ArrowRight className="h-5 w-5 text-[#ff00ff]" />
                    <span className="text-gray-400">Multi-Chain Support</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <ArrowRight className="h-5 w-5 text-[#ff00ff]" />
                    <span className="text-gray-400">Batch Transactions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ArrowRight className="h-5 w-5 text-[#ff00ff]" />
                    <span className="text-gray-400">Real-time Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ArrowRight className="h-5 w-5 text-[#ff00ff]" />
                    <span className="text-gray-400">Transaction History</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}