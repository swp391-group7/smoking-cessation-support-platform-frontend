// src/components/HeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Logo from '@/assets/logo.png'; // Đảm bảo đặt logo AirBloom ở src/assets/logo.png

const HeroSection: React.FC = () => {
  return (
    <motion.section
      id="hero"
      className="bg-green-50 py-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto text-center px-4">
        <img src={Logo} alt="AirBloom Logo" className="w-24 h-auto mx-auto" />
        <h1 className="mt-6 text-4xl font-extrabold text-green-900">
          AirBloom - Hành trình khỏe mạnh không khói thuốc
        </h1>
        <p className="mt-4 text-xl text-green-800">
          Cùng bạn từng bước vượt qua thói quen, tận hưởng hơi thở trong lành.
        </p>
      </div>
    </motion.section>
  );
};

export default HeroSection;
