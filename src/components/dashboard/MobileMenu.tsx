
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setIsProfilePopupOpen: (open: boolean) => void;
}

const MobileMenu = ({ isMenuOpen, setIsMenuOpen, setIsProfilePopupOpen }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleAddMemory = () => {
    navigate('/add-memory');
  };

  const handleSearch = () => {
    navigate('/search');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden mt-4 py-4 border-t border-white/10 bg-dark-bg/95 backdrop-blur-lg rounded-lg">
      <div className="flex flex-col space-y-3">
        <Button
          size="sm"
          onClick={() => {
            handleSearch();
            setIsMenuOpen(false);
          }}
          className="bg-white/10 border border-white/30 text-white hover:bg-white/20 justify-start"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Memories
        </Button>
        <Button
          size="sm"
          onClick={() => {
            handleAddMemory();
            setIsMenuOpen(false);
          }}
          className="bg-gradient-purple hover:opacity-90 text-white justify-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Memory
        </Button>
        
        {/* Mobile Profile Button */}
        <button 
          onClick={() => {
            setIsProfilePopupOpen(true);
            setIsMenuOpen(false);
          }}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors py-2 text-left bg-white/10 hover:bg-white/20 rounded-lg px-3"
        >
          <Avatar className="h-6 w-6 border border-white/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-purple text-white text-xs">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <span>Profile Settings</span>
        </button>
        
        <Button 
          onClick={() => {
            handleSignOut();
            setIsMenuOpen(false);
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-medium justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;
