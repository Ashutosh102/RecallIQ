
import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Menu, X, LogOut, Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import MemoryCard from '@/components/MemoryCard';
import AIInsights from '@/components/AIInsights';
import ProfilePopup from '@/components/ProfilePopup';
import { useMemories } from '@/hooks/useMemories';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const profileIconRef = useRef<HTMLButtonElement>(null);
  
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Use real memories from database
  const { memories, loading, deleteMemory } = useMemories();

  // Extract dynamic categories from memories
  const categories = useMemo(() => {
    const allTags = memories.flatMap(memory => memory.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }, [memories]);

  // Filter memories based on selected filters
  const filteredMemories = useMemo(() => {
    let filtered = [...memories];

    // Filter by category/tag
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(memory => new Date(memory.created_at) >= oneWeekAgo);
      } else if (selectedFilter === 'people') {
        filtered = filtered.filter(memory => memory.people && memory.people.length > 0);
      } else {
        // Filter by specific tag
        filtered = filtered.filter(memory => 
          memory.tags && memory.tags.includes(selectedFilter)
        );
      }
    }

    // Filter by date
    if (selectedDateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (selectedDateFilter) {
        case 'today':
          filtered = filtered.filter(memory => {
            const memoryDate = new Date(memory.date);
            const memoryDay = new Date(memoryDate.getFullYear(), memoryDate.getMonth(), memoryDate.getDate());
            return memoryDay.getTime() === today.getTime();
          });
          break;
        case 'week':
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filtered = filtered.filter(memory => {
            const memoryDate = new Date(memory.date);
            return memoryDate >= oneWeekAgo && memoryDate <= now;
          });
          break;
        case 'month':
          const oneMonthAgo = new Date(today);
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          filtered = filtered.filter(memory => {
            const memoryDate = new Date(memory.date);
            return memoryDate >= oneMonthAgo && memoryDate <= now;
          });
          break;
        case 'custom':
          if (customDateRange.from || customDateRange.to) {
            filtered = filtered.filter(memory => {
              const memoryDate = new Date(memory.date);
              const from = customDateRange.from ? new Date(customDateRange.from.getFullYear(), customDateRange.from.getMonth(), customDateRange.from.getDate()) : new Date(0);
              const to = customDateRange.to ? new Date(customDateRange.to.getFullYear(), customDateRange.to.getMonth(), customDateRange.to.getDate(), 23, 59, 59) : new Date();
              return memoryDate >= from && memoryDate <= to;
            });
          }
          break;
      }
    }

    return filtered;
  }, [memories, selectedFilter, selectedDateFilter, customDateRange]);

  const handleDeleteMemory = (id: string) => {
    deleteMemory(id);
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

  const handleDateRangeSelect = (range: { from?: Date; to?: Date }) => {
    setCustomDateRange(range);
    if (range.from || range.to) {
      setSelectedDateFilter('custom');
    }
  };

  const clearFilters = () => {
    setSelectedFilter('all');
    setSelectedDateFilter('all');
    setCustomDateRange({});
  };

  const getDateFilterLabel = () => {
    switch (selectedDateFilter) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'custom':
        if (customDateRange.from && customDateRange.to) {
          return `${format(customDateRange.from, 'MMM d')} - ${format(customDateRange.to, 'MMM d')}`;
        } else if (customDateRange.from) {
          return `From ${format(customDateRange.from, 'MMM d')}`;
        } else if (customDateRange.to) {
          return `Until ${format(customDateRange.to, 'MMM d')}`;
        }
        return 'Custom Range';
      default: return 'All Time';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your memories...</p>
        </div>
      </div>
    );
  }

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
            {filteredMemories.length} of {memories.length} memories {selectedFilter !== 'all' || selectedDateFilter !== 'all' ? 'filtered' : 'stored'} • Never forget important connections again
          </p>
        </div>

        {/* AI Insights Section */}
        <div className="mb-8">
          <AIInsights memories={filteredMemories} />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Filter by:</span>
              {(selectedFilter !== 'all' || selectedDateFilter !== 'all') && (
                <Button
                  size="sm"
                  onClick={clearFilters}
                  className="bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs px-2 py-1 h-6"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
            <Button
              size="sm"
              onClick={() => setSelectedFilter('all')}
              className={`whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-white/20 border border-white/40 text-white'
                  : 'bg-white/10 border border-white/30 text-gray-400 hover:text-white hover:bg-white/20'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              All Memories
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedFilter('recent')}
              className={`whitespace-nowrap ${
                selectedFilter === 'recent'
                  ? 'bg-white/20 border border-white/40 text-white'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Recent
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedFilter('people')}
              className={`whitespace-nowrap ${
                selectedFilter === 'people'
                  ? 'bg-white/20 border border-white/40 text-white'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              People
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                onClick={() => setSelectedFilter(category)}
                className={`whitespace-nowrap ${
                  selectedFilter === category
                    ? 'bg-purple-primary/30 border border-purple-primary/50 text-purple-300'
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                #{category}
              </Button>
            ))}
          </div>

          {/* Date Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  className={`whitespace-nowrap ${
                    selectedDateFilter !== 'all'
                      ? 'bg-blue-primary/30 border border-blue-primary/50 text-blue-300'
                      : 'bg-white/10 border border-white/30 text-gray-400 hover:text-white hover:bg-white/20'
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {getDateFilterLabel()}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b border-gray-200">
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Time' },
                      { value: 'today', label: 'Today' },
                      { value: 'week', label: 'This Week' },
                      { value: 'month', label: 'This Month' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedDateFilter(option.value as any);
                          if (option.value !== 'custom') {
                            setCustomDateRange({});
                          }
                          setIsDatePickerOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                          selectedDateFilter === option.value
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    <div className="border-t pt-2">
                      <p className="text-xs text-gray-500 mb-2">Custom Range:</p>
                      <CalendarComponent
                        mode="range"
                        selected={{ from: customDateRange.from, to: customDateRange.to }}
                        onSelect={handleDateRangeSelect}
                        className="pointer-events-auto"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((memory, index) => (
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
        {filteredMemories.length === 0 && memories.length > 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No memories match your filters</h3>
            <p className="text-gray-300 mb-6">Try adjusting your filters to see more memories</p>
            <Button 
              onClick={clearFilters}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Empty State - No memories at all */}
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
