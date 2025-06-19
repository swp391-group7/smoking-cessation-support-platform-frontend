import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface UserInfo {
  email: string;
  fullName: string;
  phoneNumber: string;
  dob: string;
  avtarPath: string;
  password: string;
}

export default function user_info() {
  const [formData, setFormData] = useState<UserInfo>({
    email: "",
    fullName: "",
    phoneNumber: "",
    dob: "",
    avtarPath: "",
    password: ""
  });

  useEffect(() => {
    axios.get<UserInfo>("/users/display-current-user").then((res) => {
      setFormData({ ...res.data, password: "" }); // không hiện password
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put("/users/update-peronal-info", formData);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại.");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-xl p-8 space-y-4"
    >
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin cá nhân</h2>

      <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
      <Input label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} />
      <Input label="Số điện thoại" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
      <Input label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} />
      <Input label="Ảnh đại diện (URL)" name="avtarPath" value={formData.avtarPath} onChange={handleChange} />
      <Input label="Mật khẩu (nếu muốn đổi)" name="password" type="password" value={formData.password} onChange={handleChange} />

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded w-full"
      >
        Cập nhật
      </button>
    </motion.form>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
};

