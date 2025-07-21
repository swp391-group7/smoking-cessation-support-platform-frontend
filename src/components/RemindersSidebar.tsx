import React, { useState, useEffect } from 'react';
import { Clock, Bell, Zap } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion từ Framer Motion
import { fetchTodayProgressCount, fetchWeeklyProgressCount } from '@/api/remindApi';

const DailyLogBar: React.FC = () => {
  const [progressCount, setProgressCount] = useState<number | null>(null);
  const [cigaretteCount, setCigaretteCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [pCount, cCount] = await Promise.all([
          fetchTodayProgressCount(),
          fetchWeeklyProgressCount()
        ]);
        setProgressCount(pCount);
        setCigaretteCount(cCount);
      } catch (error) {
        console.error('Failed to load daily stats', error);
        // Fallback to 0 if data fetching fails
        setProgressCount(0);
        setCigaretteCount(0);
      }
    })();
  }, []);

  const renderProgressMessage = () => {
    if (progressCount === null) {
      return (
        <span className="text-sm font-medium text-green-800">
          Loading your progress...
        </span>
      );
    } else if (progressCount === 0) {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-green-800">
            You haven't logged anything today.
          </span>
          <span className="text-xs text-green-600 mt-1">
            Every step counts on your journey to quit. Log your progress now!
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-green-800">
            You have{' '}
            <motion.span
              key={progressCount} // Key để kích hoạt animation khi số thay đổi
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-lg font-bold text-green-700" // Làm nổi bật số
            >
              {progressCount}
            </motion.span>{' '}
            daily log{progressCount > 1 ? 's' : ''} today!
          </span>
          <span className="text-xs text-green-600 mt-1">
            Fantastic job! Keep up the great work and log any new updates.
          </span>
        </div>
      );
    }
  };

  const renderCigaretteMessage = () => {
    if (cigaretteCount === null) {
      return (
        <span className="text-sm font-medium text-green-800">
          Loading cigarette count...
        </span>
      );
    } else {
      let message;
      let textColor = "text-green-800"; // Default color

      const countSpan = (
        <motion.span
          key={cigaretteCount} // Key để kích hoạt animation khi số thay đổi
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-lg font-bold" // Làm nổi bật số, màu sẽ được ghi đè bởi textColor
        >
          {cigaretteCount}
        </motion.span>
      );

      if (cigaretteCount === 0) {
        message = (
          <>
            You haven't smoked today! <Zap className="w-4 h-4 inline-block text-yellow-500" />
          </>
        );
        textColor = "text-blue-700"; // Special color for zero cigarettes
      } else if (cigaretteCount > 0 && cigaretteCount <= 5) {
        message = (
          <>
            You've smoked {countSpan} cigarette{cigaretteCount > 1 ? 's' : ''} today. Keep going!
          </>
        );
        textColor = "text-orange-600";
      } else {
        message = (
          <>
            You've smoked {countSpan} cigarette{cigaretteCount > 1 ? 's' : ''} today. Don't give up, tomorrow's a new chance!
          </>
        );
        textColor = "text-red-600";
      }

      return (
        <div className="flex flex-col items-end text-right">
          <span className={`text-sm font-semibold ${textColor}`}>
            {cigaretteCount === 0 ? message : null} {/* Hiển thị message đầy đủ nếu là 0 */}
            {cigaretteCount !== 0 ? message : null} {/* Nếu không phải 0, hiển thị message với countSpan */}
          </span>
          <span className="text-xs text-green-600 mt-1">
            Stay strong, a healthier you is within reach!
          </span>
        </div>
      );
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-white to-green-100 rounded-xl p-4 shadow-xl border border-green-200 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Background overlay for subtle effect */}
      <div className="absolute inset-0 bg-white opacity-20 transform -rotate-45 scale-150 z-0"></div>

      {/* Progress status */}
      <motion.div
        className="flex items-start gap-3 flex-1 z-10 w-full md:w-auto"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <Bell className="w-6 h-6 text-green-600 shrink-0 mt-1" />
        {renderProgressMessage()}
      </motion.div>

      {/* Visually appealing separator that doesn't create awkward space */}
      <div className="hidden md:block w-px h-16 bg-green-300 mx-6 rounded-full shadow-inner z-10"></div>
      <div className="block md:hidden w-full h-px bg-green-300 my-4 rounded-full shadow-inner z-10"></div>

      {/* Cigarette count */}
      <motion.div
        className="flex items-start gap-3 flex-1 justify-end text-right z-10 w-full md:w-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        {renderCigaretteMessage()}
        <Clock className="w-6 h-6 text-green-600 shrink-0 mt-1" />
      </motion.div>
    </div>
  );
};

export default DailyLogBar;