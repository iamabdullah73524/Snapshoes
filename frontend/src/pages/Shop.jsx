import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Search, RotateCcw } from 'lucide-react';

export default function Shop() {
  const { products, loadProducts, loading } = useApp();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  const brands = ['Nike', 'Adidas', 'Porsche', 'Reebok', 'Puma', 'Fila'];
  const categories = ['Crocs', 'Formal', 'Loafer', 'Sneakers', 'Flipflop', 'Casual', 'Sports', 'Boots', 'Heels'];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const catParam = queryParams.get('category');
    const brandParam = queryParams.get('brand');
    const searchParam = queryParams.get('search') || '';

    setSearch(searchParam);
    setSelectedCategory(catParam || '');
    setSelectedBrand(brandParam || '');

    const filters = {
      search: searchParam || undefined,
      category: catParam || undefined,
      brand: brandParam || undefined,
      sort,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    };

    loadProducts(filters);
  }, [location.search, location.pathname]);

  const handleFilterSubmit = (forcedCat, forcedBrand, forcedSearch) => {
    const filters = {};

    const currentSearch = forcedSearch !== undefined ? forcedSearch : search;
    if (currentSearch) filters.search = currentSearch;

    const cat = forcedCat !== undefined ? forcedCat : selectedCategory;
    if (cat) filters.category = cat;

    const brand = forcedBrand !== undefined ? forcedBrand : selectedBrand;
    if (brand) filters.brand = brand;

    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (sort) filters.sort = sort;

    loadProducts(filters);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    loadProducts({});
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilterSubmit(undefined, undefined, search);
    }
  };

  const pageTitle = useMemo(() => {
    if (location.pathname === '/new-arrivals') return 'New Arrivals';
    if (location.pathname === '/best-sellers') return 'Best Sellers';
    if (location.pathname === '/sale') return 'Sale';
    return 'Collection';
  }, [location.pathname]);

  const pageDescription = useMemo(() => {
    if (location.pathname === '/new-arrivals') return 'Fresh arrivals curated for everyday comfort and modern street style.';
    if (location.pathname === '/best-sellers') return 'The pairs everyone keeps stepping into.';
    if (location.pathname === '/sale') return 'Limited-time deals on your favorite looks.';
    return 'Browse styles for sneakers, casual, formal, sports, boots, and heels.';
  }, [location.pathname]);

  const displayProducts = useMemo(() => {
    if (location.pathname === '/best-sellers') {
      return products.filter((product) => product.isBestSeller);
    }

    if (location.pathname === '/sale') {
      return products.filter((product) => product.salePrice && product.salePrice < product.price);
    }

    if (location.pathname === '/new-arrivals') {
      return products.slice(0, 8);
    }

    return products;
  }, [products, location.pathname]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-12">
      <div className="mb-10 rounded-[30px] border border-[#e5d5cb] bg-[#fbf8f6] p-6 md:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#8d6e5b]">SnapShoes</p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-[#181512] md:text-6xl">
          {pageTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#655b57] md:text-base">
          {pageDescription}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="rounded-[28px] border border-[#e5d5cb] bg-[#fbf8f6] p-6 shadow-sm lg:col-span-1">
          <div className="border-b border-[#e9dfd8] pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8d6e5b]">Filters</p>
          </div>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Search shoes..."
                  className="w-full rounded-full border border-[#e5d5cb] bg-white px-4 py-2.5 pl-10 text-sm text-[#181512] focus:outline-none"
                />
                <Search size={14} className="absolute left-3 top-3.5 text-[#7a685e]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-full border border-[#e5d5cb] bg-white px-4 py-2.5 text-sm text-[#181512] focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full rounded-full border border-[#e5d5cb] bg-white px-4 py-2.5 text-sm text-[#181512] focus:outline-none"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Min</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="₹0"
                  className="w-full rounded-full border border-[#e5d5cb] bg-white px-3 py-2.5 text-sm text-[#181512] focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Max</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="₹5000"
                  className="w-full rounded-full border border-[#e5d5cb] bg-white px-3 py-2.5 text-sm text-[#181512] focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => handleFilterSubmit()}
              className="w-full rounded-full bg-[#181512] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f7f2ee] transition hover:bg-[#4b372e]"
            >
              Apply Filters
            </button>

            <button
              onClick={handleResetFilters}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#d7b9a5] bg-transparent px-4 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#181512] transition hover:bg-[#f0dccd]"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </aside>

        <div className="space-y-6 lg:col-span-3">
          <div className="flex flex-col gap-3 rounded-[28px] border border-[#e5d5cb] bg-[#fbf8f6] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">
              Showing <span className="text-[#181512]">{displayProducts.length}</span> products
            </p>
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">Sort by</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  const filters = {};
                  if (search) filters.search = search;
                  if (selectedCategory) filters.category = selectedCategory;
                  if (selectedBrand) filters.brand = selectedBrand;
                  if (minPrice) filters.minPrice = minPrice;
                  if (maxPrice) filters.maxPrice = maxPrice;
                  filters.sort = e.target.value;
                  loadProducts(filters);
                }}
                className="rounded-full border border-[#e5d5cb] bg-white px-3 py-2 text-sm text-[#181512] focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-[28px] bg-[#ece2db]" />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="rounded-[28px] border border-[#e5d5cb] bg-[#fbf8f6] p-12 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#7a685e]">No products found</p>
              <p className="mt-3 text-[#655b57]">Try refining your filters or resetting the search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
