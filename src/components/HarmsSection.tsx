// src/components/HarmsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

const HarmsSection: React.FC = () => {
  return (
    <motion.section
      id="harms"
      className="py-12 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Tác hại của thuốc lá</h2>
        <p className="mb-4 text-gray-700">
          Thuốc lá gây ra nhiều hậu quả nghiêm trọng cho sức khỏe. Dưới đây là một số tác hại chính:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Ung thư phổi và nhiều loại ung thư khác (vòm họng, thực quản...)</li>
          <li>Bệnh tim mạch: tăng nguy cơ đau tim, đột quỵ và xơ vữa động mạch.</li>
          <li>Suy giảm chức năng phổi: ho mãn tính, khó thở và các bệnh hô hấp khác.</li>
          <li>Lão hóa da nhanh chóng, răng ố vàng và các vấn đề về sức khỏe ngoài da.</li>
          <li>Ảnh hưởng xấu đến người xung quanh do khói thuốc thụ động.</li>
        </ul>
      </div>
    </motion.section>
  );
};

export default HarmsSection;
