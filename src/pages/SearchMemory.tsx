
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, Brain, Lightbulb } from 'lucide-react';
import MemoryCard from '@/components/MemoryCard';
import { aiService, AISearchResponse } from '@/lib/ai';
import { useMemories } from '@/hooks/useMemories';

const SearchMemory = () => {
  const navigate = useNavigate();
  const { memories } = useMemories();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<AISearchResponse | null>(null);
  const [searchResults, setSearchResults] = useState(memories);

  const exampleQueries = [
    "Who was the React guy from Hyderabad?",
    "Tell me about the UX designer I met last week",
    "Find conversations about AI ethics",
    "Show me all tech meetup memories"
  ];

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setQuery(searchQuery);
    
    try {
      // If AI service is available, use it for enhanced search
      try {
        const aiSearchResult = await aiService.searchMemories(searchQuery, memories);
        setAiResponse(aiSearchResult);
        
        // Filter results based on AI interpretation
        const filteredResults = memories.filter(memory => 
          aiSearchResult.relevantMemories.includes(memory.id)
        );
        setSearchResults(filteredResults);
      } catch (aiError) {
        console.log('AI search not available, falling back to basic search');
        // Fallback to basic text search
        const basicResults = memories.filter(memory => 
          memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          memory.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          memory.people?.some(person => person.toLowerCase().includes(searchQuery.toLowerCase())) ||
          memory.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setSearchResults(basicResults);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <div className="bg-dark-bg/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-poppins font-bold gradient-text">RecallIQ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">
            AI Memory Search
          </h1>
          <p className="text-gray-300">
            Ask natural questions about your memories and get instant AI-powered results
          </p>
        </div>

        {/* Search Input */}
        <div className="glass-card p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Who was the React developer from the conference?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              className="pl-12 pr-24 py-4 bg-white/5 border-white/10 text-white placeholder-gray-400 text-lg focus:border-purple-primary/50 focus:ring-purple-primary/20"
            />
            <Button
              onClick={() => handleSearch(query)}
              disabled={!query.trim() || isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-purple hover:opacity-90 text-white px-4"
            >
              {isSearching ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>

        {/* AI Search Interpretation */}
        {aiResponse && !isSearching && (
          <div className="glass-card p-6 mb-6 border border-purple-primary/30">
            <div className="flex items-center mb-3">
              <Brain className="h-5 w-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">AI Search Interpretation</h3>
            </div>
            <p className="text-gray-300 mb-4">{aiResponse.interpretation}</p>
            
            {aiResponse.suggestedQueries.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Suggested follow-up searches:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiResponse.suggestedQueries.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="px-3 py-1 bg-purple-primary/20 text-purple-300 text-xs rounded-full border border-purple-primary/30 hover:bg-purple-primary/30 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example Queries */}
        {!query && !isSearching && memories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Try these example searches:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(example)}
                  className="glass-card p-4 text-left hover:bg-white/10 transition-colors group"
                >
                  <p className="text-gray-300 group-hover:text-white">"{example}"</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No memories message */}
        {memories.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No memories to search</h3>
            <p className="text-gray-300 mb-6">Add some memories first to start searching through them.</p>
            <Button 
              onClick={() => navigate('/add-memory')}
              className="bg-gradient-purple hover:opacity-90 text-white"
            >
              Add Your First Memory
            </Button>
          </div>
        )}

        {/* Search Results */}
        {query && memories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isSearching ? 'AI is analyzing your memories...' : `Results for "${query}"`}
            </h2>
            
            {isSearching && (
              <div className="glass-card p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-300">AI is searching through your memories...</p>
              </div>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-6">
                {searchResults.map((memory, index) => (
                  <div
                    key={memory.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MemoryCard {...memory} />
                  </div>
                ))}
              </div>
            )}
            
            {!isSearching && searchResults.length === 0 && (
              <div className="glass-card p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-300">No memories found matching your search. Try a different query or add more memories to your database.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMemory;
