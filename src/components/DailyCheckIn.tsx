import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Calendar, Award, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  type QuitPlanDto,
  getActiveQuitPlan,
} from '../api/progressOverViewApi';
import {
  type QuitPlanStepDto,
  getPlanSteps,
} from '../api/planStepProgressApi';
import {
  createDailyCheckin,
  type CreateDailyCheckinRequest,
  type BadgeDto,
  type CreateCheckinResponse,
} from '../api/dailyCheckinApi';

const moodOptions = ['Good', 'Neutral', 'Bad'] as const;
type Mood = typeof moodOptions[number];

const DailyCheckIn: React.FC = () => {
  const [plan, setPlan] = useState<QuitPlanDto | null>(null);
  const [step, setStep] = useState<QuitPlanStepDto | null>(null);
  const [smokedToday, setSmokedToday] = useState<boolean | null>(null);
  const [numCigarettes, setNumCigarettes] = useState<number>(0);
  const [mood, setMood] = useState<Mood | ''>('');
  const [note, setNote] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  // Badge states
  const [newBadges, setNewBadges] = useState<BadgeDto[]>([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const activePlan = await getActiveQuitPlan();
        setPlan(activePlan);
        const steps = await getPlanSteps(activePlan.id);
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const current = steps.find(s => {
          const start = new Date(s.stepStartDate);
          const end = new Date(s.stepEndDate);
          return today >= start && today <= end;
        });
        setStep(current || null);
      } catch (err) {
        console.error('Error loading plan or steps', err);
      }
    })();

    // Check for badges in sessionStorage on component mount (after a reload)
    const storedBadges = sessionStorage.getItem('newBadgesToShow');
    if (storedBadges) {
      const badges: BadgeDto[] = JSON.parse(storedBadges);
      setNewBadges(badges);
      setShowBadgeModal(true);
      sessionStorage.removeItem('newBadgesToShow'); // Remove after displaying
    }
  }, []);

  const handleFormSubmit = async () => {
    if (!plan || !step || smokedToday === null || mood === '') return;
    const payload: CreateDailyCheckinRequest = {
      planId: plan.id,
      planStepId: step.id,
      status: smokedToday ? 'COMPLETED' : 'MISSED',
      mood,
      cigarettesSmoked: smokedToday ? numCigarettes : 0,
      note,
    };

    try {
      const response: CreateCheckinResponse = await createDailyCheckin(payload);
      // If there are new badges, save them to sessionStorage and then reload
      if (response.newBadges && response.newBadges.length > 0) {
        sessionStorage.setItem('newBadgesToShow', JSON.stringify(response.newBadges));
      }
      setSubmitted(true);
      window.location.reload(); // Reload the page immediately after submission
    } catch (err) {
      console.error('Error submitting check-in', err);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSmokedToday(null);
    setNumCigarettes(0);
    setMood('');
    setNote('');
  };

  // Function to handle closing badge modal without reloading
  const handleCloseBadgeModal = () => {
    setShowBadgeModal(false); // Just close the modal
    setNewBadges([]); // Clear badges from state
  };

  return (
    <div className="relative bg-gradient-to-br from-white to-green-50 rounded-lg p-5 shadow-lg border border-green-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-green-500 rounded-lg">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-lg text-green-800">Daily Check-In</h2>
      </div>

      {!submitted ? (
        <div className="space-y-4">
          <div>
            <label className="font-medium text-green-800 block mb-2">Did you smoke today?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setSmokedToday(false); setNumCigarettes(0); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  smokedToday === false
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                }`}
              >
                <XCircle className="w-4 h-4" /> No
              </button>
              <button
                type="button"
                onClick={() => { setSmokedToday(true); setNumCigarettes(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  smokedToday === true
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Yes
              </button>
            </div>
          </div>

          {smokedToday === true && (
            <div className="animate-fade-in">
              <label className="font-medium text-green-800 block mb-2">How many cigarettes?</label>
              <input
                type="number"
                min={1}
                value={numCigarettes}
                onChange={e => setNumCigarettes(Number(e.target.value))}
                className="border-2 border-green-200 p-3 rounded-lg w-32 focus:border-green-500 focus:outline-none transition-colors bg-white"
              />
            </div>
          )}

          {smokedToday !== null && (
            <>
              <div className="animate-fade-in">
                <label className="font-medium text-green-800 block mb-2">How do you feel today?</label>
                <div className="flex gap-3">
                  {moodOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMood(option)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        mood === option
                          ? 'bg-yellow-400 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                      }`}
                    >{option}</button>
                  ))}
                </div>
              </div>

              <div className="animate-fade-in">
                <label className="font-medium text-green-800 block mb-2">Note</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full border-2 border-green-200 p-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors bg-white"
                  placeholder="Any comments for today..."
                />
              </div>
            </>
          )}

          <button
            onClick={handleFormSubmit}
            disabled={smokedToday === null || mood === '' || !step}
            className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
              smokedToday !== null && mood !== '' && step
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >Submit Check-In</button>
        </div>
      ) : (
        <div className="text-center py-8 animate-fade-in-scale">
          <div className="mb-4">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Well Done!</h3>
            <p className="text-green-700 font-medium">Your daily check-in has been recorded</p>
          </div>

          <div className="flex justify-center gap-1 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-200"></div>
          </div>

          <button
            onClick={handleReset}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 hover:shadow-md"
          >New Check-In</button>
        </div>
      )}

      {/* Badge Modal with transparent overlay and enhanced animation */}
      <AnimatePresence>
        {showBadgeModal && newBadges.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 0.4 }}
            >
              {/* Confetti effect (simulated with CSS/SVG if needed, or a library) */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Example of a simple star burst animation - can be replaced with more complex effects */}
                <motion.div
                  className="absolute top-1/4 left-1/4 w-12 h-12 bg-yellow-400 rounded-full opacity-0"
                  animate={{ scale: [0, 1.5], opacity: [0, 0.7, 0], rotate: [0, 180, 360] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.1 }}
                />
                 <motion.div
                  className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-purple-400 rounded-full opacity-0"
                  animate={{ scale: [0, 1.3], opacity: [0, 0.6, 0], rotate: [0, -180, -360] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                />
              </div>

              <div className="relative z-10">
                <div className="mb-6 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
                    className="p-4 bg-green-500 rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-xl"
                  >
                    <Trophy className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-extrabold text-green-700 mb-2">🎉 Chúc Mừng! 🎉</h3>
                  <p className="text-lg text-gray-700 font-medium">Bạn đã đạt được huy hiệu mới!</p>
                </div>

                {newBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    className="bg-green-50 p-4 rounded-xl mb-4 border border-green-100 flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  >
                    <img src={badge.badgeImageUrl} alt={badge.badgeName} className="w-24 h-24 mx-auto mb-3 rounded-full object-cover shadow-md" />
                    <h4 className="font-bold text-xl text-green-800 mb-1">{badge.badgeName}</h4>
                    <p className="text-gray-600 text-sm px-2">{badge.badgeDescription}</p>
                  </motion.div>
                ))}

                <motion.button
                  onClick={handleCloseBadgeModal} // Now calls handleCloseBadgeModal (no reload)
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + newBadges.length * 0.1, duration: 0.3 }}
                >Tuyệt Vời!</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes fade-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0);} }
        @keyframes fade-in-scale { from{ opacity:0; transform:scale(0.9);} to{ opacity:1; transform:scale(1);} }
        .animate-fade-in { animation:fade-in 0.3s ease-out; }
        .animate-fade-in-scale { animation:fade-in-scale 0.4s ease-out; }
        .delay-100 { animation-delay:0.1s; }
        .delay-200 { animation-delay:0.2s; }
      `}</style>
    </div>
  );
};

export default DailyCheckIn;