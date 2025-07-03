import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { getAllPackageTypes, createPayment, executePayment } from '@/api/membershipApi';
import type { PackageType } from '@/api/membershipApi';

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [plans, setPlans] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PackageType | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  
  // Ref để tránh double execution trong StrictMode
  const paymentProcessedRef = useRef<boolean>(false);

  // Safe localStorage getter
  const getUserId = useCallback((): string | null => {
    try {
      return localStorage.getItem('userId');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }, []);

  // Handle PayPal redirect and execute payment
  useEffect(() => {
    const params = new URLSearchParams(search);
    const success = params.get('success');
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');

    // Nếu không có parameters hoặc đã xử lý rồi, không làm gì cả
    if (!success || paymentProcessedRef.current) return;

    if (success === 'true' && paymentId && payerId) {
      paymentProcessedRef.current = true;
      
      (async () => {
        try {
          setPaymentLoading(true);
          
          // Clear URL ngay lập tức để tránh re-run
          window.history.replaceState({}, '', '/membership');
          
          await executePayment(paymentId, payerId);
          alert('Payment successful! Welcome to your new membership plan.');
          navigate('/membership', { replace: true });
        } catch (e) {
          console.error('Payment execution error:', e);
          alert('Error finalizing payment. Please contact support.');
        } finally {
          setPaymentLoading(false);
        }
      })();
    } else if (success === 'false') {
      paymentProcessedRef.current = true;
      
      // Clear URL ngay lập tức
      window.history.replaceState({}, '', '/membership');
      alert('Payment was cancelled. You can try again anytime.');
    }
  }, [search, navigate]);

  // Fetch plans
  useEffect(() => {
    async function fetchPlans() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllPackageTypes();
        setPlans(data);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load membership plans. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleSignUpClick = useCallback((plan: PackageType) => {
    if (plan.price === 0) {
      alert("You've selected the Free Plan! Redirecting to dashboard.");
      navigate('/dashboard');
    } else {
      setSelectedPlan(plan);
    }
  }, [navigate]);

  const handlePayPalPayment = useCallback(async (plan: PackageType) => {
    try {
      setPaymentLoading(true);
      const userId = getUserId();
      
      if (!userId) {
        alert('Please log in to subscribe to a membership plan.');
        navigate('/login');
        return;
      }

      const baseUrl = window.location.origin;
      const cancelUrl = `${baseUrl}/membership?success=false`;
      const successUrl = `${baseUrl}/membership?success=true`;

      const paymentData = await createPayment({
        userId,
        packageTypeId: plan.id,
        cancelUrl,
        successUrl,
      });

      if (paymentData.approvalUrl) {
        window.location.href = paymentData.approvalUrl;
      } else {
        throw new Error('No approval URL received from PayPal');
      }
    } catch (err) {
      console.error('Payment creation error:', err);
      
      let errorMessage = 'Failed to initiate payment. Please try again.';
      
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          errorMessage = 'Session expired. Please log in again.';
          navigate('/login');
        } else if (err.message.includes('400')) {
          errorMessage = 'Invalid payment data. Please try again.';
        } else {
          errorMessage = `Payment error: ${err.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  }, [getUserId, navigate]);

  const mapFeatures = useCallback((plan: PackageType): string[] => {
    return [plan.des1, plan.des2, plan.des3, plan.des4, plan.des5]
      .filter((feature): feature is string => Boolean(feature));
  }, []);

  const handleCloseModal = useCallback(() => {
    if (!paymentLoading) {
      setSelectedPlan(null);
    }
  }, [paymentLoading]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedPlan && !paymentLoading) {
        setSelectedPlan(null);
      }
    };

    if (selectedPlan) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedPlan, paymentLoading]);

  if (paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Processing payment...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 py-16 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 border-2 border-green-200">
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
          Explore Our Membership Plans
        </h1>
        <p className="text-lg text-gray-700 mb-10 text-center">
          Find the perfect plan to support your journey to a smoke-free life.
        </p>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 mb-12">
          {plans.map(plan => (
            <div 
              key={plan.id} 
              className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100 hover:border-green-300 transition-all duration-300"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                {plan.name}
              </h2>
              <p className="text-4xl text-green-600 font-bold mb-4">
                ${plan.price}
                {plan.price > 0 && (
                  <span className="text-lg text-gray-500">/month</span>
                )}
              </p>
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
                disabled={paymentLoading}
                className={`w-full py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                  ${plan.price === 0
                    ? 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                  }
                `}
              >
                {plan.price === 0 ? 'Start Free' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-left relative animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                disabled={paymentLoading}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold disabled:opacity-50 transition-colors"
                aria-label="Close modal"
              >
                ×
              </button>

              <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">
                {selectedPlan.name} Details
              </h2>
              <p className="text-xl text-green-600 font-bold mb-4 text-center">
                Price: ${selectedPlan.price}
              </p>
              <p className="text-gray-700 mb-6">{selectedPlan.description}</p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                What's included:
              </h3>
              <ul className="text-gray-700 space-y-2 mb-8">
                {mapFeatures(selectedPlan).map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {selectedPlan.price > 0 && (
                <button
                  onClick={() => handlePayPalPayment(selectedPlan)}
                  disabled={paymentLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-emerald-800 transition-colors duration-300 shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <img 
                        src="https://www.paypalobjects.com/digitalassets/c/website/marketing/na/us/logos-badges/ppc_white.png" 
                        alt="PayPal" 
                        className="h-6 mr-2" 
                      />
                      Pay with PayPal
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="block text-green-600 hover:text-green-800 mt-8 mx-auto text-lg transition-colors"
        >
          &larr; Back to Home
        </button>
      </div>
    </div>
  );
};

export default MembershipPage;