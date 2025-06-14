
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, ChevronDown } from 'lucide-react';
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
  // Extract dynamic categories from memories
  const categories = useMemo(() => {
    const allTags = memories.flatMap(memory => memory.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }, [memories]);

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
  );
};

export default DashboardFilters;
