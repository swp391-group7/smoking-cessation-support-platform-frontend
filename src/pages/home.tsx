// src/components/Home.tsx
import React from 'react';
import HeroSection from '@/components/HeroSection';
import HarmsSection from '@/components/HarmsSection';
import BenefitsSection from '@/components/BenefitsSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import QuitGuideSection from '@/components/QuitGuideSection';
import ContactSection from '@/components/ContactSection';


const Home: React.FC = () => {
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
