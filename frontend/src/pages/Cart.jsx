import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, getCartSubtotal } = useApp();
  const navigate = useNavigate();

  const subtotal = getCartSubtotal();
  const delivery = subtotal > 150 ? 0 : 15;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="page-shell py-12 md:py-20">
        <div className="soft-card p-8 text-center md:p-16">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <ShoppingBag size={36} />
          </div>
          <p className="section-kicker mt-6">Your bag</p>
          <h2 className="mt-2 text-3xl font-black text-brand-dark">Your cart is empty</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
            You haven’t added any shoes to your bag yet. Explore our latest picks and build your perfect pair.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-dark px-8 py-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-white transition hover:bg-brand-orange"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-8 md:py-12">
      <div className="soft-card p-5 md:p-8">
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Shopping bag</p>
            <h1 className="mt-2 text-3xl font-black text-brand-dark">Review your selections</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-orange">
            <Sparkles size={13} />
            <span>{cart.length} item{cart.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_360px]">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartId}
                className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md md:p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[22px] bg-[#faf8f7] p-2 md:h-28 md:w-28">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-brand-dark">{item.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-gray-500">
                          <span className="rounded-full border border-gray-200 bg-[#fafaf9] px-2.5 py-1">Size: {item.size}</span>
                          <span className="rounded-full border border-gray-200 bg-[#fafaf9] px-2.5 py-1">Color: {item.color}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="rounded-xl border border-gray-200 bg-white p-2 text-gray-400 transition hover:border-red-200 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-xl border border-gray-200 bg-[#fafaf9] p-1">
                        <button
                          onClick={() => updateCartQty(item.cartId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-brand-dark"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-brand-dark">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.cartId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-brand-dark"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Price</p>
                        <p className="mt-1 text-xl font-black text-brand-dark">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 pt-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-500 transition hover:text-brand-orange"
            >
              <ArrowLeft size={14} />
              <span>Continue shopping</span>
            </Link>
          </div>

          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="border-b border-gray-100 pb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-brand-dark">
              Order summary
            </h2>

            <div className="mt-5 space-y-3 text-xs font-semibold text-gray-500">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-brand-dark">₹{subtotal.toFixed(2)}</span>
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

              {delivery > 0 && (
                <p className="rounded-2xl bg-[#fafaf9] px-3 py-2 text-[10px] text-gray-500">
                  Spend ₹150.00 or more to unlock free shipping.
                </p>
              )}

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-black">
                <span className="text-brand-dark">Total</span>
                <span className="text-brand-orange">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full rounded-xl bg-brand-dark px-4 py-4 text-[10px] font-extrabold uppercase tracking-[0.3em] text-white transition hover:bg-brand-orange"
            >
              Secure checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
