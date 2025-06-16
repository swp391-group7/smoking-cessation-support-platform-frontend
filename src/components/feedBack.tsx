import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Feedback {
  id: number;
  name: string;
  role: string;
  since: string;
  avatar: string;
  quote: string;
}

const feedbacks: Feedback[] = [
  {
    id: 1,
    name: 'Nguyễn A.',
    role: 'Người dùng từ 2021',
    since: '2021',
    avatar: '/avatars/user1.jpg',
    quote: 'AirBloom đã thay đổi hoàn toàn thói quen của tôi. Tôi cảm thấy khỏe mạnh và tự tin hơn mỗi ngày.'
  },
  {
    id: 2,
    name: 'Trần B.',
    role: 'Người dùng từ 2022',
    since: '2022',
    avatar: '/avatars/user2.jpg',
    quote: 'Chương trình lộ trình cá nhân hóa rất hiệu quả, tôi đã bỏ thuốc hoàn toàn sau 3 tháng.'
  },
  {
    id: 3,
    name: 'Lê C.',
    role: 'Người dùng từ 2020',
    since: '2020',
    avatar: '/avatars/user3.jpg',
    quote: 'Cộng đồng hỗ trợ 24/7 giúp tôi vượt qua những lúc khó khăn nhất.'
  },
  {
    id: 4,
    name: 'Phạm D.',
    role: 'Người dùng từ 2019',
    since: '2019',
    avatar: '/avatars/user4.jpg',
    quote: 'Tôi đánh giá cao tính bảo mật dữ liệu và sự chuyên nghiệp của đội ngũ AirBloom.'
  }
];

const FeedbackSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">
          Tại sao mọi người chọn AirBloom
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {feedbacks.map((fb, idx) => (
            <motion.div
              key={fb.id}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={fb.avatar} alt={fb.name} />
                  <AvatarFallback>{fb.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-800">{fb.name}</p>
                  <p className="text-sm text-gray-500">{fb.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic text-base">“{fb.quote}”</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
