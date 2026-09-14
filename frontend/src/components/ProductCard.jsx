import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
  const { addToWishlist, wishlist } = useApp();
  const navigate = useNavigate();
  const hasSale = product.salePrice && product.salePrice < product.price;
  const isWishlisted = wishlist.some((item) => item._id === product._id);

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative flex cursor-pointer flex-col rounded-[26px] border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addToWishlist(product);
        }}
        aria-label="Add to wishlist"
        aria-pressed={isWishlisted}
        className={`absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
          isWishlisted
            ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
            : 'border-gray-200 bg-white text-gray-500 hover:border-brand-orange hover:text-brand-orange'
        }`}
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {hasSale && (
        <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-white">
          sale!
        </span>
      )}

      {product.inventory === 0 && (
        <span className="absolute right-4 top-16 rounded-full bg-brand-dark px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-white">
          out of stock
        </span>
      )}

      <div className="flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-[22px] bg-[#f8f8f8] p-3">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
            {product.brand}
          </span>
          <h3 className="truncate text-sm font-bold text-brand-dark transition group-hover:text-brand-orange">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  fill={i < Math.floor(product.rating || 4) ? 'currentColor' : 'none'}
                  className={i < Math.floor(product.rating || 4) ? 'text-amber-400' : 'text-gray-200'}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-gray-400">({product.reviewCount || 0})</span>
          </div>

          <div className="text-right">
            {hasSale ? (
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs text-gray-400 line-through">₹{Number(product.price || 0).toFixed(2)}</span>
                <span className="text-xs font-extrabold text-brand-dark">₹{Number(product.salePrice || 0).toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-xs font-extrabold text-brand-dark">₹{Number(product.price || 0).toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
