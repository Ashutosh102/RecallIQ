
import { useMemo, useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Memory } from '@/hooks/useMemories';

interface DashboardFiltersProps {
  memories: Memory[];
  filteredMemories: Memory[];
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  selectedDateFilter: 'all' | 'today' | 'week' | 'month' | 'custom';
  setSelectedDateFilter: (filter: 'all' | 'today' | 'week' | 'month' | 'custom') => void;
  customDateRange: { from?: Date; to?: Date };
  setCustomDateRange: (range: { from?: Date; to?: Date }) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
}

const DashboardFilters = ({
  memories,
  filteredMemories,
  selectedFilter,
  setSelectedFilter,
  selectedDateFilter,
  setSelectedDateFilter,
  customDateRange,
  setCustomDateRange,
  isDatePickerOpen,
  setIsDatePickerOpen
}: DashboardFiltersProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Extract dynamic categories from memories
  const categories = useMemo(() => {
    const allTags = memories.flatMap(memory => memory.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }, [memories]);

  // Check scroll state
  const checkScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      setScrollPosition(scrollWidth > clientWidth ? scrollLeft / (scrollWidth - clientWidth) : 0);
    }
  };

  useEffect(() => {
    checkScrollState();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollState);
      return () => container.removeEventListener('scroll', checkScrollState);
    }
  }, [categories]);

  useEffect(() => {
    checkScrollState();
  }, [categories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSelectedFilter('all');
    setSelectedDateFilter('all');
    setCustomDateRange({});
  };

  const handleDateRangeSelect = (range: { from?: Date; to?: Date }) => {
    setCustomDateRange(range);
    if (range.from || range.to) {
      setSelectedDateFilter('custom');
    }
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

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
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

        {/* Category Filters with Navigation */}
        <div className="relative mb-4">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Scrollable Filter Container */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-2 px-12 md:px-12"
          >
            <Button
              size="sm"
              onClick={() => setSelectedFilter('all')}
              className={`whitespace-nowrap flex-shrink-0 ${
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
              className={`whitespace-nowrap flex-shrink-0 ${
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
              className={`whitespace-nowrap flex-shrink-0 ${
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
                className={`whitespace-nowrap flex-shrink-0 ${
                  selectedFilter === category
                    ? 'bg-purple-primary/30 border border-purple-primary/50 text-purple-300'
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                #{category}
              </Button>
            ))}
          </div>

          {/* Position Marker */}
          {canScrollLeft || canScrollRight ? (
            <div className="flex justify-center mt-3">
              <div className="relative w-16 h-1">
                <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                <div 
                  className="absolute h-full bg-white rounded-full transition-all duration-300 ease-out"
                  style={{ 
                    width: '25%',
                    left: `${scrollPosition * 75}%`
                  }}
                ></div>
              </div>
            </div>
          ) : null}
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
    </>
  );
};

export default DashboardFilters;
