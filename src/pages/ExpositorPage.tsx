import React from "react";
import Navbar from "@/components/layout/Navbar";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/layout/Footer";
import HeroExpositor from "@/components/sections/HeroExpositor";
import BeneficiosExpositor from "@/components/sections/BeneficiosExpositor";
import MarketDataSection from "@/components/sections/MarketDataSection";
import MapaEventoSection from "@/components/sections/MapaEventoSection";
import TiposEstandesSection from "@/components/sections/TiposEstandesSection";
import SegmentosEventoSection from "@/components/sections/SegmentosEventoSection";
import ContatoExpositorSection from "@/components/sections/ContatoExpositorSection";

const ExpositorPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <HeroExpositor />
        <BeneficiosExpositor />
        <MarketDataSection />
        <MapaEventoSection />
        <TiposEstandesSection />
        <SegmentosEventoSection />
        <ContatoExpositorSection />
      </main>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ExpositorPage;