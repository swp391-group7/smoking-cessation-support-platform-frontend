
import { motion } from 'framer-motion';
import { Button } from './ui/button'; // Import Button từ Shadcn UI
import { useNavigate } from "react-router-dom";


const CTAButton = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-all duration-300 ease-in-out"
        onClick={() => navigate('/user_survey')} // Thay đổi đường dẫn nếu cần
      >
        Start your journey now!
      </Button>
    </motion.div>
  );
};

export default CTAButton;