import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { LogIn, LogOut, Cpu, ChevronRight, Wallet } from 'lucide-react';
import { Web3Wallet } from './components/Web3Wallet';
import { CryptoPriceTracker } from './components/CryptoPriceTracker';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';
import { PaymentForm } from './components/PaymentForm';
import { BatchPaymentForm } from './components/Payments/BatchPaymentForm';
import { TransactionHistory } from './components/TransactionHistory';
import { TransactionDashboard } from './components/Analytics/TransactionDashboard';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

function AppContent() {
  const { user } = useAuth();
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);

  React.useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      setSigner(web3Provider.getSigner());
    }
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510]">
      <nav className="bg-[#0a0a1f] border-b border-[#00f3ff] shadow-lg shadow-[#00f3ff]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <Cpu className="h-6 w-6 text-[#00f3ff]" />
              <h1 className="text-xl font-bold cyber-text">CryptoNex</h1>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="cyber-border rounded-full p-0.5">
                    <img
                      src={user.photoURL || ''}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                  <span className="text-[#00f3ff]">{user.displayName}</span>
                  <button
                    onClick={handleSignOut}
                    className="cyber-button px-4 py-2 rounded-md flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="cyber-button px-4 py-2 rounded-md flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Connect</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CryptoPriceTracker />

      {!user ? (
        <HeroSection />
      ) : (
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet and Payment Section */}
              <div className="space-y-6">
                <Web3Wallet provider={provider} signer={signer} />
                {provider && signer && (
                  <PaymentForm provider={provider} signer={signer} />
                )}
              </div>

              {/* Transaction History */}
              <div className="space-y-6">
                <TransactionHistory provider={provider} />
              </div>
            </div>

            {/* Batch Payments */}
            {provider && signer && (
              <BatchPaymentForm provider={provider} signer={signer} />
            )}

            {/* Analytics Dashboard */}
            <TransactionDashboard />
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;