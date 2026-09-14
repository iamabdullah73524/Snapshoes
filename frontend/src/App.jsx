import React from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ProtectedRoute, AdminRoute } from "./components/RouteGuards";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col bg-[#f5f0ea] font-sans antialiased text-[#181512]">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/new-arrivals" element={<Shop />} />
              <Route path="/best-sellers" element={<Shop />} />
              <Route path="/sale" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <ToastContainer />
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex max-w-sm flex-col space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto min-w-[280px] rounded-xl border bg-white p-4 text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-300 ${
            toast.type === "error"
              ? "border-l-4 border-l-red-500 text-red-600"
              : toast.type === "info"
                ? "border-l-4 border-l-blue-500 text-blue-600"
                : "border-l-4 border-l-[#b98866] text-[#181512]"
          }`}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
