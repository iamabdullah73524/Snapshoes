import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Bell, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AdminSettings() {
  const { user, token, addToast } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      addToast("Access denied, administrator authentication required", "error");
      navigate("/login");
      return;
    }
  }, [token, user]);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast("Settings saved locally for this session", "success");
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-150 pb-6">
        <div className="space-y-1">
          <Link
            to="/admin"
            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-brand-orange transition"
          >
            <ArrowLeft size={14} />
            <span>Admin Home</span>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tight text-brand-dark">
            Store Settings
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
              Store Name
            </label>
            <input
              defaultValue="SnapShoes"
              className="w-full bg-brand-gray border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-brand-orange font-semibold text-brand-dark"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
              Support Email
            </label>
            <input
              defaultValue="hello@snapshoes.in"
              className="w-full bg-brand-gray border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-brand-orange font-semibold text-brand-dark"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-150 bg-brand-gray p-4">
            <div className="flex items-center gap-3">
              <Bell className="text-[#b98866]" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Notifications</p>
                <p className="text-sm font-bold text-brand-dark">Admin alerts enabled</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-150 bg-brand-gray p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-500" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Security</p>
                <p className="text-sm font-bold text-brand-dark">Role-based access active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
            WhatsApp Business Number
          </label>
          <input
            defaultValue="+91 98765 43210"
            className="w-full bg-brand-gray border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-brand-orange font-semibold text-brand-dark"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white text-[10px] font-extrabold uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-orange-500 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
