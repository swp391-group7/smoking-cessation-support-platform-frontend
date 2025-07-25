import React from 'react';
import { motion } from 'framer-motion';
import { Skull, HeartCrack, Syringe, DollarSign } from 'lucide-react'; // Các biểu tượng vẫn phù hợp

export const HarmsSection: React.FC = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="px-4 py-20 bg-emerald-50 font-serif" id="harms"> {/* Nền màu xanh lá nhạt */}
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          className="text-6xl font-extrabold leading-tight mb-6 text-emerald-800" // Tiêu đề chính màu xanh lá đậm
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          variants={itemVariants}
        >
          The True Cost of Smoking:<br /> <span className="text-gray-700">Unveiling the Harm</span> {/* Màu xám cho phần phụ */}
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 mb-8" // Văn bản màu xám
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={itemVariants}
        >
          Every puff carries a hidden price – not just for your wallet, but for your health, your loved ones, and your future. It's time to confront the stark realities of tobacco's grip.
        </motion.p>

        <motion.button
          className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:bg-emerald-700 transition transform hover:scale-105" // Nút màu xanh lá
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          variants={itemVariants}
        >
          Take the First Step to Quitting
        </motion.button>
      </div>

      ---

      <div className="mt-20 border-t border-emerald-200 pt-10"> {/* Đường kẻ màu xanh lá nhạt */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-gray-800">
          {[
            {
              icon: <Skull className="w-10 h-10 text-emerald-600" />, // Biểu tượng màu xanh lá
              title: 'Mortality & Disease',
              desc: 'Smoking is the leading preventable cause of death, responsible for millions of fatalities annually from cancer, heart disease, and respiratory illnesses.'
            },
            {
              icon: <HeartCrack className="w-10 h-10 text-emerald-600" />, // Biểu tượng màu xanh lá
              title: 'Impact on Health',
              desc: 'Beyond fatal diseases, smoking severely impairs lung function, cardiovascular health, and compromises nearly every organ system in the body.'
            },
            {
              icon: <Syringe className="w-10 h-10 text-emerald-600" />, // Biểu tượng màu xanh lá
              title: 'Addiction & Dependency',
              desc: 'Nicotine is highly addictive, creating a powerful physical and psychological dependency that makes quitting incredibly challenging without support.'
            },
            {
              icon: <DollarSign className="w-10 h-10 text-emerald-600" />, // Biểu tượng màu xanh lá
              title: 'Financial Burden',
              desc: 'The cost of cigarettes, healthcare expenses from smoking-related illnesses, and lost productivity due to sickness add up to a staggering financial drain.'
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" // Nền thẻ màu trắng
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              variants={itemVariants}
            >
              <div className="mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      ---

     <div className="mt-16 max-w-5xl mx-auto"> {/* Thu hẹp max-width và giảm mt */}
  <motion.h2
    className="text-4xl font-semibold text-center mb-12 text-emerald-800 font-sans" // Giảm kích thước, font vừa phải, font sans-serif
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, amount: 0.3 }}
    transition={{ duration: 0.6 }}
    variants={itemVariants}
  >
    Global Impact: <span className="text-gray-700">Alarming Facts</span>
  </motion.h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Giữ khoảng cách vừa phải */}
    {[
      {
        value: '8M+', // Rút gọn giá trị
        label: 'Deaths annually worldwide due to tobacco use.',
        delay: 0
      },
      {
        value: '1.2M+', // Rút gọn giá trị
        label: 'Non-smokers die from exposure to second-hand smoke annually.',
        delay: 0.2
      },
      {
        value: '7M+', // Rút gọn giá trị
        label: 'Of annual deaths are due to direct tobacco use.',
        delay: 0.4
      },
      {
        value: '20+',
        label: 'Types of cancer directly linked to smoking.',
        delay: 0.6
      },
      {
        value: '1 in 2',
        label: 'Long-term smokers will die from a tobacco-related disease.',
        delay: 0.8
      },
      {
        value: '$1.4T', // Rút gọn giá trị
        label: 'Global economic cost of smoking annually, including healthcare and lost productivity.',
        delay: 1.0
      }
    ].map((stat, idx) => (
      <motion.div
        key={idx}
        className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 font-sans" // Padding nhỏ hơn, bo góc vừa, font sans-serif
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: stat.delay }}
        variants={itemVariants}
      >
        <span className="block text-5xl font-bold text-emerald-600 mb-2 leading-tight"> {/* Giảm kích thước, font đậm, màu xanh lá, điều chỉnh line-height */}
          {stat.value}
        </span>
        <p className="text-base text-gray-700 leading-relaxed"> {/* Giảm kích thước chữ, màu xám, khoảng cách dòng */}
          {stat.label}
        </p>
      </motion.div>
    ))}
  </div>
</div>

      ---

     
    </section>
  );
};

export default HarmsSection;