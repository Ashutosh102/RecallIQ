
import { useState, useMemo } from 'react';
import AIInsights from '@/components/AIInsights';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import MemoryGrid from '@/components/dashboard/MemoryGrid';
import MobileMenu from '@/components/dashboard/MobileMenu';
import { useMemories } from '@/hooks/useMemories';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Use real memories from database
  const { memories, loading, deleteMemory } = useMemories();

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

  const clearFilters = () => {
    setSelectedFilter('all');
    setSelectedDateFilter('all');
    setCustomDateRange({});
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
      <DashboardHeader
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isProfilePopupOpen={isProfilePopupOpen}
        setIsProfilePopupOpen={setIsProfilePopupOpen}
      />

      {/* Mobile Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setIsProfilePopupOpen={setIsProfilePopupOpen}
        />
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
        <DashboardFilters
          memories={memories}
          filteredMemories={filteredMemories}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          isDatePickerOpen={isDatePickerOpen}
          setIsDatePickerOpen={setIsDatePickerOpen}
        />

        {/* Memory Grid */}
        <MemoryGrid
          memories={memories}
          filteredMemories={filteredMemories}
          onDeleteMemory={handleDeleteMemory}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
};

export default Dashboard;
