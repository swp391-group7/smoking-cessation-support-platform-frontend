// src/components/ui/navbar.tsx
import React from "react";
import { Button } from "@/components/ui/button"
export const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-100 p-4 shadow">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo bên trái */}
        <div className="text-xl font-bold text-gray-800">
          MyAppLogo
        </div>

        {/* Menu chính ở giữa */}
        <ul className="flex space-x-8 flex-1  justify-center">
          <li className="text-green-600 font-medium hover:text-green-800 cursor-pointer">
            Home
          </li>
          <li className="text-green-600 font-medium hover:text-green-800 cursor-pointer">
            About
          </li>
          <li className="text-green-600 font-medium hover:text-green-800 cursor-pointer">
            Contact
          </li>
        </ul>

        {/* Nút Đăng ký / Đăng nhập bên phải */}
        <div className="flex space-x-4 ml-auto">
          <Button
            variant="outline"
            className="hover:bg-green-100 hover:text-green-800"
          >
            đăng nhập
          </Button>
          <Button
            variant="outline"
            className="hover:bg-green-100 hover:text-green-800"
          >
            đăng kí
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
