// src/components/Footer.tsx
import React from "react";
import Logo from "@/assets/logo.png";
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn, // Thêm biểu tượng LinkedIn
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md"; // Thêm biểu tượng Email và Phone

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
              <p className="text-lg text-gray-200 mt-1 italic">Vì một tương lai không khói thuốc</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed max-w-sm mt-4">
            Sứ mệnh của AirBloom là mang lại không khí trong lành và một cộng đồng khỏe mạnh hơn, không còn gánh nặng từ khói thuốc.
          </p>
        </div>

        {/* About Section */}
        <div>
          <h4 className="text-white font-bold text-xl mb-5 border-b-2 border-teal-300 pb-2">Về chúng tôi</h4>
          <ul className="space-y-3 text-base">
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><MdEmail className="mr-2 text-lg" /> Liên hệ</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><FaLinkedinIn className="mr-2 text-lg" /> Tuyển dụng</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Điều khoản sử dụng</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Cài đặt quyền riêng tư</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="text-white font-bold text-xl mb-5 border-b-2 border-teal-300 pb-2">Hỗ trợ</h4>
          <ul className="space-y-3 text-base">
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Chủ đề sức khỏe</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Trung tâm sức khỏe</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Trung tâm trợ giúp</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">&bull;</span> Độ tin cậy & An toàn</a></li>
          </ul>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-start">
          <h4 className="text-white font-bold text-xl mb-5 border-b-2 border-teal-300 pb-2">Theo dõi chúng tôi</h4>
          <div className="flex gap-5 text-3xl">
            <a href="#" className="text-gray-200 hover:text-white hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="text-gray-200 hover:text-white hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="text-gray-200 hover:text-white hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="text-gray-200 hover:text-white hover:scale-125 transition-transform duration-300 ease-in-out" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
          <div className="mt-8">
            <h4 className="text-white font-bold text-xl mb-3">Liên hệ nhanh</h4>
            <p className="flex items-center text-gray-200 text-base"><MdPhone className="mr-2 text-xl" /> +84 123 456 789</p>
            <p className="flex items-center text-gray-200 text-base mt-2"><MdEmail className="mr-2 text-xl" /> info@airbloom.com</p>
          </div>
        </div>
      </div>

      <hr className="my-12 border-teal-500 opacity-50" />

      {/* Copyright */}
      <div className="text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Group 7 — Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;