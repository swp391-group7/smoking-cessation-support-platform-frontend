// src/components/Home.tsx
import React, { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import HarmsSection from '@/components/HarmsSection';
import BenefitsSection from '@/components/BenefitsSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import QuitGuideSection from '@/components/QuitGuideSection';
import ContactSection from '@/components/ContactSection';
import { useLocation } from 'react-router-dom';


const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Nếu URL có hash (ví dụ: "#hero"), loại bỏ dấu '#' rồi scroll
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // Chờ thêm 200ms nếu cần cho animation hoặc để DOM hoàn chỉnh
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash]); // chạy mỗi khi hash thay đổi

  return (
    <> 
      <HeroSection />
      <HarmsSection />
      <BenefitsSection />
      <WhyChooseSection />
      <QuitGuideSection />
      <ContactSection />
    </>
  );
};

export default Home;
