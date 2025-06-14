
import { useState, useRef } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProfilePopup from '@/components/ProfilePopup';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const profileIconRef = useRef<HTMLButtonElement>(null);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const getInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button onClick={handleLogoClick} className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-poppins font-bold gradient-text">RecallIQ</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white transition-colors">Contact</button>
              
              {user ? (
                <button
                  ref={profileIconRef}
                  onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-lg border border-white/20"
                >
                  <Avatar className="h-8 w-8 border border-white/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-purple text-white text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm">Profile</span>
                </button>
              ) : (
                <Button 
                  className="bg-gradient-purple hover:opacity-90 text-white font-medium px-6"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                className="bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10 bg-dark-bg/95 backdrop-blur-lg">
              <div className="flex flex-col space-y-3">
                <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors py-2 text-left">Features</button>
                <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors py-2 text-left">Pricing</button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white transition-colors py-2 text-left">Contact</button>
                
                {user ? (
                  <>
                    <button 
                      onClick={() => {
                        setIsProfilePopupOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors py-2 text-left"
                    >
                      <Avatar className="h-6 w-6 border border-white/20">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-purple text-white text-xs">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span>Profile</span>
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="text-gray-300 hover:text-white transition-colors py-2 text-left">Dashboard</button>
                    <Button 
                      onClick={handleSignOut}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium w-full mt-4"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    className="bg-gradient-purple hover:opacity-90 text-white font-medium w-full mt-4"
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Profile Popup */}
      <ProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
        anchorRef={profileIconRef}
      />
    </>
  );
};

export default Navbar;
