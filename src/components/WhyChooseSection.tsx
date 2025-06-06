// src/components/WhyChooseSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { Target, UserCheck, Users, Clipboard } from "lucide-react";

const WhyChooseSection = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Lộ trình cá nhân hóa',
      desc: 'Phù hợp với nhu cầu và mục tiêu riêng của bạn để bỏ thuốc hiệu quả.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Cộng đồng hỗ trợ',
      desc: 'Chia sẻ kinh nghiệm và nhận động lực từ những người cùng hành trình.',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: 'Chuyên gia tư vấn',
      desc: 'Được hỗ trợ bởi các chuyên gia y tế và sức khỏe có chuyên môn.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: <Clipboard className="w-8 h-8" />,
      title: 'Công cụ theo dõi',
      desc: 'Ghi nhận tiến trình và thành tựu để thấy rõ hiệu quả bỏ thuốc.',
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  return (
    <section id="why" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            🌿 Tại sao chọn AirBloom?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nền tảng toàn diện với nhiều ưu điểm vượt trội giúp bạn thành công
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <motion.div
                className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;