import React from 'react';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-800 pb-12">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-xl font-black tracking-widest text-white">SANP SHOES</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Premium footwear concepts designed for extreme comfort, speed, and premium lifestyle aesthetic.
          </p>
          <div className="flex items-center space-x-2 text-xs text-brand-orange">
            <ShieldCheck size={16} />
            <span className="font-semibold text-gray-300">100% Original Brands</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand-orange">Collections</h4>
          <ul className="space-y-2 text-xs text-gray-400 font-medium">
            <li><a href="/shop" className="hover:text-white transition">All Shoes</a></li>
            <li><a href="/shop?brand=Porsche" className="hover:text-white transition">Porsche Collection</a></li>
            <li><a href="/shop?brand=Nike" className="hover:text-white transition">Nike Air</a></li>
            <li><a href="/shop?brand=Adidas" className="hover:text-white transition">Adidas Primeknit</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand-orange">Contact & Store</h4>
          <div className="space-y-3 text-xs text-gray-400">
            <div className="flex items-start space-x-2.5">
              <MapPin size={16} className="text-gray-300 shrink-0 mt-0.5" />
              <span>
                Aziz House, Muradpur Lane, Pillar No 25,<br />
                Patna Market, Ashok Rajpath, Patna - 800004
              </span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone size={15} className="text-gray-300 shrink-0" />
              <span>Owner Contacts: Mobasshir Aziz & Guddoo</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail size={15} className="text-gray-300 shrink-0" />
              <span>support@sanpshoes.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
        <p>&copy; {new Date().getFullYear()} SANP SHOES. All rights reserved.</p>
        <p>Aesthetic design inspired by Sneaker Flare concept</p>
      </div>
    </footer>
  );
}
