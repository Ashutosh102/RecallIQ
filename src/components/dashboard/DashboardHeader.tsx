
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, Menu, X, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProfilePopup from '@/components/ProfilePopup';
import { useCredits } from '@/hooks/useCredits';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isProfilePopupOpen: boolean;
  setIsProfilePopupOpen: (open: boolean) => void;
}

const DashboardHeader = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isProfilePopupOpen, 
  setIsProfilePopupOpen 
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile: creditProfile } = useCredits();
  const profileIconRef = useRef<HTMLButtonElement>(null);

  const handleAddMemory = () => {
    navigate('/add-memory');
  };

  const handleSearch = () => {
    navigate('/search');
  };

  const getInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <div className="bg-dark-bg/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-poppins font-bold gradient-text">RecallIQ</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                size="sm"
                onClick={handleSearch}
                className="bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-white/50"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                size="sm"
                onClick={handleAddMemory}
                className="bg-gradient-purple hover:opacity-90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Memory
              </Button>
              
              {/* Credits Display */}
              {creditProfile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => navigate('/upgrade')}
                        variant="outline"
                        size="sm"
                        className="bg-white/5 border border-purple-primary/30 text-white hover:bg-white/10"
                      >
                        <Coins className="h-4 w-4 mr-2 text-purple-primary" />
                        <span className="font-medium">{creditProfile.credits}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You have {creditProfile.credits} credits</p>
                      <p className="text-xs text-gray-400">Click to get more</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {/* Profile Button */}
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
        </div>
      </div>

      {/* Profile Popup */}
      <ProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
        anchorRef={profileIconRef}
      />
    </>
  );
};

export default DashboardHeader;
