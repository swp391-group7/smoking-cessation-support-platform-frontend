import { useState, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// Import your components
import ProgressOverview from '../../components/ProgressOverview';
import DailyCheckIn from '../../components/DailyCheckIn';
import HistorySidebar from '../../components/HistorySidebar';
import RemindersSidebar from '../../components/RemindersSidebar';
import BadgesSidebar from '../../components/BadgesSidebar';
import PlanStepProgress from '../../components/PlanStepProgress';
import CoachChat from '../../components/CoachChat';

// Import components from shadcn/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Define new page types
type Page = 'dashboard' | 'history' | 'badges' | 'noti';

export default function Quit_Progress() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0); // State mới để lưu số tin nhắn chưa đọc

  const reminders = [
    { time: "10:00 AM", text: "Stay strong! The first week is the hardest.", icon: "📘" },
  ];

  const pageVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Variants cho chat widget
  const chatWidgetVariants: Variants = {
    closed: { opacity: 0, y: 300, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } },
    open: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Callback để nhận số lượng tin nhắn mới từ CoachChat
  const handleNewMessageCountChange = useCallback((count: number) => {
    // Chỉ cập nhật nếu chat đang đóng
    if (!isChatOpen) {
      setUnreadMessageCount(count);
    } else {
      setUnreadMessageCount(0); // Khi chat mở, reset số tin nhắn chưa đọc
    }
  }, [isChatOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar Navigation */}
      <Card className="w-60 border-r border-gray-100 bg-white shadow-lg rounded-none sticky top-0 h-screen flex flex-col pt-5 pb-5">
        <nav className="flex-1 space-y-2">
          {/* Dashboard */}
          <Button
            variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
            className={`w-full justify-start text-base py-5 px-4 rounded-md transition-all duration-200 ease-in-out ${currentPage === 'dashboard'
                ? 'bg-green-600 text-white shadow-sm hover:bg-green-700'
                : 'text-green-700 hover:bg-gray-50 hover:text-green-700'
              }`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-2 2v10a1 1 0 001 1h3"></path>
            </svg>
            Overview
          </Button>

          {/* History */}
          <Button
            variant={currentPage === 'history' ? 'default' : 'ghost'}
            className={`w-full justify-start text-base py-5 px-4 rounded-md transition-all duration-200 ease-in-out ${currentPage === 'history'
                ? 'bg-green-600 text-white shadow-sm hover:bg-green-700'
                : 'text-green-700 hover:bg-gray-50 hover:text-green-700'
              }`}
            onClick={() => setCurrentPage('history')}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            History
          </Button>

          {/* Badges */}
          <Button
            variant={currentPage === 'badges' ? 'default' : 'ghost'}
            className={`w-full justify-start text-base py-5 px-4 rounded-md transition-all duration-200 ease-in-out ${currentPage === 'badges'
                ? 'bg-green-600 text-white shadow-sm hover:bg-green-700'
                : 'text-green-700 hover:bg-gray-50 hover:text-green-700'
              }`}
            onClick={() => setCurrentPage('badges')}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M10 21h4a2 2 0 002-2V7a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Badges
          </Button>

          {/* Notifications */}
          <Button
            variant={currentPage === 'noti' ? 'default' : 'ghost'}
            className={`w-full justify-start text-base py-5 px-4 rounded-md transition-all duration-200 ease-in-out ${currentPage === 'noti'
                ? 'bg-green-600 text-white shadow-sm hover:bg-green-700'
                : 'text-green-700 hover:bg-gray-50 hover:text-green-700'
              }`}
            onClick={() => setCurrentPage('noti')}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Notification
          </Button>
        </nav>
      </Card>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-auto bg-gray-50">
        <AnimatePresence mode="wait">
          {currentPage === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <ProgressOverview />
              <RemindersSidebar reminders={reminders} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DailyCheckIn />
                <PlanStepProgress />
              </div>
            </motion.div>
          )}

          {currentPage === 'history' && (
            <motion.div
              key="history"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <HistorySidebar />
            </motion.div>
          )}

          {currentPage === 'badges' && (
            <motion.div
              key="badges"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <BadgesSidebar />
            </motion.div>
          )}

          {currentPage === 'noti' && (
            <motion.div
              key="noti"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-gray-700">Notifications</h2>
              <Card className="p-6">
                <CardContent>
                  <p className="text-gray-600">This is where your notifications will appear.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Chat Widget */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="coach-chat-widget"
            variants={chatWidgetVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed bottom-4 right-4 z-50 w-[400px] h-[550px]"
          >
            <CoachChat
              onClose={() => setIsChatOpen(false)}
              onNewMessageCountChange={handleNewMessageCountChange}
              isVisible={isChatOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Bubble Button (always visible when chat is closed) */}
      {!isChatOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            setIsChatOpen(true);
            setUnreadMessageCount(0); // Reset count when opening chat
          }}
          className="fixed bottom-4 right-4 z-50 bg-green-600 text-white rounded-full p-4 shadow-xl hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
          title="Open Coach Chat"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          {unreadMessageCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadMessageCount}
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
}