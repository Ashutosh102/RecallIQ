
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      <Hero />
      <Features />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
