// src/components/HeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Logo from '@/assets/logo.png';

const HeroSection: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      id="hero"
      className="bg-[#2f4f39] py-24 px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side */}
        <div className="text-white max-w-xl text-center md:text-left">
          <img
            src={Logo}
            alt="AirBloom Logo"
            className="w-36 mb-6 mx-auto md:mx-0 drop-shadow-xl"
          />
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Quit Smoking<br />Today
          </h1>
          <p className="text-lg font-light text-gray-200 mb-8">
            Live Healthier Tomorrow – Start your journey to a smoke-free life.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button
              onClick={() => scrollToSection('benefits')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition active:scale-95"
            >
              🚀 Get Started
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-lg shadow-lg transition active:scale-95"
            >
              📘 Learn More
            </button>
          </div>

          {/* Contact Buttons */}
          <div className="mt-10 text-sm">
            <p className="mb-3 font-medium tracking-wide">Contact us!</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <button className="bg-white text-black px-5 py-2 rounded-full font-medium shadow-md hover:bg-gray-100 active:scale-95 transition">
                📞 HotLine
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-black text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-gray-800 active:scale-95 transition"
              >
                ✉️ Mail
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Stylish Placeholder */}
        <div className="w-full md:w-[420px] h-[420px] border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm overflow-hidden">
  <img
    src="data:image/jpeg;base64,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" // <-- Thay link ảnh tại đây
    alt="Mô tả ảnh"
    className="w-full h-full object-cover"
  />
</div>
      </div>
    </motion.section>
  );
};

export default HeroSection;