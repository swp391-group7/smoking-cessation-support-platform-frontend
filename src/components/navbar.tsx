import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
  const activeClass = "text-green-800";
  const baseClass = "text-green-600 font-medium hover:text-green-800";

  return (
    <nav className="bg-gray-100 p-4 shadow">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800">MyAppLogo</div>

        <ul className="flex space-x-8 flex-1 justify-center">
      <li>
        <NavLink to="/" end className={({ isActive }) =>
          isActive ? `${baseClass} ${activeClass}` : baseClass
        }>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={({ isActive }) =>
          isActive ? `${baseClass} ${activeClass}` : baseClass
        }>
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={({ isActive }) =>
          isActive ? `${baseClass} ${activeClass}` : baseClass
        }>
          Contact
        </NavLink>
      </li>
    </ul>

    <div className="flex space-x-4 ml-auto">
      {/* Option 1: Wrap Button in NavLink */}
      <NavLink to="/login">
        <Button variant="outline" className="hover:bg-green-100 hover:text-green-800">
          Đăng nhập
        </Button>
      </NavLink>

      <NavLink to="/register">
        <Button variant="outline" className="hover:bg-green-100 hover:text-green-800">
          Đăng kí
        </Button>
      </NavLink>
    </div>
  </div>
</nav>
  );
};

export default Navbar;