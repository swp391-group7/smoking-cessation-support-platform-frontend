// src/components/QuitGuideSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

const QuitGuideSection: React.FC = () => {
  return (
    <motion.section
      id="guide"
      className="py-12 bg-green-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Hướng dẫn lộ trình cai nghiện</h2>
        <p className="mb-4 text-gray-700">
          Lộ trình cai nghiện hiệu quả bao gồm các bước cơ bản sau:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li><span className="font-semibold">Bước 1:</span> Xác định lý do và tạo động lực bỏ thuốc (ví dụ: sức khỏe, gia đình, tài chính).</li>
          <li><span className="font-semibold">Bước 2:</span> Lên kế hoạch chi tiết: đặt ngày bỏ thuốc và các mốc nhỏ để giảm dần.</li>
          <li><span className="font-semibold">Bước 3:</span> Tìm phương pháp hỗ trợ thay thế: nhai kẹo cao su nicotine, trị liệu thay thế, tập thể dục.</li>
          <li><span className="font-semibold">Bước 4:</span> Nhờ sự hỗ trợ của gia đình, bạn bè hoặc tham gia nhóm hỗ trợ để chia sẻ kinh nghiệm.</li>
          <li><span className="font-semibold">Bước 5:</span> Theo dõi tiến độ và tự khen thưởng sau mỗi cột mốc đạt được để duy trì động lực.</li>
        </ol>
      </div>
    </motion.section>
  );
};

export default QuitGuideSection;
