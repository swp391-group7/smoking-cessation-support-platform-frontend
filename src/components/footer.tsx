// src/components/Footer.tsx
import React from "react";
import Logo from "@/assets/logo.png";
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn, // Added LinkedIn icon
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md"; // Added Email and Phone icons

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#004d40] to-[#00796b] text-gray-100 py-16 px-6 mt-auto shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Logo and Slogan Section */}
        <div className="lg:col-span-2 flex flex-col items-start justify-start">
          <div className="flex items-center space-x-4 mb-4">
            <img src={Logo} alt="AirBloom Logo" className="w-16 h-16 rounded-full object-contain border-2 border-white p-1" />
            <div>
              <span className="text-4xl font-extrabold text-white tracking-wide">AirBloom</span>
              <p className="text-lg text-gray-200 mt-1 italic">For a smoke-free future</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed max-w-sm mt-4">
            AirBloom's mission is to bring clean air and a healthier community, free from the burden of smoke.
          </p>
        </div>

        {/* About Section */}
        <div>
          <h4 className="text-white font-bold text-xl mb-5 border-b-2 border-teal-300 pb-2">About Us</h4>
          <ul className="space-y-3 text-base">
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><MdEmail className="mr-2 text-lg" /> Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><FaLinkedinIn className="mr-2 text-lg" /> Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Terms of Use</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Privacy Settings</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="text-white font-bold text-xl mb-5 border-b-2 border-teal-300 pb-2">Support</h4>
          <ul className="space-y-3 text-base">
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Health Topics</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Health Hubs</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Trust & Safety</a></li>
          </ul>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-start">
          <h4 className="text-white font-bold text-xl mb-5 border-b-2 border-teal-300 pb-2">Follow Us</h4>
          <div className="flex gap-5 text-3xl">
            <a href="#" className="text-gray-200 hover:text-white hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="text-gray-200 hover:text-white hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="text-gray-200 hover:text-white hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="text-gray-200 hover:text-white hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
          <div className="mt-8">
            <h4 className="text-white font-bold text-xl mb-3">Quick Contact</h4>
            <p className="flex items-center text-gray-200 text-base"><MdPhone className="mr-2 text-xl" /> +84 123 456 789</p>
            <p className="flex items-center text-gray-200 text-base mt-2"><MdEmail className="mr-2 text-xl" /> info@airbloom.com</p>
          </div>
        </div>
      </div>

      <hr className="my-12 border-teal-500 opacity-50" />

      {/* Copyright */}
      <div className="text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Group 7 — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;