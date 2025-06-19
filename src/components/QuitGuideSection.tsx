import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Membership tiers (Giữ nguyên)
const memberships = [
  {
    name: 'Free Plan',
    price: '$0',
    features: [
      'Basic quit tracking',
      'Daily motivational tips',
      'Community forum access'
    ]
  },
  {
    name: 'Pro Plan',
    price: '$9.99/mo',
    features: [
      'All Free features',
      'Personalized coaching',
      'Progress analytics dashboard',
      'Premium support'
    ]
  }
];

// Quit steps (Giữ nguyên)
const steps = [
  {
    title: 'Step 1: Survey & Self-Assessment',
    content: 'Complete our quick survey to identify your smoking patterns, triggers, and motivations.'
  },
  {
    title: 'Step 2: Create Your Plan',
    content: 'Set your quit date, define daily goals, and choose coping strategies.'
  },
  {
    title: 'Step 3: Choose Membership',
    content: 'Select between Free or Pro plan to unlock tailored features and support.'
  },
  {
    title: 'Step 4: Guided Quit Journey',
    content: 'Follow interactive lessons, habit trackers, and community encouragement.'
  }
];

const QuitGuideSection: React.FC = () => {
  // Animation variants for each step - Tăng duration, sử dụng easeOut
  const stepVariants = {
    hidden: (idx: number) => ({
      opacity: 0,
      x: idx % 2 === 0 ? -120 : 120, // Tăng khoảng cách di chuyển một chút
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9, // Tăng thời lượng animation lên 0.9 giây (mượt hơn)
        ease: "easeOut", // Kiểu easeOut cho chuyển động tự nhiên
      },
    },
  };

  return (
    <section id="guide" className="py-16 bg-gradient-to-b from-green-50 via-white to-green-100 relative">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <motion.h2
          className="text-4xl font-bold text-green-700 text-center mb-6 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          🌱 Your Personalized Quit Journey
        </motion.h2>
        <p className="text-lg text-gray-700 text-center mb-10">
          Follow these four essential steps to quit smoking effectively and sustainably.
        </p>

        {/* Steps: Timeline Layout with central line and alternating cards */}
        <div className="relative mb-12">
          {/* Vertical Line in the middle (hidden on small screens) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-300 rounded-full h-full hidden md:block z-0"></div>

          {/* Container for all steps, stacking them vertically */}
          <div className="flex flex-col items-center space-y-8 md:space-y-12">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                // Apply custom variants and set custom prop 'idx'
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }} // Giảm amount xuống 0.4 để animation bắt đầu sớm hơn một chút
                custom={idx} // Pass index as custom prop to variants
                // Điều chỉnh transition delay cho hiệu ứng tuần tự
                transition={{ delay: idx * 0.2 }} // Tăng độ trễ giữa các bước lên 0.2 giây
                className={`relative w-full max-w-lg md:max-w-none md:w-1/2 flex items-center z-10 ${
                  idx % 2 === 0 // Even index: for the left side
                    ? 'md:self-start md:pr-8'
                    : 'md:self-end md:pl-8'
                }`}
              >
                {/* Step Card */}
                <div
                  className={`bg-white rounded-2xl shadow-lg border border-green-100 p-6 w-full hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300 ${
                    idx % 2 === 0 ? 'md:text-right' : 'md:text-left'
                  }`}
                >
                  <div className={`flex items-center space-x-4 mb-3 ${idx % 2 === 0 ? 'md:flex-row-reverse md:space-x-reverse' : ''}`}>
                    <CheckCircleIcon className="w-7 h-7 text-green-600 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-green-800">{step.title}</h3>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base">{step.content}</p>
                </div>

                {/* Connector Dot (hidden on small screens, appears on md+) */}
                <div className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white hidden md:block z-20"
                     style={idx % 2 === 0 ? { right: '-12px' } : { left: '-12px' }}>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Membership plans (Giữ nguyên) */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">Membership Plans</h3>
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6">
            {memberships.map((plan, idx) => (
              <motion.div
                key={idx}
                className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-green-200 hover:shadow-2xl hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <p className="text-3xl font-semibold text-gray-800 mb-2">{plan.name}</p>
                <p className="text-2xl text-green-600 font-bold mb-4">{plan.price}</p>
                <ul className="text-gray-600 mb-6 space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 mt-1" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 transition">
                  {plan.name === 'Free Plan' ? 'Get Started' : 'Upgrade Now'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuitGuideSection;