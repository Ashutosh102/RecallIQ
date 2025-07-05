import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
      
      {/* Hero Image */}
      <div className="absolute right-10 top-1/4 hidden lg:block opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="AI Memory Assistant" 
          className="w-96 h-96 object-cover rounded-2xl"
        />
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
