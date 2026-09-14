import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  User,
  Shield,
  MapPin,
  Trash2,
  Box,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import axios from 'axios';

export default function Profile() {
  const { user, token, addToast } = useApp();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!token) {
      addToast('Please login to access profile details', 'error');
      navigate('/login');
      return;
    }

    fetchProfileData();
  }, [token]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const ordersRes = await axios.get('/orders/my-orders');
      setOrders(ordersRes.data);

      const addrRes = await axios.get('/auth/addresses');
      setAddresses(addrRes.data);
    } catch (err) {
      console.error(err);
      addToast('Error fetching profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!fullName || !street || !city || !state || !postalCode || !phone) {
      addToast('Please fill all address fields', 'error');
      return;
    }

    try {
      await axios.post('/auth/addresses', {
        fullName,
        street,
        city,
        state,
        postalCode,
        phone,
      });
      addToast('Address added!', 'success');
      setFullName('');
      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
      setPhone('');
      setShowAddressForm(false);
      fetchProfileData();
    } catch (err) {
      console.error(err);
      addToast('Error adding address', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`/auth/addresses/${id}`);
      addToast('Address deleted successfully', 'info');
      fetchProfileData();
    } catch (err) {
      console.error(err);
      addToast('Error deleting address', 'error');
    }
  };

  const getStatusStepIndex = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const index = steps.indexOf(status);
    return index === -1 ? 0 : index;
  };

  const totalSpent = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const activeOrders = orders.filter((order) => order.status !== 'Delivered').length;

  if (loading && orders.length === 0) {
    return (
      <div className="page-shell flex min-h-[55vh] items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <div className="page-shell py-8 md:py-12">
      <div className="soft-card p-5 md:p-8">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">My account</p>
            <h1 className="mt-2 text-3xl font-black text-brand-dark">Profile dashboard</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-orange">
            <Sparkles size={13} />
            <span>Live order updates</span>
          </div>
        </div>

        {user && (
          <div className="mt-6 rounded-[28px] bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#2d2d2d] p-5 text-white shadow-[0_16px_40px_rgba(17,17,17,0.15)] md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black uppercase tracking-wide text-brand-orange">
                  {user.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.35em] text-white/60">Welcome back</p>
                  <h2 className="mt-1 text-2xl font-black">{user.name}</h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{user.role}</span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{addresses.length} saved addresses</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-gray-200 bg-[#fafaf9] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Orders</p>
                <p className="mt-3 text-3xl font-black text-brand-dark">{orders.length}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                <ShoppingBag size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-[#fafaf9] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Active</p>
                <p className="mt-3 text-3xl font-black text-brand-dark">{activeOrders}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-dark/5 text-brand-dark">
                <Box size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-[#fafaf9] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Spent</p>
                <p className="mt-3 text-3xl font-black text-brand-dark">₹{totalSpent.toFixed(2)}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                <DollarSign size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <User size={16} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.22em] text-brand-dark">Account</h2>
              </div>

              {user && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-[#fafaf9] p-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Full name</p>
                    <p className="mt-2 text-sm font-bold text-brand-dark">{user.name}</p>
                  </div>

                  <div className="rounded-2xl bg-[#fafaf9] p-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Email</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-brand-dark">
                      <Mail size={14} className="text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#fafaf9] p-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Role</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-brand-orange">
                      <Shield size={14} />
                      <span className="uppercase">{user.role}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                    <MapPin size={16} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.22em] text-brand-dark">Saved addresses</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressForm((prev) => !prev)}
                  className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-orange transition hover:text-brand-dark"
                >
                  {showAddressForm ? 'Close' : '+ Add new'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mt-5 space-y-3 rounded-[24px] border border-gray-200 bg-[#fafaf9] p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold text-brand-dark outline-none transition focus:border-brand-orange"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold text-brand-dark outline-none transition focus:border-brand-orange"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Street Address"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold text-brand-dark outline-none transition focus:border-brand-orange"
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold text-brand-dark outline-none transition focus:border-brand-orange"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold text-brand-dark outline-none transition focus:border-brand-orange"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Postal Code"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold text-brand-dark outline-none transition focus:border-brand-orange"
                  />

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-brand-dark px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-white transition hover:bg-brand-orange"
                  >
                    Save address
                  </button>
                </form>
              )}

              <div className="mt-5 space-y-3">
                {addresses.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-gray-200 bg-[#fafaf9] p-6 text-center">
                    <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-gray-400">No addresses saved yet</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="flex items-start justify-between gap-4 rounded-[22px] border border-gray-200 bg-[#fafaf9] p-4 transition hover:bg-white"
                    >
                      <div className="space-y-1 text-xs font-semibold text-gray-600">
                        <p className="text-sm font-black text-brand-dark">{addr.fullName}</p>
                        <p>{addr.street}</p>
                        <p>
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="pt-1 text-[10px] uppercase tracking-[0.18em] text-gray-400">Ph: {addr.phone}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="rounded-xl border border-gray-200 bg-white p-2 text-gray-400 transition hover:border-red-200 hover:text-red-500"
                        aria-label="Delete address"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Box size={16} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.22em] text-brand-dark">Orders & tracking</h2>
            </div>

            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
                  <Box size={36} className="mx-auto text-gray-300" />
                  <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.28em] text-gray-400">No orders placed yet</p>
                  <p className="mt-2 text-xs text-gray-500">Your order history and real-time tracking will appear here.</p>
                </div>
              ) : (
                orders.map((order) => {
                  const currentIdx = getStatusStepIndex(order.status);
                  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

                  return (
                    <div key={order._id} className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                      <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Order ID</p>
                          <p className="mt-1 text-sm font-black text-brand-dark">#{order._id}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="font-black text-brand-orange">₹{Number(order.totalPrice || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Items ordered</p>
                        <div className="grid gap-2 md:grid-cols-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 rounded-2xl bg-[#fafaf9] p-2.5 text-xs font-semibold text-gray-600">
                              <span className="text-sm font-black text-brand-orange">x{item.quantity}</span>
                              <span className="truncate">{item.name} ({item.size}/{item.color})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Delivery status</p>

                        <div className="relative mx-auto mt-6 w-full max-w-xl pb-2 pt-4">
                          <div className="absolute left-0 top-8.5 z-0 h-1 w-full bg-gray-200" />
                          <div
                            className="absolute left-0 top-8.5 z-0 h-1 bg-brand-orange transition-all duration-500"
                            style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                          />

                          <div className="relative z-10 flex items-start justify-between">
                            {steps.map((step, i) => {
                              const isActive = i <= currentIdx;
                              const isCurrent = i === currentIdx;

                              return (
                                <div key={step} className="flex flex-col items-center text-center">
                                  <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black transition-all duration-300 ${
                                      isCurrent
                                        ? 'border-brand-orange bg-white text-brand-orange shadow-md'
                                        : isActive
                                          ? 'border-brand-orange bg-brand-orange text-white'
                                          : 'border-gray-200 bg-white text-gray-300'
                                    }`}
                                  >
                                    {isActive && i < currentIdx ? <CheckCircle size={14} /> : i + 1}
                                  </div>
                                  <span
                                    className={`mt-2 text-[9px] font-extrabold uppercase tracking-[0.22em] ${
                                      isCurrent ? 'text-brand-orange' : isActive ? 'text-brand-dark' : 'text-gray-300'
                                    }`}
                                  >
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {order.trackingHistory?.length > 0 && (
                        <div className="mt-6 rounded-[24px] border border-gray-200 bg-[#fafaf9] p-4">
                          <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">
                            <Clock size={11} />
                            <span>Tracking log</span>
                          </div>

                          <div className="space-y-2 text-[10px] text-gray-500">
                            {order.trackingHistory.map((history, idx) => (
                              <div key={idx} className="flex items-start justify-between gap-3 border-l border-gray-200 pl-2">
                                <p className="leading-relaxed">
                                  <span className="font-black uppercase text-brand-dark">{history.status}:</span> {history.comment}
                                </p>
                                <span className="shrink-0 text-[8px] font-bold uppercase tracking-[0.18em] text-gray-400">
                                  {new Date(history.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
