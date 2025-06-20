import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Heart, Activity, DollarSign, Sun, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import PostsGrid from './sugestPost';

// Testimonial videos array
const testimonials = [
  { id: 1, videoId: 'VIDEO_ID_1', title: 'Mr. A – 1 Year Smoke-Free', desc: 'Mr. A shares his journey from 5 years of smoking to over 1 year living healthy and smoke-free.' },
  { id: 2, videoId: 'VIDEO_ID_2', title: 'Ms. B – Single Mom Overcomes Addiction', desc: 'Ms. B talks about her 6-month quitting process while caring for her young child.' },
  { id: 3, videoId: 'VIDEO_ID_3', title: 'Student C – Focused on Studies', desc: 'Student C quit smoking to improve health and better concentrate during university exams.' }
];

// Benefit cards array
const benefits = [
  { icon: <Smile className="w-8 h-8" />, title: 'Faster Recovery', subtitle: '20 minutes after quitting', desc: 'Heart rate and blood pressure normalize.', color: 'from-green-400 to-green-600' },
  { icon: <Activity className="w-8 h-8" />, title: 'Improved Breathing', subtitle: 'After 2 weeks', desc: 'Lung function improves noticeably.', color: 'from-blue-400 to-blue-600' },
  { icon: <Heart className="w-8 h-8" />, title: 'Lower Heart Risks', subtitle: 'After 1 year', desc: 'Heart attack risk drops by half.', color: 'from-red-400 to-red-600' },
  { icon: <Sun className="w-8 h-8" />, title: 'Better Mood', subtitle: 'After 1 month', desc: 'Sleep improves and mood becomes more positive.', color: 'from-yellow-400 to-yellow-600' },
  { icon: <DollarSign className="w-8 h-8" />, title: 'Save Money', subtitle: 'In 1 year', desc: 'You save millions of VND per year.', color: 'from-green-300 to-green-500' },
  { icon: <Shield className="w-8 h-8" />, title: 'Stronger Immunity', subtitle: 'After 6 months', desc: 'Immunity strengthens, fewer minor illnesses.', color: 'from-purple-400 to-purple-600' }
];

// Timeline items array
const timeline = [
  { time: '20 minutes', text: 'Heart rate & blood pressure normalize', icon: <Activity className="w-6 h-6 text-green-600" /> },
  { time: '12 hours', text: 'Carbon monoxide level drops to safe range', icon: <Shield className="w-6 h-6 text-blue-600" /> },
  { time: '1 day', text: 'Oxygen level in blood increases', icon: <Heart className="w-6 h-6 text-red-600" /> },
  { time: '1 month', text: 'Lung function improves', icon: <Activity className="w-6 h-6 text-blue-600" /> },
  { time: '1 year', text: '50% reduced risk of heart disease', icon: <Heart className="w-6 h-6 text-red-600" /> }
];

const BenefitsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const length = testimonials.length;

  const prev = () => setCurrent((current - 1 + length) % length);
  const next = () => setCurrent((current + 1) % length);
  const { videoId, title, desc } = testimonials[current];

  return (
    <section id="benefits" className="bg-green-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Banner */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-green-800 mb-4">
            🌱 Your healthy journey starts here
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Discover the immediate and long-term health benefits when you decide to quit smoking.
          </p>
          <a
            href="#start"
            className="inline-block px-6 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-lg hover:bg-yellow-600 transition"
          >
            Start your journey
          </a>
        </motion.div>

        {/* Benefit Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              className="group bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${b.color} opacity-0 group-hover:opacity-10 transition`} />
              <motion.div
                className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${b.color} text-white mb-4`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                {b.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{b.title}</h3>
              <p className="text-sm text-gray-600 italic mb-2">{b.subtitle}</p>
              <p className="text-gray-600 text-base">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-green-800 text-center mb-8">
            Health recovery timeline
          </h3>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            {timeline.map((t, idx) => (
              <motion.div
                key={idx}
                className="flex-1 flex flex-col items-center text-center px-4 mb-8 sm:mb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                <div className="bg-white p-4 rounded-full shadow-md mb-3">
                  {t.icon}
                </div>
                <span className="font-semibold text-green-700 mb-1">{t.time}</span>
                <p className="text-gray-600 text-sm">{t.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Testimonial */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-lg mb-16 flex flex-col lg:flex-row items-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Left: Description & controls */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-3xl font-bold text-green-800 mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">{desc}</p>
            <div className="flex space-x-4">
              <button onClick={prev} className="p-3 bg-green-200 rounded-full hover:bg-green-300 transition">
                <ChevronLeft className="w-6 h-6 text-green-700" />
              </button>
              <button onClick={next} className="p-3 bg-green-200 rounded-full hover:bg-green-300 transition">
                <ChevronRight className="w-6 h-6 text-green-700" />
              </button>
            </div>
          </div>
          {/* Right: Video */}
          <div className="w-full lg:w-1/2 aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Testimonial Video"
              allowFullScreen
              className="w-full h-full rounded-xl"
            />
          </div>
        </motion.div>

        {/* CTA Footer */}
        <div className="text-center"> 
          <a
            href="#start"
            className="inline-block px-8 py-4 bg-yellow-500 text-white font-bold rounded-full shadow-xl hover:bg-yellow-600 transition"
          >
            I’m determined to quit smoking now
          </a>
        </div>

        {/* Suggested Posts Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Suggested Posts</h3>
          <div className="bg-white rounded-2xl p-4">
            <PostsGrid />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;