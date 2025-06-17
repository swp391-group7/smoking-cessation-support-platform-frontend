// src/components/QuitDropdown.tsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // adjust path nếu cần
import { ChevronDown } from "lucide-react";

export const ResourcDropdown: React.FC = () => {
  // open = true khi menu đang mở; false khi đóng
  const [open, setOpen] = useState(false);

  return (
    // Bắt state open/onOpenChange để điều khiển menu theo state
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* TRIGGER: dùng button chứ không phải NavLink, 
          để khi hover không tự navigate */}
      <DropdownMenuTrigger asChild>
        <button
          // Khi hover vào button sẽ setOpen(true)
          onMouseEnter={() => setOpen(true)}
          // Khi chuột rời khỏi button, tạm thời setOpen(false) 
          // Nhưng nếu người dùng di chuột xuống menu content thì 
          // sẽ bị đóng quá sớm. Chúng ta sẽ bổ sung onMouseEnter/onMouseLeave cho Content.
          onMouseLeave={() => setOpen(false)}
          className="flex items-center px-3 py-1 rounded-2xl text-gray-800 hover:bg-emerald-100"
        >
          Resource 
          {/* Icon xoay ngược khi open === true */}
          <ChevronDown
            className={`ml-1 h-4 w-4 transform transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </DropdownMenuTrigger>

      {/* 
        CONTENT: menu xổ xuống. 
        Cần gắn onMouseEnter/onMouseLeave để khi hover vào content 
        menu vẫn giữ open = true cho đến khi rời khỏi content.
      */}
      <DropdownMenuContent
        // Khi di chuột vào phần content thì giữ open = true
        onMouseEnter={() => setOpen(true)}
        // Khi chuột rời khỏi content, đóng menu
        onMouseLeave={() => setOpen(false)}
        align="start"
        className="mt-1 w-40 bg-white rounded-lg shadow-md"
      >
        <DropdownMenuItem asChild>
          <NavLink
            to="/blog"
            className="block w-full px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
          >
            Blog 
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavLink
            to="/quit_survey"
            className="block w-full px-2 py-1 text-sm text-gray-700 hover:bg-emerald-100"
          >
            Guides 
          </NavLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
