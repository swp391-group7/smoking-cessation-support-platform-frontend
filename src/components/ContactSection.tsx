// src/components/ContactSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

const ContactSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý gửi form nếu cần thiết
  };

  return (
    <motion.section
      id="contact"
      className="py-12 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Liên hệ với chúng tôi</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Tên của bạn</label>
            <input
              type="text"
              name="name"
              placeholder="Nhập tên..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Tin nhắn</label>
            <textarea
              name="message"
              placeholder="Nhập tin nhắn..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Gửi
          </button>
        </form>
      </div>
    </motion.section>
  );
};

export default ContactSection;
