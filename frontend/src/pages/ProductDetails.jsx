import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Star,
  ShoppingCart,
  Plus,
  Minus,
  ShieldCheck,
  Heart,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    wishlist,
    user,
    addToast,
  } = useApp();

  const SELLER_WHATSAPP = "918210314098";

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // User input selections
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userPhone, setUserPhone] = useState("Not available");

  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const userAlreadyReviewed = reviews.some(
    (review) => review.userId === user?.id,
  );
  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (!user) {
      setUserPhone("Not available");
      return;
    }

    const fetchUserPhone = async () => {
      try {
        const res = await axios.get("/auth/addresses");
        const addresses = res.data || [];
        const selectedAddress = addresses.find((a) => a.isDefault) || addresses[0];
        setUserPhone(selectedAddress?.phone || "Not available");
      } catch (err) {
        console.error("Error fetching user addresses for WhatsApp checkout:", err);
        setUserPhone("Not available");
      }
    };

    fetchUserPhone();
  }, [user]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data.product);
      setReviews(res.data.reviews || []);

      // Defaults
      if (res.data.product.sizes?.length)
        setSelectedSize(res.data.product.sizes[0]);
      if (res.data.product.colors?.length)
        setSelectedColor(res.data.product.colors[0]);
    } catch (err) {
      console.error(err);
      addToast("Error fetching product details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      addToast("Please enter your review text", "error");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axios.post(`/products/${id}/reviews`, {
        rating,
        comment,
      });
      addToast("Review submitted successfully!", "success");
      setComment("");
      setRating(5);

      // Refresh details
      fetchProductDetails();
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || "Error submitting review",
        "error",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast("Please select a shoe size", "error");
      return;
    }
    if (!selectedColor) {
      addToast("Please select a color option", "error");
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const buildWhatsAppOrderMessage = () => {
    const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
    const total = Number(price) * Number(quantity || 1);
    const productUrl = `${window.location.origin}/product/${product._id}`;

    return [
      "Hello SnapShoes! 👋",
      "",
      "I would like to place an order.",
      "",
      "CUSTOMER DETAILS",
      `Name: ${user?.name || "Not available"}`,
      `Email: ${user?.email || "Not available"}`,
      `Phone: ${userPhone}`,
      "",
      "PRODUCT DETAILS",
      `Product: ${product.name}`,
      `Category: ${product.category || "Unisex"}`,
      `Size: ${product.sizes?.length ? selectedSize || "Not selected" : "N/A"}`,
      `Color: ${product.colors?.length ? selectedColor || "Not selected" : "N/A"}`,
      `Quantity: ${quantity}`,
      "",
      `Price: ₹${Number(price).toFixed(2)}`,
      `Total: ₹${total.toFixed(2)}`,
      "",
      "Product Link:",
      productUrl,
      "",
      "Please confirm my order and share the payment QR / UPI payment details.",
      "",
      "Thank you!",
      "SnapShoes 🩶",
    ].join("\n");
  };

  const handleBuyNow = () => {
    if (!user) {
      addToast("Please log in to continue with your order.", "error");
      navigate(`/login?redirect=product/${id}`);
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      addToast("Please select a size before continuing.", "error");
      return;
    }

    if (product.colors?.length && !selectedColor) {
      addToast("Please select a color before continuing.", "error");
      return;
    }

    const message = buildWhatsAppOrderMessage();
    const whatsappUrl = `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (!whatsappWindow) {
      addToast("Unable to open WhatsApp. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading Shoe details...
          </span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-center space-y-4">
        <AlertTriangle size={48} className="mx-auto text-amber-500" />
        <h2 className="text-xl font-bold uppercase tracking-wider text-brand-dark">
          Shoe Not Found
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          The shoe you are searching for might be discontinued or deleted.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-brand-dark text-white text-[10px] font-extrabold uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-brand-orange transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const hasSale = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasSale ? product.salePrice : product.price;
  const isWishlisted = wishlist.some((item) => item._id === product._id);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 pb-24 space-y-16">
      {/* Product Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Zoom Gallery */}
        <div className="bg-white border border-gray-150 rounded-3xl p-8 shadow-sm flex items-center justify-center relative group min-h-[400px]">
          {hasSale && (
            <span className="absolute top-6 left-6 bg-brand-orange text-white text-[10px] font-extrabold uppercase tracking-mega px-3.5 py-1.5 rounded-md shadow">
              sale!
            </span>
          )}
          <img
            src={
              product.images[0] ||
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            }
            alt={product.name}
            className="max-w-full max-h-[350px] object-contain transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Right Column: Attribute Selector & Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
              {product.brand}
            </span>
            <h1 className="text-3xl font-black text-brand-dark uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars Summary */}
            <div className="flex items-center space-x-2 pt-1">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={
                      i < Math.floor(product.rating || 4)
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      i < Math.floor(product.rating || 4)
                        ? "text-amber-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-brand-dark">
                  {product.rating ? `${product.rating} / 5` : "No Ratings"}
                </span>

                <span className="text-xs text-gray-500">
                  {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Panel */}
          <div className="p-4 bg-[#F7F2EC] border border-[#D8D1C7] rounded-2xl flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-[#77716A] uppercase tracking-[0.18em]">
                Retail Price
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                {hasSale ? (
                  <>
                    <span className="text-3xl font-black text-[#C6392A]">
                      ₹{product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-base text-[#5F5A54] line-through font-semibold">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-[#1C1C1C]">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center text-[10px] font-extrabold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border ${product.inventory > 0 ? "bg-[#ECF8F2] text-[#1B7F4B] border-[#A9D7B8]" : "bg-[#FDECEC] text-[#C43939] border-[#E7B0B0]"}`}
              >
                {product.inventory > 0
                  ? `In Stock (${product.inventory} Available)`
                  : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-base text-[#5F5A54] font-medium leading-7">
            {product.description}
          </p>

          {/* Size Select Grid */}
          {product.sizes?.length > 0 && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1C1C1C] block">
                Select Size (UK/US)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[48px] h-[48px] rounded-xl border text-sm font-bold transition-all duration-200 ${
  selectedSize === sz
    ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-md"
    : "bg-[#FFFFFF] text-[#1C1C1C] border-[#D8D1C7] hover:bg-[#1C1C1C] hover:text-white hover:border-[#1C1C1C]"
}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Select */}
          {product.colors?.length > 0 && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1C1C1C] block">
                Select Color Option
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-4 py-2.5 border rounded-xl text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                      selectedColor === col
                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-md"
                        : "bg-[#FFFFFF] text-[#1C1C1C] border-[#D8D1C7] hover:bg-[#1C1C1C] hover:text-white hover:border-[#1C1C1C]"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Checkout Add Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[#DED8CE]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center border border-[#D8D1C7] rounded-xl bg-[#FFFDFC] shadow-sm w-full max-w-[160px] lg:w-auto lg:max-w-[160px]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-colors duration-200 rounded-l-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1C1C] focus-visible:ring-offset-2"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#1C1C1C]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(product.inventory, quantity + 1))
                  }
                  className="w-10 h-10 flex items-center justify-center text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-colors duration-200 rounded-r-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1C1C] focus-visible:ring-offset-2"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3 w-full lg:flex-row lg:items-center lg:justify-end">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.inventory === 0}
                  className={`h-[52px] flex-1 inline-flex items-center justify-center rounded-xl border border-[#1C1C1C] text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1C1C] focus-visible:ring-offset-2 ${product.inventory > 0 ? "bg-[#1C1C1C] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#2B2B2B] active:bg-[#111111]" : "bg-[#D4D4D4] text-[#7A7A7A] border-[#D4D4D4] cursor-not-allowed"}`}
                >
                  BUY NOW
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.inventory === 0}
                  className={`h-[52px] flex-1 inline-flex items-center justify-center gap-2 rounded-xl border text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1C1C] focus-visible:ring-offset-2 ${product.inventory > 0 ? "bg-[#FFFFFF] text-[#1C1C1C] border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white" : "bg-[#D4D4D4] text-[#7A7A7A] border-[#D4D4D4] cursor-not-allowed"}`}
                >
                  <ShoppingCart size={16} />
                  <span>ADD TO CART</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product)
                  }
                  className={`h-[52px] flex-1 inline-flex items-center justify-center gap-2 rounded-xl border text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1C1C] focus-visible:ring-offset-2 ${isWishlisted ? "bg-[#1C1C1C] text-white border-[#1C1C1C] hover:bg-[#2B2B2B]" : "bg-[#FFFFFF] text-[#1C1C1C] border-[#D8D1C7] hover:bg-[#1C1C1C] hover:text-white hover:border-[#1C1C1C]"}`}
                >
                  <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                  <span>{isWishlisted ? "ADDED TO WISHLIST" : "ADD TO WISHLIST"}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#C9D9CD] bg-[#F3F8F4] text-[#1C1C1C] text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-200 hover:bg-[#EAF7EF] hover:border-[#25D366] hover:text-[#1C1C1C] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
            >
              <MessageCircle size={15} className="text-[#25D366]" />
              <span>Order via WhatsApp</span>
            </button>
          </div>

          {/* Extra Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>Original brand guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart size={16} className="text-brand-orange shrink-0" />
              <span>Lifetime design concept</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-gray-200">
        {/* Left Side: Submit Feedback Form */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-brand-dark">
              Customer Feedback
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
              We value your opinions. Let us know how this performance model
              fits and behaves during action.
            </p>
          </div>

          {user ? (
            userAlreadyReviewed ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-3">⭐</div>

                <h3 className="text-green-700 font-bold text-lg">
                  You have already reviewed this product
                </h3>

                <p className="text-sm text-green-600 mt-2">
                  Thank you for your valuable feedback!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4 h-fit"
              >
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark border-b border-gray-50 pb-2">
                  Write a Review
                </h3>

                {/* Star rating selector */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    Your Rating
                  </label>

                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`p-0.5 text-2xl transition-all ${
                          rating >= num
                            ? "text-amber-400 scale-105"
                            : "text-gray-200"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    Comments
                  </label>

                  <textarea
                    placeholder="Tell us about the sizing, comfort, and performance..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full bg-brand-gray border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-brand-orange font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg"
                >
                  {submittingReview ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            )
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-3.5">
              <p className="text-xs font-semibold text-amber-700 leading-relaxed">
                You must be logged in to share ratings and reviews for this shoe
                model.
              </p>

              <Link
                to="/login"
                className="inline-block bg-brand-dark text-white text-[9px] font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-brand-orange transition"
              >
                Login to Account
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark border-b border-gray-100 pb-3">
            Ratings History ({reviews.length})
          </h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-150 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  No Reviews Yet
                </p>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                  Be the first to submit a review for this shoe!
                </p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                        {rev.userName?.[0]?.toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-brand-dark">
                            {rev.userName}
                          </h4>

                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Verified Buyer
                          </span>
                        </div>

                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < rev.rating ? "currentColor" : "none"}
                              className={
                                i < rev.rating
                                  ? "text-amber-400"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                          <span className="text-xs text-gray-500 font-medium">
                            {rev.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
