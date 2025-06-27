import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getUserPlans } from "@/api/userPlanApi";
import type { UserPlan } from "@/api/userPlanApi";

export const QuitDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showActivePlanDialog, setShowActivePlanDialog] = useState(false);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate("/login");
  };

  const handleQuitProgress = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
    } else {
      navigate("/quit_progress");
    }
  };

  const handleQuitPlan = async () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    setError(null);
    try {
      const resp = await getUserPlans();
      const plansArray: UserPlan[] = Array.isArray(resp) ? resp : [resp];
      const active = plansArray.some((p) => p.status.toLowerCase() === "active");
      if (active) {
        setShowActivePlanDialog(true);
      } else {
        navigate("/quit_plan");
      }
    } catch (err) {
      console.error("Error checking plans", err);
      setError("Unable to check current plan.");
    }
  };

  const confirmRestart = () => {
    setShowActivePlanDialog(false);
    setShowConfirmRestart(true);
  };

  const handleRestart = () => {
    setShowConfirmRestart(false);
    navigate("/quit_plan");
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={handleQuitProgress}
            className="flex items-center px-3 py-1 rounded-2xl text-gray-800 hover:bg-emerald-100"
          >
            Quit
            <ChevronDown
              className={`ml-1 h-4 w-4 transform transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          align="start"
          className="mt-1 w-40 bg-white rounded-lg shadow-md"
        >
          <DropdownMenuItem asChild>
            <button
              onClick={handleQuitProgress}
              className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
            >
              Cessation Progress
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              onClick={handleQuitPlan}
              className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
            >
              Quit Plan
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              onClick={() => {
                if (!isLoggedIn) setShowLoginDialog(true);
                else navigate("/user_survey");
              }}
              className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
            >
              User Survey
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Login required dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-auto">
          <AlertDialogHeader className="relative flex flex-col items-center">
            <button
              onClick={() => setShowLoginDialog(false)}
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <AlertDialogTitle className="text-xl font-bold text-emerald-700 mt-4">
              Login Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600 mt-2 text-center">
              Please log in to access this feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
              className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLoginRedirect}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 py-2 shadow-md"
            >
              Log In
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Active plan dialog */}
      <AlertDialog
        open={showActivePlanDialog}
        onOpenChange={() => setShowActivePlanDialog(false)}
      >
        <AlertDialogContent className="bg-white rounded-lg p-8 shadow-xl max-w-lg mx-auto">
          <AlertDialogHeader className="relative flex flex-col items-center text-center pt-10">
            <button
              onClick={() => setShowActivePlanDialog(false)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <AlertDialogTitle className="text-2xl font-bold text-emerald-700">
              You already have an active plan!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-md text-gray-600 mt-3 leading-relaxed">
              Our system detected that you already have an active quit smoking plan. Do you want to continue with the current plan or create a new one?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <AlertDialogFooter className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <AlertDialogAction
              onClick={() => navigate("/quit_progress")}
              className="bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 shadow-md transition-all duration-200"
            >
              Continue Current Plan
            </AlertDialogAction>
            <AlertDialogAction
              onClick={confirmRestart}
              className="bg-white text-emerald-700 border border-emerald-600 px-6 py-3 rounded-full hover:bg-emerald-50 shadow-md transition-all duration-200"
            >
              Create New Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm restart dialog */}
      <AlertDialog
        open={showConfirmRestart}
        onOpenChange={() => setShowConfirmRestart(false)}
      >
        <AlertDialogContent className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-auto">
          <AlertDialogHeader className="relative flex flex-col items-center">
            <button
              onClick={() => setShowConfirmRestart(false)}
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <AlertDialogTitle className="text-xl font-bold text-emerald-700 mt-4">
              Confirm New Plan?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600 mt-2 text-center">
              Creating a new plan will end the current one. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-3 mt-6">
            <AlertDialogCancel
              onClick={() => setShowConfirmRestart(false)}
              className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestart}
              className="bg-red-600 text-white rounded-full px-5 py-2 hover:bg-red-700 shadow-md"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
