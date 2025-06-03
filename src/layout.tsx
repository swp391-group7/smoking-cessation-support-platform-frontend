
import { Outlet } from "react-router-dom";

import { Footer } from "./components/footer";
import HeaderNavbar from "./components/HeaderNavbar";

export const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <HeaderNavbar/>
    
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);
export default MainLayout;