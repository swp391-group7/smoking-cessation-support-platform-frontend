// src/components/WhyChooseSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { Shield, Target, Users, UserCheck, HeartPulse, Gift, Clock, Trophy } from "lucide-react";
import FeedbackSection from "./feedBack";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}

// Core platform strengths
const reasons: Feature[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Data Security',
    desc: 'All user data is encrypted and complies with international health data standards.',
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Personalized Roadmap',
    desc: 'Plans adapt in real time to your habits, goals, and feedback.',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Active Community',
    desc: 'Join over 10,000 members sharing tips, inspiration, and support.',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    icon: <UserCheck className="w-8 h-8" />,
    title: 'Expert Team',
    desc: 'Access certified physicians and psychologists with 20+ years of experience.',
    gradient: 'from-orange-500 to-red-600'
  }
];

// Achievements users can expect
const achievements: Feature[] = [
  {
    icon: <HeartPulse className="w-8 h-8" />,
    title: 'Healthy Lungs',
    desc: 'Improved breathing and reduced coughing within 2 weeks.',
    gradient: 'from-red-400 to-pink-500'
  },
  {
    icon: <Gift className="w-8 h-8" />,
    title: 'Big Savings',
    desc: 'Save an average of $200 per month by quitting cigarettes.',
    gradient: 'from-green-400 to-lime-500'
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Time Savings',
    desc: 'Automated adjustments remove the complexity and save you time.',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: 'High Success Rate',
    desc: '98% of users complete the program and remain smoke-free after 6 months.',
    gradient: 'from-indigo-400 to-purple-500'
  }
];

// Quick stats to build trust
const stats = [
  { label: 'Active Users', value: '10K+' },
  { label: 'Expert Experience', value: '20+ yrs' },
  { label: 'Success Rate', value: '98%' },
  { label: '24/7 Support', value: 'Yes' }
];

const WhyChooseSection: React.FC = () => {
  return (
    <section id="why" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🌿 Why Choose AirBloom?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            A trusted platform used by thousands to successfully quit smoking.
          </p>
        </motion.div>

        {/* Quick stats row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="p-4 bg-white rounded-xl shadow-md"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <p className="text-2xl font-bold text-indigo-600 mb-1">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Reasons grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Key Reasons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((item, idx) => (
              <motion.div
                key={idx}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <motion.div
                  className={`inline-flex p-4 rounded-full bg-gradient-to-br ${item.gradient} text-white mb-4`}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements grid */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {achievements.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-start p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <div className={`p-3 rounded-lg bg-gradient-to-br ${item.gradient} text-white mr-4`}>{item.icon}</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <FeedbackSection/>
    </section>
  );
};

export default WhyChooseSection;
