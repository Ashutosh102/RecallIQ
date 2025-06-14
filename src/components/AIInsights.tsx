
import { useState, useEffect } from 'react';
import { Brain, Lightbulb, TrendingUp } from 'lucide-react';
import { aiService } from '@/lib/ai';

interface AIInsightsProps {
  memories: any[];
}

const AIInsights = ({ memories }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      if (memories.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const aiInsights = await aiService.generateInsights(memories);
        setInsights(aiInsights);
      } catch (error) {
        console.error('Failed to generate insights:', error);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [memories]);

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center mb-4">
          <Brain className="h-5 w-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">AI Insights</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-4 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center mb-4">
          <Brain className="h-5 w-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">AI Insights</h3>
        </div>
        <p className="text-gray-400">Add more memories to get AI-powered insights about your connections.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center mb-4">
        <Brain className="h-5 w-5 text-purple-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-gradient-purple rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
