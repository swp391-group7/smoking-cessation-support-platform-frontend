import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, DollarSign } from 'lucide-react';

export const HarmsSection: React.FC = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <section className="px-4 py-20 bg-white font-serif" id="harms">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-6xl font-semibold leading-tight mb-6 text-gray-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          variants={itemVariants}
        >
          Where quitting<br />feels like <span className="text-emerald-500">blooming</span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-700 mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={itemVariants}
        >
          Quit smoking for good with the help of AirBloom -<br />
          a guided journey to a smoke-free life, improved health and a clearer mind.
        </motion.p>

        {/* <motion.button
          className="bg-emerald-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:bg-emerald-700 transition"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          variants={itemVariants}
        >
          Start Your Journey
        </motion.button> */}
      </div>

      <div className="mt-16 border-t pt-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-800">
          {[
            {
              icon: <Heart className="w-8 h-8 text-emerald-500" />, 
              title: 'Real Health Gains',
              desc: 'Breath easier, save money, and feel more alive every day.'
            },
            {
              icon: <Users className="w-8 h-8 text-emerald-500" />, 
              title: 'Community Support',
              desc: 'Tailored plans, daily guidance, and a supportive community.'
            },
            {
              icon: <DollarSign className="w-8 h-8 text-emerald-500" />, 
              title: 'Track Your Wins',
              desc: 'Monitor progress, manage cravings, and celebrate milestones.'
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              variants={itemVariants}
            >
              <div className="mb-4 inline-flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-emerald-600 mb-2">{item.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional statistics section */}
      <div className="mt-16 max-w-4xl mx-auto flex flex-col sm:flex-row justify-around text-center">
        {[
          { value: '20+', label: 'Minutes to recovery' },
          { value: '200,000+', label: 'Lives saved annually' },
          { value: '$3,000', label: 'Average yearly savings' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="mb-8 sm:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            variants={itemVariants}
          >
            <span className="block text-4xl font-semibold text-gray-800">{stat.value}</span>
            <span className="block text-gray-600">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HarmsSection;
