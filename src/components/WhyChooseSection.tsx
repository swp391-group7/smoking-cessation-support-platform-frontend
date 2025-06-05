// src/components/WhyChooseSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { FiTarget, FiUsers, FiUserCheck, FiClipboard, FiSmile } from "react-icons/fi";

const features = [
  {
    icon: <FiTarget className="text-green-600 w-6 h-6" />,
    title: "Lộ trình cá nhân hóa",
    desc: "Phù hợp với nhu cầu và mục tiêu riêng của bạn để bỏ thuốc hiệu quả.",
  },
  {
    icon: <FiUsers className="text-green-600 w-6 h-6" />,
    title: "Cộng đồng hỗ trợ",
    desc: "Chia sẻ kinh nghiệm và nhận động lực từ những người cùng hành trình.",
  },
  {
    icon: <FiUserCheck className="text-green-600 w-6 h-6" />,
    title: "Chuyên gia tư vấn",
    desc: "Được hỗ trợ bởi các chuyên gia y tế và sức khỏe có chuyên môn.",
  },
  {
    icon: <FiClipboard className="text-green-600 w-6 h-6" />,
    title: "Công cụ theo dõi",
    desc: "Ghi nhận tiến trình và thành tựu để thấy rõ hiệu quả bỏ thuốc.",
  },
  {
    icon: <FiSmile className="text-green-600 w-6 h-6" />,
    title: "Giao diện thân thiện",
    desc: "Thiết kế dễ sử dụng với hướng dẫn cụ thể và màu sắc tươi sáng.",
  },
];

const WhyChooseSection: React.FC = () => {
  return (
    <motion.section
      id="why"
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">
          🌿 Tại sao chọn AirBloom?
        </h2>
        <p className="mb-10 text-gray-700 text-center text-lg">
          AirBloom cung cấp nền tảng toàn diện với nhiều ưu điểm vượt trội:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mt-1">{feature.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-green-700">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default WhyChooseSection;