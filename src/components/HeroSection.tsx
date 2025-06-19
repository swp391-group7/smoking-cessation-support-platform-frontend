import React from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { Leaf, HeartPulse, RefreshCw } from 'lucide-react';
import CTAButton from './CTAButton';
import AnimatedElements from './AnimatedElements';

// Reusable float transition without custom ease
const floatTransition: Transition = { duration: 3, repeat: Infinity, repeatType: 'loop' };

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-green-50" id="hero">
      <AnimatedElements />

      <div className="relative z-10 text-center max-w px-4 py-12 md:py-16">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-green-700 leading-tight mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="block"
            animate={{ y: [0, -10, 0], opacity: [1, 0.8, 1] }}
            transition={floatTransition}
            style={{ display: 'inline-block' }}
          >
            Embrace Every Breath,
          </motion.span>
          <motion.span
            className="block text-green-500"
            animate={{ y: [0, -10, 0], opacity: [1, 0.8, 1] }}
            transition={{ delay: 0.2, ...floatTransition }}
            style={{ display: 'inline-block' }}
          >
            Transform Your Life
          </motion.span>
          <motion.span
            className="block text-green-700"
            animate={{ y: [0, -10, 0], opacity: [1, 0.8, 1] }}
            transition={{ delay: 0.4, ...floatTransition }}
            style={{ display: 'inline-block' }}
          >
            Smoke‑Free with Air Bloom
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Air Bloom doesn't just help you quit; it opens a journey to a healthier, energized, and hopeful future. Start your new life today!
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CTAButton />
        </motion.div>

        <div className="flex justify-center gap-6 mt-12">
          <motion.div className="flex flex-col items-center" animate={{ y: [0, -10, 0] }} transition={floatTransition}>
            <RefreshCw size={50} className="text-green-600 mb-2" />
            <span className="text-sm font-semibold text-green-600 text-center">Journey of Change</span>
          </motion.div>
          <motion.div className="flex flex-col items-center" animate={{ y: [0, -10, 0] }} transition={{ delay: 0.4, ...floatTransition }}>
            <Leaf size={50} className="text-green-600 mb-2" />
            <span className="text-sm font-semibold text-green-600 text-center">Fresh Air Freedom</span>
          </motion.div>
          <motion.div className="flex flex-col items-center" animate={{ y: [0, -10, 0] }} transition={{ delay: 0.8, ...floatTransition }}>
            <HeartPulse size={50} className="text-green-600 mb-2" />
            <span className="text-sm font-semibold text-green-600 text-center">Lasting Health</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
