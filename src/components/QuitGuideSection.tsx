// src/components/QuitGuideSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { Target, Clipboard, Shield, Users, Award } from "lucide-react";
const QuitGuideSection = () => {
  const steps = [
    {
      title: "Bước 1: Chuẩn bị tinh thần",
      content: "Xác định lý do và tạo động lực bỏ thuốc (ví dụ: sức khỏe, gia đình, tài chính).",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Bước 2: Lập kế hoạch",
      content: "Lên kế hoạch chi tiết: đặt ngày bỏ thuốc và các mốc nhỏ để giảm dần.",
      icon: <Clipboard className="w-6 h-6" />
    },
    {
      title: "Bước 3: Tìm hỗ trợ",
      content: "Tìm phương pháp hỗ trợ thay thế: nhai kẹo cao su nicotine, trị liệu thay thế, tập thể dục.",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "Bước 4: Xây dựng mạng lưới",
      content: "Nhờ sự hỗ trợ của gia đình, bạn bè hoặc tham gia nhóm hỗ trợ để chia sẻ kinh nghiệm.",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Bước 5: Theo dõi & động viên",
      content: "Theo dõi tiến độ và tự khen thưởng sau mỗi cột mốc đạt được để duy trì động lực.",
      icon: <Award className="w-6 h-6" />
    }
  ];

  return (
    <section id="guide" className="py-24 bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            🗺️ Lộ trình cai nghiện
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            5 bước thiết yếu giúp bạn từ bỏ thuốc lá một cách hiệu quả và bền vững
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 to-teal-500" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative flex items-start space-x-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Timeline dot */}
                <motion.div
                  className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {step.icon}
                </motion.div>

                {/* Content */}
                <motion.div
                  className="flex-1 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.content}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuitGuideSection;