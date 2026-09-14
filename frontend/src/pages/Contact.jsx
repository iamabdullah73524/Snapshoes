import React from "react";
import { Mail, Phone, MapPin, MessageSquareText } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-gray-500">
          Get in touch
        </p>
        <h1 className="text-4xl font-black text-brand-dark mt-3">
          Contact Us
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1.2fr]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-black uppercase tracking-wide text-brand-dark mb-6">
            Contact Information
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4 rounded-2xl bg-brand-gray p-4">
              <MapPin className="text-black mt-1" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">Location</p>
                <span className="mt-1 block text-sm font-semibold text-brand-dark">Patna, Ashok Rajpath</span>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-brand-gray p-4">
              <Phone className="text-black mt-1" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">Phone</p>
                <span className="mt-1 block text-sm font-semibold text-brand-dark">8210314098</span>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-brand-gray p-4">
              <Mail className="text-black mt-1" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">Email</p>
                <span className="mt-1 block text-sm font-semibold text-brand-dark">snapshoes0612@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-5">
            <MessageSquareText className="text-black" />
            <h2 className="text-xl font-black uppercase tracking-wide text-brand-dark">
              Share Your Feedback
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-brand-gray border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-brand-gray border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-2">
                Feedback
              </label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full bg-brand-gray border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>

            <button
              type="button"
              className="w-full bg-black text-white py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.28em] hover:bg-brand-orange transition"
            >
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}