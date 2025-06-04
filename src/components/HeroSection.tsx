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
        <div className="w-full md:w-[420px] h-[420px] border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="text-gray-200 text-base text-center px-4">
            Image or Illustration Goes Here
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;