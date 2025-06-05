// src/components/BenefitsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  FiSmile,
  FiHeart,
  FiActivity,
  FiDollarSign,
  FiSun,
} from 'react-icons/fi';

const benefits = [
  {
    icon: <FiSmile className="text-green-600 w-6 h-6" />,
    title: 'Cảm nhận mùi vị tốt hơn',
    desc: 'Khứu giác và vị giác phục hồi, bạn sẽ tận hưởng món ăn trọn vẹn hơn.',
  },
  {
    icon: <FiHeart className="text-green-600 w-6 h-6" />,
    title: 'Giảm nguy cơ bệnh tật',
    desc: 'Hạn chế nguy cơ mắc bệnh tim, phổi và ung thư.',
  },
  {
    icon: <FiActivity className="text-green-600 w-6 h-6" />,
    title: 'Hô hấp tốt hơn',
    desc: 'Thở dễ dàng hơn, tập thể dục hiệu quả và khỏe mạnh hơn.',
  },
  {
    icon: <FiDollarSign className="text-green-600 w-6 h-6" />,
    title: 'Tiết kiệm chi phí',
    desc: 'Sử dụng tiền cho các mục tiêu quan trọng và ý nghĩa hơn.',
  },
  {
    icon: <FiSun className="text-green-600 w-6 h-6" />,
    title: 'Tinh thần phấn chấn',
    desc: 'Cải thiện chất lượng sống, giấc ngủ ngon và tâm trạng tích cực.',
  },
];

const BenefitsSection: React.FC = () => {
  return (
    <motion.section
      id="benefits"
      className="py-16 bg-green-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">🌱 Lợi ích khi bỏ thuốc</h2>
        <p className="mb-10 text-gray-700 text-center text-lg">
          Cơ thể và tinh thần bạn sẽ nhận được nhiều thay đổi tích cực khi cai thuốc:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mt-1">{item.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-green-700">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BenefitsSection;
