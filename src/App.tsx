import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { LogIn, LogOut, Cpu, ChevronRight, Wallet, LineChart, Newspaper, Code, TrendingUp } from 'lucide-react';
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
import { PaymentDashboard } from './pages/PaymentDashboard';
import { Developers } from './pages/Developers';
import { PaymentLinkGenerator } from './components/Payments/PaymentLinkGenerator';
import { CryptoFiatConverter } from './components/Payments/CryptoFiatConverter';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}

function PaymentPage({ provider, signer }: { provider: ethers.providers.Web3Provider | null, signer: ethers.Signer | null }) {
  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Web3Wallet provider={provider} signer={signer} />
            {provider && signer && (
              <PaymentForm provider={provider} signer={signer} />
            )}
            <PaymentLinkGenerator userAddress={signer ? signer.getAddress().toString() : ''} />
          </div>

          <div className="space-y-6">
            <TransactionHistory provider={provider} />
            <CryptoFiatConverter />
          </div>
        </div>

        {provider && signer && (
          <BatchPaymentForm provider={provider} signer={signer} />
        )}

        <TransactionDashboard />
      </div>
    </main>
  );
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
              <Link to="/" className="flex items-center space-x-2">
                <Cpu className="h-6 w-6 text-[#00f3ff]" />
                <h1 className="text-xl font-bold cyber-text">CryptoNex</h1>
              </Link>
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
                  <Link
                    to="/dashboard"
                    className="text-[#00f3ff] hover:text-[#00f3ff]/80 flex items-center gap-2"
                  >
                    <TrendingUp className="h-5 w-5" />
                    Dashboard
                  </Link>
                </>
              )}
              <Link
                to="/developers"
                className="text-[#00f3ff] hover:text-[#00f3ff]/80 flex items-center gap-2"
              >
                <Code className="h-5 w-5" />
                Developers
              </Link>
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
        <Route path="/dashboard" element={<PaymentDashboard />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/pay" element={
          user ? (
            <div className="max-w-2xl mx-auto py-12 px-4">
              <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
                <h2 className="text-2xl text-[#00f3ff] font-bold mb-6">Complete Payment</h2>
                {provider && signer && (
                  <PaymentForm provider={provider} signer={signer} />
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-12 px-4">
              <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg text-center">
                <h2 className="text-2xl text-[#00f3ff] font-bold mb-4">Sign In to Complete Payment</h2>
                <p className="text-gray-400 mb-6">Please sign in to complete this payment.</p>
                <button
                  onClick={signInWithGoogle}
                  className="cyber-button px-6 py-3 rounded-md flex items-center space-x-2 mx-auto"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In with Google</span>
                </button>
              </div>
            </div>
          )
        } />
        <Route path="/" element={
          !user ? (
            <HeroSection />
          ) : (
            <PaymentPage provider={provider} signer={signer} />
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