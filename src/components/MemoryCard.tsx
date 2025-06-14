
import { Button } from '@/components/ui/button';
import { User, Calendar, Trash2 } from 'lucide-react';

interface MemoryCardProps {
  id: string;
  title: string;
  summary: string;
  people?: string[];
  tags?: string[];
  date: string;
  onDelete?: (id: string) => void;
}

const MemoryCard = ({ id, title, summary, people = [], tags = [], date, onDelete }: MemoryCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:gradient-text transition-colors">
          {title}
        </h3>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed">
        {summary}
      </p>
      
      {people && people.length > 0 && (
        <div className="flex items-center mb-3">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-400">
            {people.join(', ')}
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tags && tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-primary/20 text-purple-300 text-xs rounded-full border border-purple-primary/30"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(date)}
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
