
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import MemoryCard from '@/components/MemoryCard';
import { Memory } from '@/hooks/useMemories';

interface MemoryGridProps {
  memories: Memory[];
  filteredMemories: Memory[];
  onDeleteMemory: (id: string) => void;
  onClearFilters: () => void;
}

const MemoryGrid = ({ 
  memories, 
  filteredMemories, 
  onDeleteMemory, 
  onClearFilters 
}: MemoryGridProps) => {
  const navigate = useNavigate();

  const handleAddMemory = () => {
    navigate('/add-memory');
  };

  return (
    <>
      {/* Memory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((memory, index) => (
          <div
            key={memory.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <MemoryCard {...memory} onDelete={onDeleteMemory} />
          </div>
        ))}
      </div>

      {/* Empty State - Filtered */}
      {filteredMemories.length === 0 && memories.length > 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No memories match your filters</h3>
          <p className="text-gray-300 mb-6">Try adjusting your filters to see more memories</p>
          <Button 
            onClick={onClearFilters}
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

      {/* Floating Action Button (Mobile) */}
      <Button
        size="lg"
        onClick={handleAddMemory}
        className="fixed bottom-6 right-6 md:hidden bg-gradient-purple hover:opacity-90 text-white rounded-full w-14 h-14 shadow-2xl animate-glow"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </>
  );
};

export default MemoryGrid;
