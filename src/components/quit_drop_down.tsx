import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const QuitDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={() => navigate("/user_survey")} // 👈 điều hướng khi click
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
          <NavLink
            to="/quit_progress"
            className="block w-full px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
          >
            Cessation Progress
          </NavLink>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <NavLink
            to="/quit_plan"
            className="block w-full px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
          >
            Quit Plan
          </NavLink>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <NavLink
            to="/user_survey"
            className="block w-full px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
          >
            User Survey
          </NavLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
