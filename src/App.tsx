import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProductsPage } from './pages/ProductsPage';
import { LiveBiddingPage } from './pages/LiveBiddingPage';
import { UserDashboard } from './pages/UserDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/bidding" element={<LiveBiddingPage />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              {/* More routes will be added here */}
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
