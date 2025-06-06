// src/components/Footer.tsx
import React from "react";
import Logo from "@/assets/logo.png";
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF
} from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-[#1e1e38] text-gray-300 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Logo Section */}
<div className="flex items-center space-x-3 mb-6">
  <img src={Logo} alt="AirBloom Logo" className="w-12 h-12 rounded-xl object-contain" />
  <div>
    <span className="text-2xl font-bold text-white">AirBloom</span>
    <p className="text-sm text-gray-300">Vì một tương lai không khói thuốc</p>
  </div>
</div>

        {/* About Section */}
        <div>
          <h4 className="text-white font-semibold mb-3">About</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Terms of Use</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Privacy Settings</a></li>
            <li><a href="#" className="hover:text-white">Advertising Policy</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Health Topics</a></li>
            <li><a href="#" className="hover:text-white">Health Hubs</a></li>
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Trust & Safety</a></li>
          </ul>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-start">
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-white hover:scale-110 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-white hover:scale-110 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white hover:scale-110 transition"><FaFacebookF /></a>
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-600" />

      {/* Copyright */}
      <div className="text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Group 7 — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;