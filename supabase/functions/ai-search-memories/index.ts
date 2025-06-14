
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, memories } = await req.json();
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    console.log('Processing AI search for query:', query);

    // Create a simplified representation of memories for the AI
    const memoryContext = memories.map((memory: any) => ({
      id: memory.id,
      title: memory.title,
      summary: memory.summary,
      people: memory.people || [],
      tags: memory.tags || []
    }));

    const prompt = `You are an intelligent search assistant. Analyze the user query and find the most relevant memories. Respond ONLY with valid JSON in this exact format:

{
  "relevantMemories": ["memory_id1", "memory_id2"],
  "interpretation": "Your interpretation of what the user is looking for",
  "suggestedQueries": ["suggested search 1", "suggested search 2", "suggested search 3"]
}

User Query: "${query}"

Available Memories:
${JSON.stringify(memoryContext, null, 2)}

Instructions:
- Return IDs of memories that best match the query
- Provide a clear interpretation of the search intent
- Suggest 3 related follow-up searches
- Consider semantic meaning, not just exact word matches`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful search assistant that responds only with valid JSON. Never include markdown formatting or code blocks in your response.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('Raw AI search response:', aiResponse);

    // Parse the JSON response
    let parsedResponse;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI search response as JSON:', aiResponse);
      // Fallback to basic text search
      const basicResults = memories.filter((memory: any) => 
        memory.title.toLowerCase().includes(query.toLowerCase()) ||
        memory.summary.toLowerCase().includes(query.toLowerCase()) ||
        memory.people?.some((person: string) => person.toLowerCase().includes(query.toLowerCase())) ||
        memory.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      parsedResponse = {
        relevantMemories: basicResults.map((m: any) => m.id),
        interpretation: `Search for "${query}" using basic text matching`,
        suggestedQueries: [
          'Show me recent memories',
          'Find all people I met',
          'Search by location or event'
        ]
      };
    }

    console.log('Parsed AI search response:', parsedResponse);

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-search-memories function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      relevantMemories: [],
      interpretation: 'Search temporarily unavailable',
      suggestedQueries: ['Try again later']
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
