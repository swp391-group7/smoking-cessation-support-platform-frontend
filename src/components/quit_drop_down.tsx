import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const QuitDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleProtectedNavigate = (path: string) => {
    if (!isLoggedIn) {
      setShowDialog(true);
    } else {
      navigate(path);
    }
  };

  const handleLoginRedirect = () => {
    setShowDialog(false);
    navigate("/login");
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={() => handleProtectedNavigate("/quit_progress")}
            className="flex items-center px-3 py-1 rounded-2xl text-gray-800 hover:bg-emerald-100"
          >
            Quit
            <ChevronDown
              className={`ml-1 h-4 w-4 transform transition-transform ${
                open ? "rotate-180" : ""
              }`}
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
              onClick={() => handleProtectedNavigate("/quit_progress")}
              className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
            >
              Cessation Progress
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              onClick={() => handleProtectedNavigate("/quit_plan")}
              className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
            >
              Quit Plan
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              onClick={() => handleProtectedNavigate("/user_survey")}
              className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
            >
              User Survey
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog shown if not logged in */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-white rounded-xl border-2 border-emerald-600 p-6 w-96 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold text-emerald-800">
              You need to log in to continue
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLoginRedirect}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
            >
              Login
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
