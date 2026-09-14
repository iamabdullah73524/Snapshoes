import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ShieldCheck, Mail, Lock, LogIn } from "lucide-react";

export default function AdminLogin() {
  const { adminLogin, user, loading } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirect = searchParams.get("redirect") || "admin/dashboard";

  useEffect(() => {
    if (user?.role === "admin") {
      navigate(`/${redirect}`, { replace: true });
    }
  }, [user, redirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await adminLogin(email, password);

    if (res.success) {
      navigate(`/${redirect}`, { replace: true });
      return;
    }

    setError(res.message || "Invalid admin credentials");
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
      <div className="grid overflow-hidden rounded-[32px] border border-[#e5d5cb] bg-white shadow-[0_24px_80px_rgba(31,24,22,0.08)] md:grid-cols-2">
        <div className="flex flex-col justify-between bg-[#1a1a1a] p-8 text-[#f7f2ee] md:p-12">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f7cfb3]/40 bg-[#2e2a28] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f7cfb3]">
              <ShieldCheck size={14} />
              SnapShoes Admin
            </div>

            <h1 className="font-display text-4xl leading-none tracking-[-0.05em] md:text-5xl">
              Admin Portal
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[#d9d0ca]">
              Secure access to product management, order operations, customer accounts, and store settings.
            </p>
          </div>

          <div className="mt-10 rounded-[26px] border border-white/10 bg-white/5 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#f7cfb3]">
              Access Level
            </p>
            <p className="mt-2 text-2xl font-black">Administrator</p>
            <p className="mt-2 text-sm text-[#d9d0ca]">
              Restricted to authorized SnapShoes team members only.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#8d6e5b]">
              Sign in
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#181512]">
              Login to Admin Panel
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-3.5 text-[#8d6e5b]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@snapshoes.com"
                  className="w-full rounded-2xl border border-[#e5d5cb] bg-[#f8f4f1] py-3 pl-11 pr-4 text-sm text-[#181512] placeholder:text-[#8d6e5b] focus:border-[#b98866] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7a685e]">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-3.5 text-[#8d6e5b]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[#e5d5cb] bg-[#f8f4f1] py-3 pl-11 pr-4 text-sm text-[#181512] placeholder:text-[#8d6e5b] focus:border-[#b98866] focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#181512] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f7f2ee] transition hover:bg-[#4b372e] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <LogIn size={16} />
              )}
              <span>{loading ? "Signing in..." : "Login to Admin Panel"}</span>
            </button>
          </form>

          <div className="mt-6 border-t border-[#efe0d8] pt-4 text-center text-xs text-[#7a685e]">
            <Link to="/" className="font-bold uppercase tracking-[0.24em] text-[#181512] hover:text-[#b98866]">
              Back to storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
