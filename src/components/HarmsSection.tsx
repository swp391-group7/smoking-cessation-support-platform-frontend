// src/components/HarmsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

const HarmsSection: React.FC = () => {
  return (
    <motion.section
      id="harms"
      className="py-24 bg-gradient-to-br from-white via-emerald-50 to-emerald-100"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-emerald-800 mb-4">
            🚭 Tác hại của thuốc lá
          </h2>
          <p className="text-lg text-emerald-900 max-w-2xl mx-auto">
            Thuốc lá không chỉ ảnh hưởng nghiêm trọng đến sức khỏe bản thân mà còn gây hại đến những người xung quanh. Dưới đây là những tác hại phổ biến nhất:
          </p>
        </motion.div>

        <ul className="space-y-4 text-lg text-gray-800">
          {[
            'Ung thư phổi và nhiều loại ung thư khác (vòm họng, thực quản...)',
            'Bệnh tim mạch: tăng nguy cơ đau tim, đột quỵ và xơ vữa động mạch.',
            'Suy giảm chức năng phổi: ho mãn tính, khó thở và các bệnh hô hấp khác.',
            'Lão hóa da nhanh, răng ố vàng và các vấn đề về da, tóc.',
            'Ảnh hưởng xấu đến người xung quanh do khói thuốc thụ động.'
          ].map((harm, index) => (
            <motion.li
              key={index}
              className="flex items-start space-x-3 bg-white/60 p-4 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <span className="text-red-500 text-xl">🚫</span>
              <span>{harm}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
};

export default HarmsSection;