// src/components/HarmsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const HarmsSection: React.FC = () => {
  return (
    <section className="px-4 py-20" id='harms' >
      
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-serif font-semibold leading-tight mb-6">
            Where quitting<br />feels like <span className="text-emerald-500">blooming</span>
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Quit smoking for good with the help of AirBloom - <br />
            a guided journey to a smoke-free life, improved health and a clearer mind.
          </p>
          <button className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium">
            Start your journey
          </button>
        </div>
      

       <div className="mt-16 border-t pt-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800 text-center">
          <div>
            <h3 className="text-emerald-600 font-semibold mb-2 text-lg">Real health, real gains</h3>
            <p className="text-gray-600 text-base">
              Breathing easier, saving money<br />and feeling more alive.
            </p>
          </div>
          <div>
            <h3 className="text-emerald-600 font-semibold mb-2 text-lg">Support that sticks</h3>
            <p className="text-gray-600 text-base">
              Get tailored plans, daily guidance<br />and a community that’s always<br />there when it gets tough.
            </p>
          </div>
          <div>
            <h3 className="text-emerald-600 font-semibold mb-2 text-lg">Mindful but not stressful</h3>
            <p className="text-gray-600 text-base">
              Track progress, manage cravings<br />and stay motivated with simple tools<br />designed for calm and clarity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};


export default HarmsSection;
