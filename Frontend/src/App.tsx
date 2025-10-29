import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import About from "@/pages/about";
import Sell from "@/pages/sell";
import SellNew from "@/pages/sell-new";
import BuyProducts from "@/pages/buyproducts"; 
import WasteDonationPage from "./pages/waste-donation";
import WasteSubmitPage from "./pages/waste-submit"
import WishlistPage from "./pages/wishlist"
import CartPage from "./pages/cart"
import CheckoutPage from "./pages/checkout"
import AccountPage from "./pages/account"
import OrdersPage from "./pages/orders"
import MyListingsPage from "./pages/my-listings";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-4">The application encountered an error.</p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-48">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/sell/new" element={<SellNew />} />
          <Route path="/buy" element={<BuyProducts />} /> {/* ✅ new route */}
          <Route path="/waste-donation" element={<WasteDonationPage />} /> 
          <Route path="/waste-donation/submit" element={<WasteSubmitPage />} />
          <Route path="/wishlist" element={<WishlistPage />} /> 
          <Route path="/cart" element={<CartPage />} /> 
          <Route path="/account" element={<AccountPage />} />  
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />    
          {/* optional: 404 page */}
          {/* <Route path="*" element={<div className="p-6">Page Not Found</div>} /> */}
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;
