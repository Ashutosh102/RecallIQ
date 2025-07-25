
import { supabase } from '@/integrations/supabase/client';

// AI service utility for memory processing
export interface AIMemoryResponse {
  summary: string;
  keyTopics: string[];
  insights: string[];
  enhancedTags: string[];
}

export interface AISearchResponse {
  relevantMemories: string[];
  interpretation: string;
  suggestedQueries: string[];
}

// Real AI service using Groq + LLaMA 3 via Supabase Edge Functions
export const aiService = {
  async enhanceMemory(description: string, people: string[], existingTags: string[], memoryId?: string): Promise<AIMemoryResponse> {
    console.log('Calling AI enhancement for description:', description.substring(0, 50));
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-enhance-memory', {
        body: {
          description,
          people,
          existingTags,
          memoryId
        }
      });

      if (error) {
        console.error('AI enhancement error:', error);
        throw error;
      }

      console.log('AI enhancement successful:', data);
      return data;
    } catch (error) {
      console.error('Failed to enhance memory with AI:', error);
      // Fallback to basic enhancement
      return {
        summary: `Summary: ${description.slice(0, 100)}${description.length > 100 ? '...' : ''}`,
        keyTopics: ['conversation', 'networking'],
        insights: [
          'This interaction could be valuable for future networking',
          'Consider following up within a reasonable timeframe',
          'Add more context or details when you have time'
        ],
        enhancedTags: [...existingTags, 'needs-review'],
      };
    }
  },

  async searchMemories(query: string, memories: any[]): Promise<AISearchResponse> {
    console.log('Calling AI search for query:', query);
    
    try {
      // Enhance memories with attachment content for search
      const memoriesWithAttachments = await Promise.all(
        memories.map(async (memory) => {
          try {
            const { data: attachments } = await supabase
              .from('memory_attachments')
              .select('extracted_text, transcription, file_name')
              .eq('memory_id', memory.id)
              .eq('processing_status', 'completed');
            
            return {
              ...memory,
              attachments: attachments || []
            };
          } catch (error) {
            console.error('Failed to fetch attachments for memory:', memory.id, error);
            return memory;
          }
        })
      );

      const { data, error } = await supabase.functions.invoke('ai-search-memories', {
        body: {
          query,
          memories: memoriesWithAttachments
        }
      });

      if (error) {
        console.error('AI search error:', error);
        throw error;
      }

      console.log('AI search successful:', data);
      return data;
    } catch (error) {
      console.error('Failed to search memories with AI:', error);
      // Fallback to basic text search
      const basicResults = memories.filter(memory => 
        memory.title.toLowerCase().includes(query.toLowerCase()) ||
        memory.summary.toLowerCase().includes(query.toLowerCase()) ||
        memory.people?.some((person: string) => person.toLowerCase().includes(query.toLowerCase())) ||
        memory.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      return {
        relevantMemories: basicResults.map(m => m.id),
        interpretation: `Basic text search for "${query}" - AI search temporarily unavailable`,
        suggestedQueries: [
          'Show me recent connections',
          'Find people by profession',
          'Search by event or location'
        ]
      };
    }
  },

  async generateInsights(memories: any[]): Promise<string[]> {
    console.log('Generating AI insights for', memories.length, 'memories');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-generate-insights', {
        body: {
          memories
        }
      });

      if (error) {
        console.error('AI insights error:', error);
        throw error;
      }

      console.log('AI insights successful:', data);
      return data;
    } catch (error) {
      console.error('Failed to generate insights with AI:', error);
      // Fallback insights
      return [
        `You've connected with ${memories.length} people - keep building your network!`,
        'Consider reaching out to contacts you haven\'t spoken with recently',
        'Most of your networking happens in professional settings',
        'Add more context to your memories for better AI insights'
      ];
    }
  },

  // New functions for file processing
  async processImageOCR(attachmentId: string, imageUrl: string): Promise<string | null> {
    console.log('Processing OCR for attachment:', attachmentId);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-image-ocr', {
        body: {
          attachmentId,
          imageUrl
        }
      });

      if (error) {
        console.error('OCR processing error:', error);
        throw error;
      }

      console.log('OCR processing successful:', data);
      return data.extractedText;
    } catch (error) {
      console.error('Failed to process OCR:', error);
      return null;
    }
  },

  async processAudioTranscription(attachmentId: string, audioUrl: string): Promise<string | null> {
    console.log('Processing transcription for attachment:', attachmentId);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-audio-transcription', {
        body: {
          attachmentId,
          audioUrl
        }
      });

      if (error) {
        console.error('Transcription processing error:', error);
        throw error;
      }

      console.log('Transcription processing successful:', data);
      return data.transcription;
    } catch (error) {
      console.error('Failed to process transcription:', error);
      return null;
    }
  }
};
