import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, ShieldCheck, CalendarClock } from "lucide-react";
import axios from "axios";
import { useApp } from "../context/AppContext";

export default function AdminUsers() {
  const { user, token, addToast } = useApp();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      addToast("Access denied, administrator authentication required", "error");
      navigate("/login");
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        addToast("Error loading users", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, user]);

  const summary = useMemo(() => {
    const adminUsers = users.filter((item) => item.role === "admin").length;
    const regularUsers = users.filter((item) => item.role !== "admin").length;

    return {
      totalUsers: users.length,
      adminUsers,
      regularUsers,
      newestUser: users[0] || null,
    };
  }, [users]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
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
            Customer Accounts
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Users</span>
            <Users className="text-[#b98866]" size={18} />
          </div>
          <p className="mt-4 text-3xl font-black text-brand-dark">{summary.totalUsers}</p>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Admins</span>
            <ShieldCheck className="text-emerald-500" size={18} />
          </div>
          <p className="mt-4 text-3xl font-black text-brand-dark">{summary.adminUsers}</p>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Newest User</span>
            <CalendarClock className="text-blue-500" size={18} />
          </div>
          <p className="mt-4 text-sm font-bold text-brand-dark">
            {summary.newestUser ? summary.newestUser.name : "No users found"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-gray text-[10px] font-extrabold uppercase tracking-widest text-gray-400 border-b border-gray-150">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-400">
                    No registered users found
                  </td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-brand-dark">{item.name}</p>
                      <p className="text-[10px] text-gray-500">{item.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.role === "admin"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-brand-dark">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
