import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Calendar, Award } from 'lucide-react';
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

  useEffect(() => {
    (async () => {
      try {
        const activePlan = await getActiveQuitPlan();
        setPlan(activePlan);
        const steps = await getPlanSteps(activePlan.id);
        const today = new Date();
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
      await createDailyCheckin(payload);
      setSubmitted(true);
      window.location.reload();
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

  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-lg p-5 shadow-lg border border-green-100">
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

      <style>{`
        @keyframes fade-in {from {opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fade-in-scale {from{opacity:0;transform:scale(0.9);}to{opacity:1;transform:scale(1);}}
        .animate-fade-in {animation:fade-in 0.3s ease-out;}
        .animate-fade-in-scale {animation:fade-in-scale 0.4s ease-out;}
        .delay-100 {animation-delay:0.1s;}
        .delay-200 {animation-delay:0.2s;}
      `}</style>
    </div>
  );
};

export default DailyCheckIn;