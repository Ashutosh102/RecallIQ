import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import MemoryCard from '@/components/MemoryCard';
import AIInsights from '@/components/AIInsights';

const Dashboard = () => {
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

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <div className="bg-dark-bg/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-poppins font-bold gradient-text">RecallIQ</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                className="bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-white/50"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                size="sm"
                className="bg-gradient-purple hover:opacity-90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Memory
              </Button>
            </div>
          </div>
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
        <div className="flex items-center space-x-4 mb-8">
          <Button
            size="sm"
            className="bg-white/10 border border-white/30 text-white hover:bg-white/20"
          >
            <Filter className="h-4 w-4 mr-2" />
            All Memories
          </Button>
          <Button
            size="sm"
            className="bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
          >
            Recent
          </Button>
          <Button
            size="sm"
            className="bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
          >
            People
          </Button>
          <Button
            size="sm"
            className="bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
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
            <Button className="bg-gradient-purple hover:opacity-90 text-white">
              Add Your First Memory
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile) */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 md:hidden bg-gradient-purple hover:opacity-90 text-white rounded-full w-14 h-14 shadow-2xl animate-glow"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
