import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const categoryCards = [
  { name: 'Sneakers', image: '/images/white.avif', href: '/shop?category=Sneakers' },
  { name: 'Casual', image: '/images/air.avif', href: '/shop?category=Casual' },
  { name: 'Formal', image: '/images/porsche.avif', href: '/shop?category=Formal' },
  { name: 'Sports', image: '/images/cloud.avif', href: '/shop?category=Sports' },
  { name: 'Boots', image: '/images/ninja.avif', href: '/shop?category=Boots' },
  { name: 'Heels', image: '/images/Retro.avif', href: '/shop?category=Heels' },
];

export default function Home() {
  const { products, loadProducts, loading } = useApp();

  useEffect(() => {
    loadProducts();
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivalProduct = products[0] || null;
  const editorialProduct = products[1] || products[0] || null;
  const saleProduct = products.find((p) => p.salePrice && p.salePrice < p.price) || products[0] || null;

  return (
    <div className="w-full bg-[#f5f0ea] text-[#181512]">
      <section className="relative isolate overflow-hidden border-b border-[#e5d5cb] bg-[#1c1c1c]">
        <video
          src="/videos/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/45" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 md:px-12 lg:pb-28 lg:pt-28">
          <div className="max-w-xl pt-10 text-[#f7f2ee] md:pt-16">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.42em] text-[#f7cfb3]">
              New Season
            </p>
            <h1 className="font-display text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl lg:text-[6rem]">
              Step Into
              <br />
              Your Style
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#efe3db]">
              Discover shoes made for everyday comfort, effortless styling, and confident movement.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#f7f2ee] px-7 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#181512] transition hover:bg-[#f0dccd]"
              >
                Shop Collection
                <ChevronRight size={16} />
              </Link>
              <Link
                to="/new-arrivals"
                className="inline-flex items-center gap-2 rounded-full border border-[#f7f2ee]/60 bg-transparent px-7 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f7f2ee] transition hover:bg-[#f7f2ee]/10"
              >
                Explore now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#8d6e5b]">Curated styles</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.04em] text-[#181512] md:text-5xl">
                Shop by Category
              </h2>
            </div>
            <Link to="/shop" className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#181512] transition hover:text-[#b98866]">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categoryCards.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="group overflow-hidden rounded-[28px] border border-[#e5d5cb] bg-[#fbf8f6] p-3 transition hover:-translate-y-1 hover:border-[#c9a88e]"
              >
                <div className="overflow-hidden rounded-[22px] bg-[#efe6df]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 md:h-56"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#181512]">
                    {category.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8d6e5b]">Explore</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f4f1] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#8d6e5b]">Top picks</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.04em] text-[#181512] md:text-5xl">
                Best Sellers
              </h2>
            </div>
            <Link to="/best-sellers" className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#181512] transition hover:text-[#b98866]">
              See all
            </Link>
          </div>

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-[28px] bg-[#ece2db]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.length > 0 ? (
                bestSellers.map((product) => <ProductCard key={product._id} product={product} />)
              ) : (
                <div className="col-span-full rounded-[28px] border border-[#e5d5cb] bg-white p-10 text-center">
                  <p className="text-sm uppercase tracking-[0.25em] text-[#7a685e]">No best sellers yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid items-center gap-8 rounded-[34px] border border-[#e5d5cb] bg-[#f5efe9] p-5 md:p-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="overflow-hidden rounded-[28px] bg-[#ece0d8] p-4">
              <img
                src={newArrivalProduct?.images?.[0] || '/images/Retro.avif'}
                alt={newArrivalProduct?.name || 'New arrival'}
                className="h-[340px] w-full rounded-[22px] object-cover md:h-[420px]"
              />
            </div>
            <div className="px-2 md:px-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#8d6e5b]">New Arrivals</p>
              <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-[#181512] md:text-5xl">
                Fresh styles for everyday steps.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-[#655b57]">
                Discover the latest footwear created for comfort, casual confidence, and modern movement.
              </p>
              <Link
                to="/new-arrivals"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#181512] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f7f2ee] transition hover:bg-[#4b372e]"
              >
                Explore now
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f4f1] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid items-center gap-8 rounded-[34px] border border-[#e5d5cb] bg-[#fbf9f7] p-5 md:p-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="px-2 md:px-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#8d6e5b]">The everyday edit</p>
              <h3 className="mt-4 font-display text-4xl tracking-[-0.04em] text-[#181512] md:text-5xl">
                {editorialProduct?.name || 'The Everyday Edit'}
              </h3>
              <p className="mt-4 max-w-md text-base leading-7 text-[#655b57]">
                Minimal design. Maximum comfort. Made for everyday movement.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xl font-black text-[#181512]">
                  ₹{Number(editorialProduct?.salePrice || editorialProduct?.price || 0).toFixed(2)}
                </span>
                <Link
                  to={editorialProduct ? `/product/${editorialProduct._id}` : '/shop'}
                  className="inline-flex items-center gap-2 rounded-full border border-[#1c1c1c] bg-transparent px-6 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#181512] transition hover:bg-[#1c1c1c] hover:text-[#f7f2ee]"
                >
                  Shop now
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] bg-[#efe6df] p-4">
              <img
                src={editorialProduct?.images?.[0] || '/images/air.avif'}
                alt={editorialProduct?.name || 'Editorial shoe'}
                className="h-[340px] w-full rounded-[22px] object-cover md:h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1d1d1d] py-20 text-[#f6f0eb]">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#e5b998]">Personalized picks</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] md:text-5xl">
              Find Your Perfect Pair
            </h2>
            <p className="mt-4 text-base text-[#d9d0ca]">
              Tell us your style and we’ll help you find the right shoes.
            </p>
          </div>

          <form className="mt-10 rounded-[30px] border border-[#4a3a34] bg-[#f7f2ee] p-6 text-[#181512] shadow-[0_25px_60px_rgba(0,0,0,0.18)] md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Occasion</label>
                <select className="w-full border border-[#e5d5cb] bg-white px-4 py-3 text-sm text-[#181512] focus:outline-none">
                  <option>Everyday</option>
                  <option>College</option>
                  <option>Office</option>
                  <option>Party</option>
                  <option>Travel</option>
                  <option>Sports</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Shoe Type</label>
                <select className="w-full border border-[#e5d5cb] bg-white px-4 py-3 text-sm text-[#181512] focus:outline-none">
                  <option>Sneakers</option>
                  <option>Casual</option>
                  <option>Formal</option>
                  <option>Boots</option>
                  <option>Heels</option>
                  <option>Sports</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Preferred Style</label>
                <select className="w-full border border-[#e5d5cb] bg-white px-4 py-3 text-sm text-[#181512] focus:outline-none">
                  <option>Minimal</option>
                  <option>Classic</option>
                  <option>Sporty</option>
                  <option>Streetwear</option>
                  <option>Elegant</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Budget</label>
                <select className="w-full border border-[#e5d5cb] bg-white px-4 py-3 text-sm text-[#181512] focus:outline-none">
                  <option>₹1,000–₹2,000</option>
                  <option>₹2,000–₹4,000</option>
                  <option>₹4,000–₹7,000</option>
                  <option>₹7,000+</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Anything Else?</label>
              <textarea
                rows={4}
                className="w-full resize-none border border-[#e5d5cb] bg-white px-4 py-3 text-sm text-[#181512] focus:outline-none"
                placeholder="Tell us what you need..."
              />
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1d] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f7f2ee] transition hover:bg-[#3d2e2a]"
              >
                <Sparkles size={14} />
                Find My Shoes
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
