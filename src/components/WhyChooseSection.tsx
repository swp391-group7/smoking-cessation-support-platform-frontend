// src/components/WhyChooseSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

const WhyChooseSection: React.FC = () => {
  return (
    <motion.section
      id="why"
      className="py-12 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Tại sao chọn AirBloom</h2>
        <p className="mb-4 text-gray-700">
          AirBloom cung cấp cho bạn một nền tảng toàn diện với nhiều ưu điểm vượt trội:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Lộ trình cai nghiện cá nhân hóa: phù hợp với nhu cầu và mục tiêu của bạn.</li>
          <li>Cộng đồng hỗ trợ: chia sẻ kinh nghiệm và nhận động lực từ những người cùng mục tiêu.</li>
          <li>Chuyên gia tư vấn: nhận hướng dẫn từ các chuyên gia y tế và sức khỏe đáng tin cậy.</li>
          <li>Công cụ theo dõi: ghi nhận tiến trình và thành tựu giúp bạn nhìn rõ hiệu quả bỏ thuốc.</li>
          <li>Giao diện thân thiện: dễ dàng sử dụng với màu sắc tươi sáng và hướng dẫn cụ thể.</li>
        </ul>
      </div>
    </motion.section>
  );
};

export default WhyChooseSection;
