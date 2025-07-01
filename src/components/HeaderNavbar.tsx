import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  User as UserIcon,
  CreditCard as CreditCardIcon,
  LogOut as LogOutIcon,
  X as CloseIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { QuitDropdown } from "./quit_drop_down";
import { ResourcDropdown } from "./resource_drop_down";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  full_name: string;
  avatarUrl: string;
}

const midSections = [
  { id: "hero", label: "Home" },
  { id: "harms", label: "AirBloom" },
  { id: "benefits", label: "Benefits" },
  { id: "why", label: "About us" },
  { id: "guide", label: "Journey" },
  { id: "contact", label: "FAQs" },
];

export const HeaderNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeSection, setActiveSection] = useState(midSections[0].id);
  const [showTopBar, setShowTopBar] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setShowTopBar(y < lastScroll.current || y < 10);
      lastScroll.current = y;
      midSections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 50 && rect.bottom > 80) {
            setActiveSection(sec.id);
          }
        }
      });
      setScrolled(y > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setSidebarOpen(false);
    navigate("/login");
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: showTopBar ? 0 : -100, opacity: showTopBar ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 bg-white shadow px-6 py-3 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-emerald-700">
            AirBloom
          </NavLink>
          <div className="flex items-center">
            {currentUser ? (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-10 w-10 bg-emerald-600">
                      {currentUser.avatarUrl ? (
                        <AvatarImage src={currentUser.avatarUrl} alt="avatar" />
                      ) : (
                        <AvatarFallback className="text-white text-lg uppercase">
                          {currentUser.full_name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-50 sm:w-75 p-0 flex flex-col bg-white rounded-l-lg" // Narrower width, explicit white background
                >
                  <SheetHeader className="p-4 border-b border-emerald-100 flex flex-row items-center justify-between bg-emerald-50 rounded-2xl"> {/* Light green header background, emerald border */}
                    <SheetTitle className="text-xl font-semibold text-emerald-800"> {/* Darker green title */}
                      Profile
                    </SheetTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(false)}
                      className="text-emerald-600 hover:bg-emerald-100" // Green close icon, light green hover
                    >
                      <CloseIcon className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </SheetHeader>
                  <div className="p-4">
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      Hello, {currentUser.full_name}!
                    </p>
                  </div>
                  <nav className="flex-1 overflow-y-auto">
                    <ul className="py-2">
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-2 text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center h-auto" // Green hover
                          onClick={() => {
                            setSidebarOpen(false);
                            navigate("/user_info");
                          }}
                        >
                          <UserIcon className="w-5 h-5 mr-3 text-emerald-600" /> {/* Green icon */}
                          Personal Information
                        </Button>
                      </li>
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-2 text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center h-auto" // Green hover
                          onClick={() => {
                            setSidebarOpen(false);
                            navigate("/membership");
                          }}
                        >
                          <CreditCardIcon className="w-5 h-5 mr-3 text-emerald-600" /> {/* Green icon */}
                          Membership Plan
                        </Button>
                      </li>
                    </ul>
                  </nav>
                  <div className="border-t border-emerald-100 p-4"> {/* Light green border */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center h-auto"
                      onClick={handleLogout}
                    >
                      <LogOutIcon className="w-5 h-5 mr-3 text-red-500" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <NavLink to="/login">
                <button className="ml-4 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-100 transition">
                  Login
                </button>
              </NavLink>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 z-60 pointer-events-none w-[300px] mx-auto"
      >
        <div className="flex justify-center my-2 pointer-events-auto">
          <div
            className={`inline-flex px-6 py-2 transition-all duration-300 ${scrolled
              ? "bg-white/50 backdrop-blur-md shadow-md rounded-full"
              : ""
            }`}
          >
            <ul className="flex items-center space-x-6 overflow-x-auto whitespace-nowrap">
              {midSections.map((s) => (
                <li key={s.id} className="flex-shrink-0">
                  <button
                    onClick={() => {
                      if (location.pathname !== "/") {
                        navigate(`/#${s.id}`);
                      } else {
                        scrollTo(s.id);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg transition-colors duration-200 ${location.pathname === "/" && activeSection === s.id
                        ? "text-emerald-600 font-medium"
                        : "text-gray-800 hover:bg-emerald-100"
                      }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}

              <li className="flex-shrink-0">
                <ResourcDropdown />
              </li>
              <li className="flex-shrink-0">
                <QuitDropdown />
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HeaderNavbar;