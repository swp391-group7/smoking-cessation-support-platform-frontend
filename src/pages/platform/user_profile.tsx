// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import axios from "axios";

// export default function UserProfile() {
//   const [user, setUser] = useState<UserProfileData | null>(null);

//   useEffect(() => {
//     axios.get<UserProfileData>("/api/user/profile").then(res => {
//       setUser(res.data);
//     });
//   }, []);

//   if (!user) return <p className="text-center mt-10">Đang tải thông tin...</p>;

//   return (
//     <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-8">
//       {/* Header */}
//       <motion.div 
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex items-center gap-4 mb-6"
//       >
//         <img 
//           src={user.avatarUrl} 
//           alt="Avatar" 
//           className="w-20 h-20 rounded-full object-cover border-2 border-indigo-400"
//         />
//         <div>
//           <h2 className="text-xl font-bold">{user.displayName}</h2>
//           <p className="text-sm text-gray-500">{user.username}</p>
//         </div>
//         <Button className="ml-auto">Chỉnh Sửa Hồ Sơ Người Dùng</Button>
//       </motion.div>

//       {/* Info */}
//       <div className="space-y-4">
//         <UserInfoRow label="Tên Hiển Thị" value={user.displayName} />
//         <UserInfoRow label="Tên Đăng Nhập" value={user.username} />
//         <UserInfoRow label="Email" value={maskEmail(user.email)} />
//         <UserInfoRow label="Số Điện Thoại" value={maskPhone(user.phone)} />
//       </div>

//       <div className="mt-10 border-t pt-6">
//         <h3 className="text-lg font-semibold mb-4">Mật Khẩu và Xác Thực</h3>
//         <Button>Đổi Mật Khẩu</Button>
//       </div>

//       <div className="mt-10 border-t pt-6">
//         <h3 className="text-lg font-semibold mb-2">Ngưng Sử Dụng Tài Khoản</h3>
//         <p className="text-sm text-gray-500 mb-4">
//           Nếu khóa tài khoản, bạn có thể khôi phục lại tài khoản của mình bất cứ lúc nào.
//         </p>
//         <div className="flex gap-4">
//           <Button variant="destructive">Vô Hiệu Hóa Tài Khoản</Button>
//           <Button disabled className="bg-gray-200 text-gray-500">Xóa Tài Khoản</Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function UserInfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="flex items-center justify-between border-b pb-2"
//     >
//       <div>
//         <p className="text-sm text-gray-500">{label}</p>
//         <p className="font-medium">{value}</p>
//       </div>
//       <Button variant="outline">Chỉnh sửa</Button>
//     </motion.div>
//   );
// }

// function maskEmail(email: string) {
//   const [name, domain] = email.split("@");
//   return name[0] + "*".repeat(name.length - 1) + "@" + domain;
// }

// function maskPhone(phone: string) {
//   return phone.slice(0, 2) + "*".repeat(phone.length - 5) + phone.slice(-3);
// }