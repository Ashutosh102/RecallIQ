
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Zap, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleWatchDemo = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-dark"></div>
      
      {/* Animated gradient orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.2, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 right-20 hidden lg:block"
        animate={{
          y: [-10, 10, -10]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-8 h-8 text-purple-primary/30" />
      </motion.div>
      
      <motion.div
        className="absolute top-40 left-20 hidden lg:block"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Zap className="w-6 h-6 text-teal-accent/40" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 left-1/3 hidden lg:block"
        animate={{
          y: [-10, 10, -10]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Brain className="w-10 h-10 text-purple-primary/25" />
      </motion.div>
      
      {/* Hero Image with enhanced animation */}
      <motion.div 
        className="absolute right-10 top-1/4 hidden lg:block"
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 0.2, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <motion.img 
          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="AI Memory Assistant" 
          className="w-96 h-96 object-cover rounded-2xl"
          whileHover={{ scale: 1.05, opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-poppins font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            Your{' '}
            <motion.span 
              className="gradient-text inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              AI-Powered
            </motion.span>
            <br />
            Memory Assistant
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Never forget important people, conversations, or moments again. RecallIQ uses advanced AI to help you remember and search through your personal interactions with ease.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-purple hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-xl glow-effect animate-glow"
                onClick={handleGetStarted}
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                onClick={handleWatchDemo}
                className="bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 font-semibold px-8 py-4 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <motion.button 
              onClick={handleScrollDown} 
              className="cursor-pointer"
              animate={{
                y: [0, 10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.2 }}
            >
              <ArrowDown className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
