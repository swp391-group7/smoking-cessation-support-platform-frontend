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
    name: 'Nguyen A.',
    role: 'User since 2021',
    since: '2021',
    avatar: '/avatars/user1.jpg',
    quote: 'AirBloom has completely changed my habits. I feel healthier and more confident every day.'
  },
  {
    id: 2,
    name: 'Tran B.',
    role: 'User since 2022',
    since: '2022',
    avatar: '/avatars/user2.jpg',
    quote: 'The personalized journey program is very effective. I quit smoking completely after 3 months.'
  },
  {
    id: 3,
    name: 'Le C.',
    role: 'User since 2020',
    since: '2020',
    avatar: '/avatars/user3.jpg',
    quote: 'The 24/7 support community helped me get through the toughest moments.'
  },
  {
    id: 4,
    name: 'Pham D.',
    role: 'User since 2019',
    since: '2019',
    avatar: '/avatars/user4.jpg',
    quote: 'I really appreciate the data privacy and professionalism of the AirBloom team.'
  }
];

const FeedbackSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">
          Why People Choose AirBloom
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
