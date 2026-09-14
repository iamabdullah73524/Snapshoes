import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, X, Heart, Sparkles } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart, addToast, clearWishlist } = useApp();
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    if (product.inventory === 0) {
      addToast('This product is out of stock', 'error');
      return;
    }

    const size = product.sizes?.[0] || 'One size';
    const color = product.colors?.[0] || 'Standard';
    addToCart(product, 1, size, color);
    navigate('/cart');
  };

  const totalValue = wishlist.reduce((sum, product) => {
    const value = Number(product.salePrice && product.salePrice < product.price ? product.salePrice : product.price) || 0;
    return sum + value;
  }, 0);

  return (
    <div className="page-shell py-8 md:py-12">
      <div className="soft-card p-5 md:p-8">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Saved picks</p>
            <h1 className="mt-2 text-3xl font-black text-brand-dark">My wishlist</h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.28em] text-brand-dark transition hover:bg-gray-50"
            >
              <X size={16} />
              Clear wishlist
            </button>
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-gray-200 bg-[#fafaf9] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Items saved</p>
              <p className="mt-3 text-3xl font-black text-brand-dark">{wishlist.length}</p>
            </div>
            <div className="rounded-[24px] border border-gray-200 bg-[#fafaf9] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Wishlist value</p>
              <p className="mt-3 text-3xl font-black text-brand-dark">₹{totalValue.toFixed(2)}</p>
            </div>
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="mt-8 rounded-[32px] border border-dashed border-gray-200 bg-[#fafaf9] p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10 mx-auto">
              <Heart size={36} className="text-brand-orange" />
            </div>
            <h2 className="mt-6 text-2xl font-black text-brand-dark">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-gray-500">Save the products you love and return whenever you’re ready to buy.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-dark px-8 py-3 text-[10px] font-extrabold uppercase tracking-[0.32em] text-white transition hover:bg-brand-orange"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="group overflow-hidden rounded-[30px] border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[230px_1fr]">
                  <div className="relative flex items-center justify-center overflow-hidden rounded-[24px] bg-[#faf8f7] p-4">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                      alt={product.name}
                      className="max-h-52 object-contain transition duration-500 group-hover:scale-110"
                    />
                    {product.inventory === 0 && (
                      <span className="absolute right-3 top-3 rounded-full bg-brand-dark px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-white">
                        Out of stock
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">{product.brand}</p>
                      <h2 className="mt-2 text-xl font-black text-brand-dark">{product.name}</h2>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-3">{product.description || 'No description available.'}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-gray-500">
                      <span className="rounded-full border border-gray-200 bg-[#fafaf9] px-2.5 py-1.5">
                        {product.sizes?.length ? product.sizes[0] : 'One Size'}
                      </span>
                      <span className="rounded-full border border-gray-200 bg-[#fafaf9] px-2.5 py-1.5">
                        {product.colors?.length ? product.colors[0] : 'Standard Color'}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-gray-400">Price</p>
                        <p className="mt-1 text-xl font-black text-brand-dark">
                          ₹{(product.salePrice && product.salePrice < product.price ? product.salePrice : product.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBuyNow(product)}
                          className="inline-flex items-center gap-2 rounded-xl bg-brand-dark px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.28em] text-white transition hover:bg-brand-orange"
                        >
                          <ShoppingCart size={14} />
                          Buy now
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-3 text-brand-dark transition hover:border-brand-orange hover:text-brand-orange"
                          aria-label="Remove from wishlist"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
