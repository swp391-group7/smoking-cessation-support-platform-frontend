// src/pages/Quit_Progress.tsx
import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// Import your components
import ProgressOverview from '../../components/ProgressOverview';
import DailyCheckIn from '../../components/DailyCheckIn';
import HistorySidebar from '../../components/HistorySidebar'; // Now displayed on a dedicated history page
import RemindersSidebar from '../../components/RemindersSidebar'; // Still used, but in a different position
import BadgesSidebar from '../../components/BadgesSidebar';
import PlanStepProgress from '../../components/PlanStepProgress';
import CoachChat from '../../components/CoachChat';

// Import components from shadcn/ui
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';


// Define new page types
type Page = 'dashboard' | 'history' | 'badges' | 'chat';

export default function Quit_Progress() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');





  const reminders = [
    { time: "10:00 AM", text: "Stay strong! The first week is the hardest.", icon: "📘" },
    
  ];

  const badges = [
    { name: "First Day", description: "Completed your first smoke-free day", earned: true, icon: "🥇" },
    { name: "One Week", description: "One week smoke-free", earned: true, icon: "🎉" },
    { name: "Money Saved", description: "Saved $50", earned: true, icon: "💰" },
    { name: "Health Improvement", description: "Your lungs are healing", earned: false, icon: "🫁" },
    { name: "Two Weeks", description: "Two weeks smoke-free", earned: false, icon: "⚠️" },
    { name: "Long Haul", description: "One month smoke-free", earned: false, icon: "🏃" },
  ];


  const handleSendMessage = (message: string) => {
    console.log("Message sent to coach:", message);
    // TODO: Send message to coach API
  };

  const pageVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar Navigation */}
      <Card className="w-60 border-r border-gray-100 bg-white shadow-lg rounded-none sticky top-0 h-screen flex flex-col pt-5 pb-5"> {/* Changed p-5 to pt-5 pb-5 */}
        <nav className="flex-1 space-y-2"> {/* Removed mt-8 here */}
          {/* Dashboard */}
          <Button
            variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
            className={`w-full justify-start text-base py-5 px-4 rounded-md transition-all duration-200 ease-in-out ${
              currentPage === 'dashboard'
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

          {/* History (moved to a separate page) */}
          <Button
            variant={currentPage === 'history' ? 'default' : 'ghost'}
            className={`w-full justify-start text-base py-5 px-4 rounded-md transition-all duration-200 ease-in-out ${
              currentPage === 'history'
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
            className={`w-full justify-start text-base py-5 px-4 rounded-md transition-all duration-200 ease-in-out ${
              currentPage === 'badges'
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

          {/* Coach Chat */}
          <Button
            variant={currentPage === 'chat' ? 'default' : 'ghost'}
            className={`w-full justify-start text-base py-5 px-4 rounded-md transition-all duration-200 ease-in-out ${
              currentPage === 'chat'
                ? 'bg-green-600 text-white shadow-sm hover:bg-green-700'
                : 'text-green-700 hover:bg-gray-50 hover:text-green-700'
            }`}
            onClick={() => setCurrentPage('chat')}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Chat with Coach
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
              <ProgressOverview
              />

              {/* Reminders in a more prominent position */}
              <RemindersSidebar reminders={reminders} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DailyCheckIn/>
                <PlanStepProgress/>
              </div>
            </motion.div>
          )}

          {/* Dedicated History page */}
          {currentPage === 'history' && (
            <motion.div
              key="history"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <HistorySidebar/> 
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
              <BadgesSidebar badges={badges} />
            </motion.div>
          )}

         {currentPage === 'chat' && (
  <motion.div
    key="chat"
    variants={pageVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="flex-1 flex"        // <-- flex-1 để căng đầy
  >
    <CoachChat onSendMessage={handleSendMessage} />
  </motion.div>
)}

        </AnimatePresence>
      </main>
    </div>
  );
}