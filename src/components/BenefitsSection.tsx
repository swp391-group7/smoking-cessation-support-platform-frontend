// src/components/BenefitsSection.tsx
import React from 'react';
import { motion } from 'framer-motion'; 
import { Activity, Smile, Heart, DollarSign, Sun, Shield } from 'lucide-react'; 
const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Smile className="w-8 h-8" />,
      title: 'Cảm nhận mùi vị tốt hơn',
      desc: 'Khứu giác và vị giác phục hồi, bạn sẽ tận hưởng món ăn trọn vẹn hơn.',
      color: 'from-pink-400 to-rose-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Giảm nguy cơ bệnh tật',
      desc: 'Hạn chế nguy cơ mắc bệnh tim, phổi và ung thư.',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Hô hấp tốt hơn',
      desc: 'Thở dễ dàng hơn, tập thể dục hiệu quả và khỏe mạnh hơn.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Tiết kiệm chi phí',
      desc: 'Sử dụng tiền cho các mục tiêu quan trọng và ý nghĩa hơn.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Sun className="w-8 h-8" />,
      title: 'Tinh thần phấn chấn',
      desc: 'Cải thiện chất lượng sống, giấc ngủ ngon và tâm trạng tích cực.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Hệ miễn dịch mạnh',
      desc: 'Tăng cường sức đề kháng và khả năng chống lại bệnh tật.',
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-emerald-800 mb-6">
            🌱 Lợi ích khi bỏ thuốc
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cơ thể và tinh thần bạn sẽ nhận được những thay đổi tích cực đáng kinh ngạc khi bắt đầu hành trình cai thuốc
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon */}
              <motion.div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${benefit.color} text-white mb-6`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                {benefit.icon}
              </motion.div>

              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.desc}
              </p>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 opacity-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
