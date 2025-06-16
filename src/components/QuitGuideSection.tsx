import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Membership tiers
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

// Quit steps
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
  return (
    <section id="guide" className="py-16 bg-gradient-to-b from-green-50 via-white to-green-100 font-serif">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header animates once */}
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

        {/* Steps: static reveal once with hover effect */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-2xl hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <CheckCircleIcon className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Membership plans: static reveal once with hover */}
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
