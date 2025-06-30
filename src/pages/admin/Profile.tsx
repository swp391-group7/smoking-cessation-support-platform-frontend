// src/pages/admin/Profile.tsx
import { useState, useEffect } from "react";
import { getCurrentUser, updateUser } from "@/api/userApi";
import type { UserInfo, FrontendUpdateRequestBody } from "@/api/userApi";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

type EditingField = "fullName" | "phoneNumber" | "dob" | "email" | null;

export default function UserProfile() {
  const [formData, setFormData] = useState<UserInfo>({
    id: "",
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
    getCurrentUser()
      .then((user) => {
        setFormData({ ...user, password: "" });
        setAvatarPreview(user.avatarPath);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        toast.error("Unable to load user information.");
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Chuẩn bị payload cho backend (loại trừ ID và có thể là mật khẩu)
      const { id, password, ...dataToUpdate } = formData; // Trích xuất id và password
      const payload: FrontendUpdateRequestBody = dataToUpdate;
      if (!id) {
        toast.error("No user ID found to update.");
        return;
      }
      // Gọi updateUser với ID là đối số đầu tiên và payload là đối số thứ hai
      await updateUser(id, payload);
      toast.success("🎉 Update successful!");
      setEditing(null);
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "❌ Update failed. Please try again.");
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

  const renderField = (field: EditingField, label: string, type = "text") => (
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
      <Card className="p-6 md:p-8 shadow-lg border-green-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-800">Personal Information</h1>
        <div className="flex flex-col items-center mb-6">

          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-700 shadow-md mb-4">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-green-700 text-5xl font-bold uppercase">
                  {formData.fullName ? formData.fullName.charAt(0) : "?"}
                </div>
              )}
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
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
          </motion.div>

          <span className="text-xl font-semibold text-gray-700">{formData.fullName || "User name"}</span>

        </div>

        <div className="space-y-4">
          {renderField("fullName", "Full name")}
          <hr className="border-gray-200" />
          {renderField("email", "Email", "email")}
          <hr className="border-gray-200" />
          {renderField("phoneNumber", "Phone", "tel")}
          <hr className="border-gray-200" />
          {renderField("dob", "D.O.B", "date")}
          {/* Password is not directly editable here for security; usually done via a separate "Change Password" flow */}
        </div>

        <div className="flex justify-center mt-8">
          <Button onClick={() => alert("Chức năng thay đổi mật khẩu chưa được tích hợp.")} className="w-full md:w-auto">
            Change password
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}