
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import MemoryCard from '@/components/MemoryCard';
import AIInsights from '@/components/AIInsights';
import ProfilePopup from '@/components/ProfilePopup';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const profileIconRef = useRef<HTMLButtonElement>(null);
  const [memories, setMemories] = useState([
    {
      id: '1',
      title: 'React Conference 2024',
      summary: 'Met John, a React developer from Hyderabad. He mentioned working on micro-frontends and shared insights about state management patterns.',
      people: ['John'],
      tags: ['tech', 'react', 'conference'],
      date: '2024-06-10'
    },
    {
      id: '2',
      title: 'Coffee Meeting with Sarah',
      summary: 'Had a great discussion about UX design principles. Sarah is working at a fintech startup and shared her experience with user research.',
      people: ['Sarah'],
      tags: ['UX', 'design', 'fintech'],
      date: '2024-06-08'
    },
    {
      id: '3',
      title: 'Tech Meetup - AI Discussion',
      summary: 'Interesting conversation about AI ethics with multiple attendees. Key points discussed: bias in algorithms, responsible AI development.',
      people: ['Mike', 'Lisa', 'David'],
      tags: ['AI', 'ethics', 'meetup'],
      date: '2024-06-05'
    }
  ]);

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter(memory => memory.id !== id));
  };

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

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
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

          {/* Mobile Navigation */}
          {isMenuOpen && (
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
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">
            Your Memory Dashboard
          </h1>
          <p className="text-gray-300">
            {memories.length} memories stored • Never forget important connections again
          </p>
        </div>

        {/* AI Insights Section */}
        <div className="mb-8">
          <AIInsights memories={memories} />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-8 overflow-x-auto">
          <Button
            size="sm"
            className="bg-white/10 border border-white/30 text-white hover:bg-white/20 whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            All Memories
          </Button>
          <Button
            size="sm"
            className="bg-transparent text-gray-400 hover:text-white hover:bg-white/10 whitespace-nowrap"
          >
            Recent
          </Button>
          <Button
            size="sm"
            className="bg-transparent text-gray-400 hover:text-white hover:bg-white/10 whitespace-nowrap"
          >
            People
          </Button>
          <Button
            size="sm"
            className="bg-transparent text-gray-400 hover:text-white hover:bg-white/10 whitespace-nowrap"
          >
            Tech
          </Button>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory, index) => (
            <div
              key={memory.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MemoryCard {...memory} onDelete={handleDeleteMemory} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {memories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No memories yet</h3>
            <p className="text-gray-300 mb-6">Start building your personal memory database</p>
            <Button 
              onClick={handleAddMemory}
              className="bg-gradient-purple hover:opacity-90 text-white"
            >
              Add Your First Memory
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile) */}
      <Button
        size="lg"
        onClick={handleAddMemory}
        className="fixed bottom-6 right-6 md:hidden bg-gradient-purple hover:opacity-90 text-white rounded-full w-14 h-14 shadow-2xl animate-glow"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Profile Popup */}
      <ProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
        anchorRef={profileIconRef}
      />
    </div>
  );
};

export default Dashboard;
