// src/components/BenefitsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

const BenefitsSection: React.FC = () => {
  return (
    <motion.section
      id="benefits"
      className="py-12 bg-green-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Lợi ích khi bỏ thuốc</h2>
        <p className="mb-4 text-gray-700">
          Khi ngừng hút thuốc, cơ thể và tinh thần của bạn sẽ nhận được nhiều lợi ích tích cực:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Khứu giác và vị giác phục hồi, bạn cảm nhận mùi vị tốt hơn.</li>
          <li>Giảm nguy cơ mắc các bệnh tim mạch, phổi và ung thư.</li>
          <li>Tăng cường chức năng hô hấp: dễ thở, tập thể dục hiệu quả hơn.</li>
          <li>Tiết kiệm chi phí: sử dụng tiền vào các mục tiêu quan trọng hơn.</li>
          <li>Cải thiện chất lượng cuộc sống: tinh thần sảng khoái, ngủ ngon hơn.</li>
        </ul>
      </div>
    </motion.section>
  );
};

export default BenefitsSection;
