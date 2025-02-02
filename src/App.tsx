import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { LogIn, LogOut, Cpu, ChevronRight, Wallet, LineChart, Newspaper } from 'lucide-react';
import { Web3Wallet } from './components/Web3Wallet';
import { CryptoPriceTracker } from './components/CryptoPriceTracker';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';
import { PaymentForm } from './components/PaymentForm';
import { BatchPaymentForm } from './components/Payments/BatchPaymentForm';
import { TransactionHistory } from './components/TransactionHistory';
import { TransactionDashboard } from './components/Analytics/TransactionDashboard';
import { Charts } from './pages/Charts';
import { News } from './pages/News';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
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
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <Link
                    to="/charts"
                    className="text-[#00f3ff] hover:text-[#00f3ff]/80 flex items-center gap-2"
                  >
                    <LineChart className="h-5 w-5" />
                    Charts
                  </Link>
                  <Link
                    to="/news"
                    className="text-[#00f3ff] hover:text-[#00f3ff]/80 flex items-center gap-2"
                  >
                    <Newspaper className="h-5 w-5" />
                    News
                  </Link>
                </>
              )}
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

      <Routes>
        <Route path="/charts" element={<Charts />} />
        <Route path="/news" element={<News />} />
        <Route path="/" element={
          !user ? (
            <HeroSection />
          ) : (
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <Web3Wallet provider={provider} signer={signer} />
                    {provider && signer && (
                      <PaymentForm provider={provider} signer={signer} />
                    )}
                  </div>

                  <div className="space-y-6">
                    <TransactionHistory provider={provider} />
                  </div>
                </div>

                {provider && signer && (
                  <BatchPaymentForm provider={provider} signer={signer} />
                )}

                <TransactionDashboard />
              </div>
            </main>
          )
        } />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;