import { toast } from "sonner";

export function logoutAndRedirect(navigate: (path: string) => void) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  toast.success("Đăng xuất thành công!");
  navigate("/login");
}