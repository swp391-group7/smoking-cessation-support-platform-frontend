import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";

interface UserInfo {
  email: string;
  fullName: string;
  phoneNumber: string;
  dob: string;
  avatarPath: string;
  password: string;
}

type EditingField = "fullName" | "phoneNumber" | "dob" | "email" | null;

export default function UserProfile() {
  const [formData, setFormData] = useState<UserInfo>({
    email: "",
    fullName: "",
    phoneNumber: "",
    dob: "",
    avatarPath: "",
    password: ""
  });

  const [editing, setEditing] = useState<EditingField>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);


  useEffect(() => {
    axios.get<UserInfo>("/users/display-current-user").then((res) => {
      setFormData({ ...res.data, password: "" });
      setAvatarPreview(res.data.avatarPath);
    }).catch(error => {
      console.error("Error fetching user data:", error);
      alert("Failed to load user data.");
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put("/users/update-peronal-info", formData);
      alert("Cập nhật thành công!");
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại.");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        alert("Chức năng cập nhật ảnh đại diện chưa được tích hợp đầy đủ. Vui lòng triển khai API upload ảnh.");
      };
      reader.readAsDataURL(file);
    }
  };

const renderField = (field: EditingField, label: string, type: string = "text") => (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {editing === field ? (
          <Input
            type={type}
            name={field!}
            value={formData[field as keyof UserInfo]}
            onChange={handleChange}
            className="mt-1"
          />
        ) : (
          <span className="text-lg font-semibold">{formData[field as keyof UserInfo] || "Chưa cập nhật"}</span>
        )}
      </div>
      {editing !== field ? (
        <Button variant="ghost" size="icon" onClick={() => setEditing(field)}>
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={handleSave} className="ml-2">Lưu</Button>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8 max-w-2xl"
    >
      <Card className="p-6 md:p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Thông tin cá nhân</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-md mb-4">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-6xl">
                👤
              </div>
            )}
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
              <Pencil className="h-4 w-4 text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <span className="text-xl font-semibold text-gray-700">{formData.fullName || "Tên người dùng"}</span>
          <span className="text-md text-gray-500">{formData.email}</span>
        </div>

        <div className="space-y-4">
          {renderField("fullName", "Họ và tên")}
          <hr className="border-gray-200" />
          {renderField("email", "Email", "email")}
          <hr className="border-gray-200" />
          {renderField("phoneNumber", "Số điện thoại", "tel")}
          <hr className="border-gray-200" />
          {renderField("dob", "Ngày sinh", "date")}
          {/* Password is not directly editable here for security; usually done via a separate "Change Password" flow */}
        </div>

        <div className="flex justify-center mt-8">
          <Button onClick={() => alert("Chức năng thay đổi mật khẩu chưa được tích hợp.")} className="w-full md:w-auto">
            Thay đổi mật khẩu
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}