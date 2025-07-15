import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@radix-ui/react-dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  fetchAllCoaches,
  fetchUserById,
  assignCoach,
  type CoachDto,
  type UserDto,
} from '../api/coachApi';
import { getUserPlans } from '../api/userPlanApi';
import { getSurveyByUserId } from '../api/usersurveyApi';

interface CoachDetails extends CoachDto {
  user: UserDto;
}

export const CoachSelectionPage: React.FC = () => {
  const [coaches, setCoaches] = useState<CoachDetails[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<CoachDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For missing requirements
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [showMissingDialog, setShowMissingDialog] = useState(false);

  // For success notification
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCoaches = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const coachDtos = await fetchAllCoaches();
        const withUsers = await Promise.all(
          coachDtos.map(async (c) => {
            const user = await fetchUserById(c.userId);
            return { ...c, user };
          })
        );
        setCoaches(withUsers);
      } catch {
        setError('Failed to load coaches. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCoaches();
  }, []);

  const getInitials = (fullName: string) =>
    fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const openCoachDialog = (coach: CoachDetails) => {
    setSelectedCoach(coach);
    setIsDialogOpen(true);
  };

  // Check survey & plan
  const checkUserRequirements = async (): Promise<{ hasSurvey: boolean; hasPlan: boolean }> => {
    let hasSurvey = false;
    let hasPlan = false;
    try {
      await getSurveyByUserId();
      hasSurvey = true;
    } catch {
      hasSurvey = false;
    }
    try {
      const resp = await getUserPlans();
      const arr = Array.isArray(resp) ? resp : [resp];
      hasPlan = arr.length > 0;
    } catch {
      hasPlan = false;
    }
    return { hasSurvey, hasPlan };
  };

  const confirmCoachAssignment = async () => {
    if (!selectedCoach) return;
    setIsLoading(true);
    setError(null);

    try {
      await assignCoach(selectedCoach.userId);
      setShowSuccessDialog(true);
    } catch {
      setError('Failed to assign coach. Please try again.');
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleSuccessDialogClose = async () => {
    setShowSuccessDialog(false);
    const { hasSurvey, hasPlan } = await checkUserRequirements();
    const missing: string[] = [];
    if (!hasSurvey) missing.push('Survey');
    if (!hasPlan) missing.push('Quit Plan');

    if (missing.length > 0) {
      setMissingItems(missing);
      setShowMissingDialog(true);
    } else {
      navigate('/quit_progress');
    }
  };

  const handleMissingAction = () => {
    setShowMissingDialog(false);
    if (missingItems.includes('Survey')) {
      navigate('/user_survey');
    } else {
      navigate('/quit_plan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <h1 className="text-4xl font-bold text-center text-green-800 mb-6">
        Select Your Coach
      </h1>

      {/* Introduction Section */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <p className="text-xl text-green-800 font-medium mb-4">
          Embark on your journey to a smoke-free life with personalized guidance.
        </p>
        <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Our dedicated coaches provide **expert support, motivation, and tailored strategies** to help you overcome challenges and build healthier habits. Choose a coach who aligns with your needs and begin your progress today!
        </p>
      </div>

      {isLoading && !coaches.length && (
        <p className="text-center text-green-700">Loading coaches...</p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <Card
            key={coach.userId}
            onClick={() => openCoachDialog(coach)}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 p-0 rounded-2xl overflow-hidden border border-green-200 group relative"
          >
            {/* Overlay for hover effect */}
            <div className="absolute inset-0 bg-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

            <CardHeader className="flex flex-col items-center p-6 bg-green-100/50 border-b border-green-200">
              <Avatar className="h-20 w-20 border-green-500 border-4 shadow-lg mb-4">
                <AvatarImage
                  src={
                    coach.user.avtarPath ||
                    `https://placehold.co/150x150?text=${getInitials(
                      coach.user.fullName
                    )}`
                  }
                  alt={coach.user.fullName}
                />
                <AvatarFallback className="text-2xl font-bold bg-green-500 text-white">
                  {getInitials(coach.user.fullName)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold text-green-800 text-center">
                {coach.user.fullName}
              </CardTitle>
              <CardDescription className="text-green-700 text-sm mt-1">
                Quitting Coach Specialist
              </CardDescription>
              <div className="flex items-center mt-2 text-yellow-500 font-semibold">
                <span>{coach.avgRating.toFixed(1)}</span>
                <span className="ml-1">⭐</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 line-clamp-3 mb-3 text-center">
                {coach.bio || 'No bio available.'}
              </p>
              <p className="mt-2 text-center text-gray-600">
                <strong className="text-green-700">Qualification:</strong> {coach.qualification}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coach Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay className="fixed inset-0 bg-black/60" />
        <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-300">
          {selectedCoach && (
            <>
              <Avatar className="h-24 w-24 mx-auto mb-4 border-green-500 border-4">
                <AvatarImage
                  src={
                    selectedCoach.user.avtarPath ||
                    `https://placehold.co/200x200?text=${getInitials(
                      selectedCoach.user.fullName
                    )}`
                  }
                  alt={selectedCoach.user.fullName}
                />
                <AvatarFallback className="text-3xl">
                  {getInitials(selectedCoach.user.fullName)}
                </AvatarFallback>
              </Avatar>
              <DialogTitle className="text-3xl text-center mb-2 text-green-800 font-semibold">
                {selectedCoach.user.fullName}
              </DialogTitle>
              <DialogDescription className="text-center mb-6 text-gray-600">
                Your potential new coach!
              </DialogDescription>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
                <div>
                  <strong className="text-green-700">Email:</strong>
                  <p>{selectedCoach.user.email}</p>
                </div>
                <div>
                  <strong className="text-green-700">Phone:</strong>
                  <p>{selectedCoach.user.phoneNumber}</p>
                </div>
                <div className="md:col-span-2">
                  <strong className="text-green-700">Bio:</strong>
                  <p>{selectedCoach.bio || 'No bio provided.'}</p>
                </div>
                <div>
                  <strong className="text-green-700">Qualification:</strong>
                  <p>{selectedCoach.qualification}</p>
                </div>
                <div>
                  <strong className="text-green-700">Avg Rating:</strong>
                  <p>{selectedCoach.avgRating.toFixed(1)} ⭐</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-green-500 text-green-700 hover:bg-green-50">
                  Cancel
                </Button>
                <Button onClick={confirmCoachAssignment} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
                  {isLoading ? 'Assigning...' : 'Confirm Assignment'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Notification Dialog */}
      <AlertDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      >
        <AlertDialogContent className="max-w-sm p-6 bg-white rounded-2xl shadow-xl border-2 border-green-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-green-800 text-center">
              Congratulations! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 text-center">
              Your coach has been successfully assigned. They will contact you soon. Enjoy your experience!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction onClick={handleSuccessDialogClose} className="bg-green-600 hover:bg-green-700 text-white">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Missing Requirements Dialog */}
      <AlertDialog
        open={showMissingDialog}
        onOpenChange={setShowMissingDialog}
      >
        <AlertDialogContent className="max-w-md p-6 bg-white rounded-2xl shadow-xl border-2 border-green-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-green-800">Almost There!</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              To start your quit progress, please complete:
              <ul className="mt-2 list-disc list-inside text-gray-600">
                {missingItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end space-x-3">
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMissingAction} className="bg-green-600 hover:bg-green-700 text-white">
              {missingItems.includes('Survey')
                ? 'Complete Survey'
                : 'Create Quit Plan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CoachSelectionPage;