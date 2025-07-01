import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from "react-router-dom";

// Membership tiers (Giữ nguyên)
const memberships = [
  {
    name: 'Free Plan',
    price: '$0',
    features: [
      'Basic quit tracking',
      'Daily motivational tips',
      'Community forum access',
      'Standard email support',
      'Access to basic articles'
    ],
    // Không cần path riêng nữa, sẽ dùng chung '/membership'
  },
  {
    name: 'Pro Plan',
    price: '$9.99/mo',
    features: [
      'All Free features',
      'Personalized coaching',
      'Progress analytics dashboard',
      'Premium support',
      'Exclusive content & webinars'
    ],
    // Không cần path riêng nữa, sẽ dùng chung '/membership'
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
  const navigate = useNavigate();

  const stepVariants = {
    hidden: (idx: number) => ({
      opacity: 0,
      x: idx % 2 === 0 ? -120 : 120,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        ease: "easeOut" as const,
      },
    },
  };

  // Hàm xử lý khi nhấn nút, luôn chuyển đến '/membership'
  const handleViewDetails = () => {
    navigate('/membership');
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
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-300 rounded-full h-full hidden md:block z-0"></div>
          <div className="flex flex-col items-center space-y-8 md:space-y-12">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }}
                custom={idx}
                transition={{ delay: idx * 0.2 }}
                className={`relative w-full max-w-lg md:max-w-none md:w-1/2 flex items-center z-10 ${
                  idx % 2 === 0
                    ? 'md:self-start md:pr-8'
                    : 'md:self-end md:pl-8'
                }`}
              >
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
                <div className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white hidden md:block z-20"
                     style={idx % 2 === 0 ? { right: '-12px' } : { left: '-12px' }}>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Membership Plans --- */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-green-700 text-center mb-8">
            Choose Your Path to Freedom
          </h3>
          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
            {memberships.map((plan, idx) => (
              <motion.div
                key={idx}
                className="flex-1 flex flex-col bg-white rounded-2xl shadow-xl p-8 border-2 border-green-200 hover:shadow-2xl hover:scale-105 transition-transform duration-300 transform-gpu"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <p className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</p>
                  <p className="text-4xl text-green-600 font-bold">{plan.price}</p>
                </div>

                {/* Features List */}
                <ul className="text-gray-700 mb-8 space-y-3 flex-grow">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-base">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Call to Action Button */}
                <button
                  // Chỉ kích hoạt nút nếu là 'Pro Plan'
                  onClick={plan.name === 'Pro Plan' ? handleViewDetails : undefined}
                  disabled={plan.name === 'Free Plan'} // Vô hiệu hóa nút nếu là 'Free Plan'
                  className={`w-full py-3 rounded-full font-semibold text-lg transition-colors duration-300 shadow-md hover:shadow-lg
                    ${plan.name === 'Pro Plan'
                      ? 'bg-green-600 text-white hover:bg-green-700' // Màu sắc cho nút Pro Plan
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70' // Màu sắc cho nút bị vô hiệu hóa
                    }`}
                >
                  {plan.name === 'Pro Plan' ? 'View Details & Sign Up' : 'Currently Free - No Sign Up Needed'}
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