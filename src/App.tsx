import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import { handleGoogleRedirect } from './lib/googleAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';

handleGoogleRedirect();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-[#2563EB]">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-[#111827]">Page not found</h1>
      <p className="mt-2 text-[#6B7280]">The page you're looking for doesn't exist or was moved.</p>
      <a href="/" className="mt-6 inline-flex h-12 items-center rounded-xl bg-[#2563EB] px-8 text-sm font-semibold text-white">
        Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <ScrollToTop />
          <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetails />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
