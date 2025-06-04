// src/components/ContactSection.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Có thể thêm xử lý gửi dữ liệu ở đây

    // Reset sau 3 giây
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <motion.section
      id="contact"
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto px-6">
        <h2 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-2">
          <FiSend className="text-green-600" /> Liên hệ với chúng tôi
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-green-50 p-6 rounded-xl shadow-md"
        >
          <div>
            <label className="block text-gray-700 mb-1">Tên của bạn</label>
            <input
              type="text"
              name="name"
              placeholder="Nhập tên..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Tin nhắn</label>
            <textarea
              name="message"
              placeholder="Nhập tin nhắn..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <FiSend /> Gửi
          </button>

          {submitted && (
            <motion.p
              className="text-green-700 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✅ Cảm ơn bạn! Tin nhắn đã được gửi.
            </motion.p>
          )}
        </form>
      </div>
    </motion.section>
  );
};

export default ContactSection;
