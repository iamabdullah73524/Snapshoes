import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  CreditCard,
  Truck,
  ShieldAlert,
  ArrowLeft,
  Plus,
  Check,
  Sparkles,
  MapPin,
} from "lucide-react";
import axios from "axios";

export default function Checkout() {
  const { cart, getCartSubtotal, clearCart, user, addToast } = useApp();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const subtotal = getCartSubtotal();
  const delivery = subtotal > 150 ? 0 : 15;
  const total = subtotal + delivery;
  const WHATSAPP_NUMBER = "918210314098";

  useEffect(() => {
    if (!user) {
      addToast("Please login to checkout your shopping bag", "error");
      navigate("/login?redirect=checkout");
      return;
    }
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("/auth/addresses");
      setAddresses(res.data);
      if (res.data.length > 0) {
        const def = res.data.find((a) => a.isDefault);
        setSelectedAddressId(def ? def._id : res.data[0]._id);
      } else {
        setShowNewAddressForm(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!fullName || !street || !city || !state || !postalCode || !phone) {
      addToast("Please fill all address fields", "error");
      return;
    }

    try {
      await axios.post("/auth/addresses", {
        fullName,
        street,
        city,
        state,
        postalCode,
        phone,
        isDefault: true,
      });
      addToast("Address added successfully!", "success");

      setFullName("");
      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setPhone("");
      setShowNewAddressForm(false);

      fetchAddresses();
    } catch (err) {
      console.error(err);
      addToast("Error saving address details", "error");
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    if (showNewAddressForm) {
      addToast("Please save your new address or select an existing one", "error");
      return;
    }

    const addr = addresses.find((a) => a._id === selectedAddressId);
    if (!addr) {
      addToast("Please select or add a shipping address", "error");
      return;
    }

    const shippingAddress = {
      fullName: addr.fullName,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || "India",
      phone: addr.phone,
    };

    const orderItems = cart
      .map(
        (item) =>
          `• ${item.name} (${item.size}) x${item.quantity} - ₹${(
            item.price * item.quantity
          ).toFixed(2)}`,
      )
      .join("\n");

    const whatsappMessage = `
🛍️ *New SnapShoes Order*

👤 Customer: ${shippingAddress.fullName}
📞 Phone: ${shippingAddress.phone}

📍 Address:
${shippingAddress.street}
${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}

━━━━━━━━━━━━━━

${orderItems}

━━━━━━━━━━━━━━

💰 Total: ₹${total.toFixed(2)}

Payment Method: ${paymentMethod}
`;

    setLoading(true);
    try {
      await axios.post("/orders", {
        items: cart,
        shippingAddress,
        totalPrice: total,
        paymentMethod,
      });

      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        whatsappMessage,
      )}`;

      window.open(whatsappURL, "_blank");

      addToast("Order placed successfully!", "success");

      clearCart();

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Error placing order", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-shell py-20">
        <div className="soft-card p-8 text-center md:p-16">
          <p className="section-kicker">Checkout</p>
          <h2 className="mt-2 text-3xl font-black text-brand-dark">No items to checkout</h2>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-dark px-8 py-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-white transition hover:bg-brand-orange"
          >
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-8 md:py-12">
      <div className="soft-card p-5 md:p-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-500 transition hover:text-brand-orange"
        >
          <ArrowLeft size={14} />
          <span>Return to bag</span>
        </Link>

        <div className="mt-6 flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Checkout</p>
            <h1 className="mt-2 text-3xl font-black text-brand-dark">Complete your order</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-orange">
            <Sparkles size={13} />
            <span>Fast secure checkout</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <Truck size={16} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.22em] text-brand-dark">Shipping address</h2>
              </div>

              {addresses.length > 0 && !showNewAddressForm && (
                <div className="mt-5 space-y-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">
                    Select saved address
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`relative cursor-pointer rounded-3xl border p-4 transition ${
                          selectedAddressId === addr._id
                            ? 'border-brand-dark bg-brand-dark/5 shadow-sm'
                            : 'border-gray-200 bg-[#fafaf9] hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-black text-brand-dark">{addr.fullName}</h3>
                            <p className="mt-2 text-xs font-semibold leading-relaxed text-gray-600">
                              {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                              Ph: {addr.phone}
                            </p>
                          </div>

                          {selectedAddressId === addr._id && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-dark text-white">
                              <Check size={12} />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-orange transition hover:text-brand-dark"
                  >
                    <Plus size={14} />
                    <span>Use a different address</span>
                  </button>
                </div>
              )}

              {showNewAddressForm && (
                <form onSubmit={handleAddNewAddress} className="mt-5 space-y-4 rounded-3xl border border-gray-200 bg-[#fafaf9] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">
                      Enter new address
                    </p>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-gray-500 transition hover:text-brand-orange"
                      >
                        Use saved address
                      </button>
                    )}
                  </div>

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
                    className="rounded-xl bg-brand-dark px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.28em] text-white transition hover:bg-brand-orange"
                  >
                    Save address
                  </button>
                </form>
              )}
            </div>

            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <CreditCard size={16} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.22em] text-brand-dark">Payment method</h2>
              </div>

              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-brand-dark bg-brand-dark/5 p-4 transition">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={() => setPaymentMethod("Cash on Delivery")}
                    className="mt-1 accent-brand-orange"
                  />
                  <div>
                    <p className="text-sm font-black text-brand-dark">Cash on Delivery (COD)</p>
                    <p className="mt-1 text-xs text-gray-500">Pay when your order arrives at your doorstep.</p>
                  </div>
                </label>

                <label className="flex cursor-not-allowed items-start gap-3 rounded-3xl border border-gray-200 bg-white p-4 opacity-70">
                  <input type="radio" name="payment" disabled className="mt-1 accent-brand-orange" />
                  <div>
                    <p className="text-sm font-black text-brand-dark">Credit / Debit Card</p>
                    <p className="mt-1 text-xs text-gray-500">Temporarily unavailable. COD remains active.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <MapPin size={16} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.22em] text-brand-dark">Order summary</h2>
              </div>

              <div className="mt-5 space-y-3">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex items-center justify-between gap-3 rounded-2xl bg-[#fafaf9] p-3 text-xs font-semibold text-gray-600">
                    <span className="truncate">
                      {item.name} <span className="text-brand-dark">x{item.quantity}</span>
                    </span>
                    <span className="font-black text-brand-dark">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated delivery</span>
                  <span>
                    {delivery === 0 ? (
                      <span className="font-black text-emerald-500">FREE</span>
                    ) : (
                      `₹${delivery.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-black">
                  <span className="text-brand-dark">Total</span>
                  <span className="text-brand-orange">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || (addresses.length === 0 && showNewAddressForm)}
                className={`mt-6 w-full rounded-xl px-4 py-4 text-[10px] font-extrabold uppercase tracking-[0.3em] text-white transition ${
                  loading ? 'cursor-not-allowed bg-gray-400' : 'bg-brand-orange hover:bg-brand-dark'
                }`}
              >
                {loading ? 'Processing order...' : 'Place order securely'}
              </button>
            </div>

            <div className="flex items-start gap-3 rounded-3xl border border-gray-200 bg-[#fafaf9] p-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              <ShieldAlert size={18} className="mt-0.5 shrink-0 text-brand-orange" />
              <span>By placing this order, you agree to our premium sneaker concepts and delivery timeline terms.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
