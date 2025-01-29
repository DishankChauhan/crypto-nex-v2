import React from 'react';
import { Github, Twitter, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0a0a1f] border-t border-[#00f3ff]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[#00f3ff] font-semibold mb-4">About CryptoNex</h3>
            <p className="text-gray-400 text-sm">
              Leading the future of decentralized payments with cutting-edge blockchain technology.
            </p>
          </div>
          <div>
            <h3 className="text-[#00f3ff] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00f3ff] text-sm">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00f3ff] text-sm">API Reference</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00f3ff] text-sm">Support</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#00f3ff] font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00f3ff]">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00f3ff]">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00f3ff]">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#00f3ff]/20">
          <p className="text-center text-gray-400 text-sm">
            © 2024 CryptoNex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}