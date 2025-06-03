import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  User as UserIcon,
  Settings as SettingsIcon,
  CreditCard as CreditCardIcon,
  LogOut as LogOutIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface User {
  id: string;
  full_name: string;
  avatarUrl: string;
}

const midSections = [

  { id: "hero", label: "Home" },
  { id: "harms", label: "harmful" },
  { id: "benefits", label: "Benefit" },
  { id: "why", label: "Why AirBloom" },
  { id: "guide", label: "Route" },
  { id: "contact", label: "Contact" },
];

export const HeaderNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState(midSections[0].id);
  const [showTopBar, setShowTopBar] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setShowTopBar(y < lastScroll.current || y < 10);
      lastScroll.current = y;
      // Scroll-spy logic
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setDropdownVisible(false);
    navigate("/login");
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Top bar with motion */}
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownVisible((v) => !v)}
                  className="focus:outline-none"
                >
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
                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Tên:</span> {currentUser.full_name}
                      </p>
                      <p className="text-gray-700 text-sm mt-1">
                        <span className="font-medium">ID:</span> {currentUser.id}
                      </p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => {
                            setDropdownVisible(false);
                            navigate("/profile");
                          }}
                          className="w-full flex items-center px-3 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                        >
                          <UserIcon className="w-4 h-4 mr-2 text-gray-600" />
                          Thông tin cá nhân
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setDropdownVisible(false);
                            navigate("/membership");
                          }}
                          className="w-full flex items-center px-3 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                        >
                          <CreditCardIcon className="w-4 h-4 mr-2 text-gray-600" />
                          Gói thành viên
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setDropdownVisible(false);
                            navigate("/settings");
                          }}
                          className="w-full flex items-center px-3 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                        >
                          <SettingsIcon className="w-4 h-4 mr-2 text-gray-600" />
                          Cài đặt
                        </button>
                      </li>
                      <li>
                        <hr className="my-1 border-gray-200" />
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2 hover:bg-gray-50 text-red-600 text-sm"
                        >
                          <LogOutIcon className="w-4 h-4 mr-2 text-red-500" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
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

      {/* Mid navbar: pointer-events managed */}
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
                <NavLink
                  to="/quit"
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "px-3 py-1 rounded-lg text-emerald-600 font-medium"
                      : "px-3 py-1 rounded-lg text-gray-800 hover:bg-emerald-100"
                  }
                >
                  Quit
                </NavLink>

              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HeaderNavbar;
