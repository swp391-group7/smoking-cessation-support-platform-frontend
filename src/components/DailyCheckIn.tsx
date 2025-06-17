import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type DailyFormValues = {
  numCigarettes: number;
};

interface DailyCheckInProps {
  onSubmit: (data: DailyFormValues & { smokedToday: boolean }) => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onSubmit }) => {
  const { register, handleSubmit, setValue, reset } = useForm<DailyFormValues>();
  const [smokedToday, setSmokedToday] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (data: DailyFormValues) => {
    onSubmit({
      ...data,
      smokedToday: smokedToday || false
    });
    reset();
    setSmokedToday(null);
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-md p-6 shadow relative overflow-hidden">
      <h2 className="font-semibold text-lg mb-4">Daily Check-In</h2>
      
      {!submitted ? (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 transition-all duration-500">
          <div>
            <label className="font-medium">Did you smoke today?</label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={smokedToday === false} 
                  onChange={() => { setSmokedToday(false); setValue("numCigarettes", 0); }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-green-600 font-medium">No</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={smokedToday === true} 
                  onChange={() => { setSmokedToday(true); setValue("numCigarettes", 1); }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-red-500 font-medium">Yes</span>
              </label>
            </div>
          </div>

          {smokedToday === true && (
            <div className="animate-fade-in">
              <label className="font-medium text-gray-700">How many cigarettes?</label>
              <input 
                type="number" 
                min={1} 
                {...register("numCigarettes", { valueAsNumber: true })} 
                className="border-2 border-gray-300 p-3 rounded-lg w-40 mt-2 focus:border-blue-500 focus:outline-none transition-colors" 
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={smokedToday === null} 
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 transform ${
              smokedToday !== null 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg hover:shadow-xl' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Submit Daily Check-In
          </button>
        </form>
      ) : (
        <div className="text-center py-12 animate-fade-in-scale">
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 text-lg font-medium">
              Your daily check-in has been recorded successfully
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          
          <button 
            onClick={() => {setSubmitted(false); setSmokedToday(null);}} 
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            New Check-In
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DailyCheckIn;