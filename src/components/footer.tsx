// src/components/footer.tsx

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
    <footer className="bg-[#1e1e38] text-gray-300 py-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo Section */}
        <div className="flex flex-col items-start">
          <img src={Logo} alt="AirBloom Logo" className="w-20 mb-4" />
          <span className="text-xl font-semibold text-white">AirBloom</span>
        </div>

        {/* About Links */}
        <div>
          <h4 className="text-white font-semibold mb-2">About</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Terms of Use</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Privacy Settings</a></li>
            <li><a href="#" className="hover:underline">Advertising Policy</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-white font-semibold mb-2">Support</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Health Topics</a></li>
            <li><a href="#" className="hover:underline">Health Hubs</a></li>
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Trust and safety</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="flex items-start justify-start gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white"><FaTwitter /></a>
          <a href="#" className="hover:text-white"><FaInstagram /></a>
          <a href="#" className="hover:text-white"><FaFacebookF /></a>
        </div>
      </div>

      <hr className="my-6 border-gray-600" />

      {/* Copyright */}
      <div className="text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Group7
      </div>
    </footer>
  );
};

export default Footer;