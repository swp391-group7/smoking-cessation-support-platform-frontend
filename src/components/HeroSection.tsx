// src/components/HeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Logo from '@/assets/logo.png';

const HeroSection: React.FC = () => {
  return (
    <motion.section
      id="hero"
      className="bg-[#2f4f39] py-20 px-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left side */}
        <div className="text-white max-w-xl text-center md:text-left">
          <img src={Logo} alt="AirBloom Logo" className="w-32 mb-4 mx-auto md:mx-0" />
          <h1 className="text-5xl font-bold mb-4">Quit Smoking<br />Today</h1>
          <p className="text-lg font-light text-gray-200 mb-8">
            Live Healthier Tomorrow
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 active:scale-95 transition">
              Get Started
            </button>
            <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 active:scale-95 transition">
              Learn More
            </button>
          </div>

          {/* Contact Section */}
          <div className="mt-10 text-sm">
            <p className="mb-2">Contact us!</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <button className="bg-white text-black px-4 py-2 rounded-full font-medium shadow hover:bg-gray-100 active:scale-95 transition">
                📞 HotLine
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-full font-medium shadow hover:bg-black-100 active:scale-95 transition">
                ✉️ Mail
              </button>
            </div>
          </div>
        </div>

        {/* Right side (Image Placeholder) */}
        <div className="w-full md:w-[400px] h-[400px] bg-gray-200 rounded shadow-md flex items-center justify-center">
          <div className="text-gray-500 text-sm text-center">Image Placeholder</div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;