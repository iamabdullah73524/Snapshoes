import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  ShoppingBag,
  User,
  Bell,
  Heart,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  History,
  Search,
} from "lucide-react";
import axios from "axios";

export default function Navbar() {
  const { user, cart, wishlist, notifications, logout, fetchNotifications } =
    useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await axios.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e5d5cb] bg-[#f7f2ee] shadow-sm">
      <div className="bg-[#f7f2ee]">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <form onSubmit={handleSearchSubmit} className="hidden max-w-md items-center gap-3 rounded-full border border-[#dcc5b7] bg-white/80 px-4 py-2.5 shadow-sm md:flex">
              <Search size={16} className="text-[#6d5d53]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search shoes, sneakers..."
                className="w-full border-0 bg-transparent text-sm text-[#1f1b1a] placeholder:text-[#8a7b73] focus:outline-none"
              />
            </form>

            <Link to="/" className="justify-self-center text-center">
              <span className="font-display text-4xl leading-none tracking-[-0.04em] text-[#181512]">
                SnapShoes
              </span>
            </Link>

            <div className="flex items-center justify-self-end gap-2">
              <Link
                to="/cart"
                className="relative inline-flex items-center justify-center rounded-full border border-[#dcc5b7] bg-white p-2.5 text-[#1c1c1c] transition hover:border-[#b98866] hover:text-[#b98866]"
              >
                <ShoppingBag size={18} />
                {cart.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#b98866] text-[10px] font-black text-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                className="relative inline-flex items-center justify-center rounded-full border border-[#dcc5b7] bg-white p-2.5 text-[#1c1c1c] transition hover:border-[#b98866] hover:text-[#b98866]"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#b98866] text-[10px] font-black text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {user && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserDropdown(false);
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dcc5b7] bg-white text-[#1c1c1c] transition hover:border-[#b98866] hover:text-[#b98866]"
                  >
                    <Bell size={18} />
                  </button>
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#b98866] text-[8px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}

                  {showNotifications && (
                    <div className="absolute right-0 top-12 z-50 w-80 rounded-3xl border border-[#eaded5] bg-white p-4 shadow-2xl">
                      <div className="mb-3 flex items-center justify-between border-b border-[#f1e4df] pb-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1c1c1c]">
                          Notifications
                        </h4>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b98866] hover:text-[#1c1c1c]"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 space-y-2 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-xs text-gray-400">No notifications yet</p>
                        ) : (
                          notifications.map((notif) => (
                            <button
                              key={notif._id}
                              onClick={() => handleNotificationClick(notif._id)}
                              className={`w-full rounded-2xl p-3 text-left text-[11px] transition ${notif.isRead ? "bg-gray-50 text-gray-500" : "border border-[#efd5ca] bg-[#fff9f6] text-[#1c1c1c]"}`}
                            >
                              <p className="font-bold">{notif.message}</p>
                              <span className="mt-1 block text-[10px] text-gray-400">
                                {new Date(notif.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                {user ? (
                  <button
                    onClick={() => {
                      setShowUserDropdown(!showUserDropdown);
                      setShowNotifications(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dcc5b7] bg-white px-3 py-2.5 text-sm font-medium text-[#1c1c1c] transition hover:border-[#b98866] hover:text-[#b98866]"
                  >
                    <User size={17} />
                    <span className="hidden md:inline-block max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-full border border-[#dcc5b7] bg-white px-3 py-2.5 text-xs font-bold uppercase tracking-[0.28em] text-[#1c1c1c] transition hover:border-[#b98866] hover:text-[#b98866]"
                  >
                    <User size={17} />
                    <span>Login</span>
                  </Link>
                )}

                {user && showUserDropdown && (
                  <div className="absolute right-0 top-14 z-50 w-52 rounded-3xl border border-[#eaded5] bg-white p-3 shadow-2xl text-sm text-[#1c1c1c]">
                    <div className="mb-3 rounded-2xl bg-[#f8f1ee] p-3">
                      <p className="truncate font-bold">{user.name}</p>
                      <p className="truncate text-[10px] text-gray-500">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserDropdown(false)}
                        className="mt-1 flex items-center gap-2 rounded-2xl px-3 py-2 transition hover:bg-[#f8f1ee]"
                      >
                        <LayoutDashboard size={16} className="text-[#b98866]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="mt-1 flex items-center gap-2 rounded-2xl px-3 py-2 transition hover:bg-[#f8f1ee]"
                    >
                      <History size={16} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                        navigate("/");
                      }}
                      className="mt-2 w-full rounded-2xl bg-[#1c1c1c] px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.25em] text-white transition hover:bg-[#3a2d28]"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut size={16} />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dcc5b7] bg-white text-[#1c1c1c] transition hover:border-[#b98866] hover:text-[#b98866] lg:hidden"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e5d5cb] bg-[#f7f2ee]">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
          <div className="hidden items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.28em] text-[#473d38] lg:flex">
            <Link to="/" className="transition hover:text-[#b98866]">Home</Link>
            <Link to="/shop" className="transition hover:text-[#b98866]">Collection</Link>
            <Link to="/new-arrivals" className="transition hover:text-[#b98866]">New Arrivals</Link>
            <Link to="/best-sellers" className="transition hover:text-[#b98866]">Best Sellers</Link>
            <Link to="/sale" className="transition hover:text-[#b98866]">Sale</Link>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[84px] z-40 border-t border-[#e5d5cb] bg-[#f7f2ee] px-6 py-6 shadow-2xl lg:hidden">
          <div className="grid gap-3 text-sm font-black uppercase tracking-[0.25em] text-[#1c1c1c]">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-white px-4 py-3 transition hover:bg-[#f3e0d4]">Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-white px-4 py-3 transition hover:bg-[#f3e0d4]">Collection</Link>
            <Link to="/new-arrivals" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-white px-4 py-3 transition hover:bg-[#f3e0d4]">New Arrivals</Link>
            <Link to="/best-sellers" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-white px-4 py-3 transition hover:bg-[#f3e0d4]">Best Sellers</Link>
            <Link to="/sale" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-white px-4 py-3 transition hover:bg-[#f3e0d4]">Sale</Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-white px-4 py-3 transition hover:bg-[#f3e0d4]">Wishlist</Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-white px-4 py-3 transition hover:bg-[#f3e0d4]">Cart</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
