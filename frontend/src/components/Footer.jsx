import React from "react";
import {
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-black tracking-[0.2em]">
              SnapShoes
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.35em] text-orange-400">
              @snapshoes
            </p>

            <p className="mt-5 text-gray-400 text-sm leading-7">
              Discover premium sneakers crafted for comfort,
              performance and everyday lifestyle. Elevate your
              style with the latest collections.
            </p>

            <div className="flex items-center gap-2 mt-5 text-gray-300">
              <ShieldCheck size={18} />
              <span className="text-sm">
                100% Authentic Products
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-bold mb-5">
              Shop
            </h3>

            <ul className="space-y-3 text-gray-400 text-sm">

              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>

              <li>
                <a href="/shop" className="hover:text-white transition">
                  Collection
                </a>
              </li>

              <li>
                <a href="/wishlist" className="hover:text-white transition">
                  Wishlist
                </a>
              </li>

              <li>
                <a href="/profile" className="hover:text-white transition">
                  My Account
                </a>
              </li>

            </ul>
          </div>

          {/* Information */}

          <div>
            <h3 className="text-lg font-bold mb-5">
              Information
            </h3>

            <ul className="space-y-3 text-gray-400 text-sm">

              <li>
                <a href="/about" className="hover:text-white transition">
                  About Us
                </a>
              </li>

              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Shipping Policy
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Return Policy
                </a>
              </li>

            </ul>
          </div>

          {/* Contact */}

          <div>

            <h3 className="text-lg font-bold mb-5">
              Contact
            </h3>

            <div className="space-y-4 text-sm text-gray-400">

              <div className="flex gap-3">
                <MapPin size={18} className="mt-1" />
                <span>
                  Patna, Ashok Rajpath
                </span>
              </div>

              <div className="flex gap-3">
                <Phone size={18} />
                <span>8210314098</span>
              </div>

              <div className="flex gap-3">
                <Mail size={18} />
                <span>snapshoes0612@gmail.com</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-gray-800 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} @snapshoes. All Rights Reserved.
          </p>

          <p className="text-gray-500 text-sm">
            Owner: <span className="text-white font-semibold">Gooddo & Mobasshir</span>
          </p>

        </div>

      </div>
    </footer>
  );
}