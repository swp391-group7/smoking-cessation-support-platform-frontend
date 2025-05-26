
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header/>
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);
export default MainLayout;