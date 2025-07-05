
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import ContactSection from '@/components/ContactSection';
import InteractiveGlobe from '@/components/InteractiveGlobe';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      <Hero />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Features />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <PricingSection />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <ContactSection />
      </motion.div>
      
      {/* Interactive Globe Section */}
      <motion.section 
        className="py-20 bg-gradient-to-b from-transparent to-dark-secondary"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-poppins font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Connected Memories
          </motion.h2>
          <motion.p 
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Experience the power of interconnected memories with our AI-driven visualization
          </motion.p>
        </div>
        <InteractiveGlobe />
      </motion.section>
      
      <Footer />
    </div>
  );
};

export default Index;
