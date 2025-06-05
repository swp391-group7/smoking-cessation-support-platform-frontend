// src/components/QuitGuideSection.tsx
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const steps = [
  {
    title: "Bước 1",
    content: "Xác định lý do và tạo động lực bỏ thuốc (ví dụ: sức khỏe, gia đình, tài chính).",
  },
  {
    title: "Bước 2",
    content: "Lên kế hoạch chi tiết: đặt ngày bỏ thuốc và các mốc nhỏ để giảm dần.",
  },
  {
    title: "Bước 3",
    content: "Tìm phương pháp hỗ trợ thay thế: nhai kẹo cao su nicotine, trị liệu thay thế, tập thể dục.",
  },
  {
    title: "Bước 4",
    content: "Nhờ sự hỗ trợ của gia đình, bạn bè hoặc tham gia nhóm hỗ trợ để chia sẻ kinh nghiệm.",
  },
  {
    title: "Bước 5",
    content: "Theo dõi tiến độ và tự khen thưởng sau mỗi cột mốc đạt được để duy trì động lực.",
  },
];

const QuitGuideSection: React.FC = () => {
  return (
    <motion.section
      id="guide"
      className="py-16 bg-gradient-to-b from-green-50 via-white to-green-100"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold text-green-700 mb-6 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🌱 Hướng dẫn lộ trình cai nghiện
        </motion.h2>

        <p className="text-lg text-gray-700 mb-10">
          Cùng khám phá 5 bước thiết yếu giúp bạn từ bỏ thuốc lá một cách hiệu quả và bền vững.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 text-left hover:shadow-2xl hover:scale-[1.02] transition duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="flex items-start space-x-4">
                <CheckCircleIcon className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">{step.title}</h3>
                  <p className="text-gray-700">{step.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default QuitGuideSection;