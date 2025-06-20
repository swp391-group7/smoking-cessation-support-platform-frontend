import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const AnimatedElements = () => {
  return (
    <>
      {/* Lá cây bay lượn */}
      {[...Array(200)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-300 opacity-70"
          initial={{
            y: '100vh',
            x: `${Math.random() * 100}vw`,
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
          }}
          animate={{
            y: '-20vh',
            x: `${Math.random() * 100}vw`,
            rotate: Math.random() * 720,
            transition: {
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            },
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${20 + Math.random() * 40}px`,
          }}
        >
          <Leaf />
        </motion.div>
      ))}

      {/* Hiệu ứng hơi thở tự do (ví dụ: vòng tròn lan tỏa) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{
          scale: [0, 1],
          opacity: [0.5, 0.2, 0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
          },
        }}
        style={{
          borderRadius: '50%',
          backgroundColor: 'rgba(144, 238, 144, 0.4)', // Light green with transparency
          width: '500px',
          height: '500px',
        }}
      />
       <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ scale: 0, opacity: 0.4 }}
        animate={{
          scale: [0, 1],
          opacity: [0.4, 0.1, 0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1.5, // Thêm độ trễ để tạo hiệu ứng lớp
          },
        }}
        style={{
          borderRadius: '50%',
          backgroundColor: 'rgba(144, 238, 144, 0.3)',
          width: '600px',
          height: '600px',
        }}
      />
      {/* Bạn có thể thêm hình ảnh người vươn lên vượt qua nghiện thuốc ở đây, ví dụ: */}
      {/* <motion.img
        src="/path/to/person-reaching-up.png" // Đặt hình ảnh vào thư mục public
        alt="Person overcoming addiction"
        className="absolute bottom-0 right-0 w-64 h-auto" // Điều chỉnh kích thước và vị trí
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      /> */}
    </>
  );
};

export default AnimatedElements;