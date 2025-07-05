
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Suspense, lazy } from 'react';

// Lazy load the globe to improve initial page load
const InteractiveGlobe = lazy(() => import('./InteractiveGlobe'));

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
    // Scroll to features section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-dark"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-accent/20 rounded-full blur-3xl"></div>
      
      {/* Interactive 3D Globe */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-1/2 opacity-30 lg:opacity-40">
        <Suspense fallback={
          <div className="w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <InteractiveGlobe />
        </Suspense>
      </div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-poppins font-bold mb-6 leading-tight">
            Your{' '}
            <span className="gradient-text">AI-Powered</span>
            <br />
            Memory Assistant
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Never forget important people, conversations, or moments again. RecallIQ uses advanced AI to help you remember and search through your personal interactions with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-purple hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-xl glow-effect animate-glow"
              onClick={handleGetStarted}
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </Button>
            <Button 
              size="lg" 
              onClick={handleWatchDemo}
              className="bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 font-semibold px-8 py-4 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>
          
          <div className="flex justify-center">
            <button onClick={handleScrollDown} className="cursor-pointer">
              <ArrowDown className="h-6 w-6 text-gray-400 animate-bounce hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
