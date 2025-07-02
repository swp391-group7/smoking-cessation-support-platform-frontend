import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { getAllPackageTypes } from '@/api/membershipApi';
import type { PackageType } from '@/api/membershipApi';

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PackageType | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await getAllPackageTypes();
        setPlans(data);
      } catch (error) {
        console.error(error);
        setError('Failed to load membership plans.');
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleSignUpClick = (plan: PackageType) => {
    if (plan.price === 0) {
      alert("You've selected the Free Plan! No sign-up process needed here.");
    } else {
      setSelectedPlan(plan);
    }
  };

  const handlePayPalPayment = (planName: string, price: number) => {
    alert(`Initiating PayPal payment for ${planName} ($${price}).`);
    // integrate PayPal SDK or API here
  };

  const mapFeatures = (plan: PackageType) => {
    return [plan.des1, plan.des2, plan.des3, plan.des4, plan.des5].filter(Boolean);
  };

  if (loading) {
    return <div className="text-center mt-20">Loading plans...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 py-16 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-green-200">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Explore Our Membership Plans</h1>
        <p className="text-lg text-gray-700 mb-10">
          Find the perfect plan to support your journey to a smoke-free life.
        </p>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 mb-12">
          {plans.map((plan) => (
            <div key={plan.id} className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</h2>
              <p className="text-4xl text-green-600 font-bold mb-4">${plan.price}</p>
              <p className="text-gray-600 mb-6 flex-grow">{plan.description}</p>

              <ul className="text-gray-700 mb-8 space-y-3">
                {mapFeatures(plan).map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSignUpClick(plan)}
                className={`w-full py-3 rounded-full font-semibold text-lg transition-colors duration-300 shadow-md hover:shadow-lg
                  ${plan.price === 0
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }
                `}
              >
                {plan.price === 0 ? 'Get Started for Free' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-left relative animate-fade-in-up">
              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">{selectedPlan.name} Details</h2>
              <p className="text-xl text-green-600 font-bold mb-4 text-center">Price: ${selectedPlan.price}</p>
              <p className="text-gray-700 mb-6">{selectedPlan.description}</p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">What's included:</h3>
              <ul className="text-gray-700 space-y-2 mb-8">
                {mapFeatures(selectedPlan).map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {selectedPlan.price > 0 && (
                <button
                  onClick={() => handlePayPalPayment(selectedPlan.name, selectedPlan.price)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-emerald-800 transition-colors duration-300 shadow-md flex items-center justify-center"
                >
                  <img src="https://www.paypalobjects.com/digitalassets/c/website/marketing/na/us/logos-badges/ppc_white.png" alt="PayPal" className="h-6 mr-2" />
                  Pay with PayPal
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="block text-green-600 hover:text-green-800 mt-8 mx-auto text-lg"
        >
          &larr; Back to Home
        </button>
      </div>
    </div>
  );
};

export default MembershipPage;