import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";

const mockUsers = [
  {
    name: "Nguyen Van A",
    email: "a@example.com",
    addictionLevel: "Nặng",
    plan: "Cai ngay",
    badges: ["7 ngày", "14 ngày"],
    coach: "Coach Huy",
    status: "Đang hoạt động",
  },
  {
    name: "Tran Thi B",
    email: "b@example.com",
    addictionLevel: "Vừa",
    plan: "Cai từ từ",
    badges: ["7 ngày"],
    coach: null,
    status: "Chưa gán coach",
  },
];

const levels = ["Nhẹ", "Vừa", "Nặng"];
const plans = ["Cai từ từ", "Cai ngay"];
