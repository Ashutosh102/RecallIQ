
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
    const { memories } = await req.json();
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    console.log('Generating insights for', memories.length, 'memories');

    // Create a summary of memories for analysis
    const memoryOverview = memories.map((memory: any) => ({
      date: memory.date,
      people: memory.people || [],
      tags: memory.tags || [],
      summary: memory.summary.substring(0, 100)
    }));

    const prompt = `You are an intelligent memory analyst. Analyze the user's memory collection and provide actionable insights. Respond ONLY with a JSON array of insight strings:

["insight1", "insight2", "insight3", "insight4", "insight5"]

Memory Collection Overview:
${JSON.stringify(memoryOverview, null, 2)}

Generate 3-5 actionable insights about:
- Networking patterns and frequency
- Relationship maintenance opportunities
- Professional development trends
- Follow-up recommendations
- Social connection insights

Make insights specific, actionable, and valuable for relationship management.`;

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
            content: 'You are a helpful memory analyst that responds only with valid JSON arrays. Never include markdown formatting or code blocks in your response.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('Raw AI insights response:', aiResponse);

    // Parse the JSON response
    let insights;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      insights = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI insights response as JSON:', aiResponse);
      // Fallback insights
      insights = [
        `You've recorded ${memories.length} memories - great job building your network!`,
        'Consider reaching out to contacts you haven\'t spoken with recently',
        'Most of your connections seem to be in professional settings'
      ];
    }

    console.log('Parsed insights:', insights);

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-generate-insights function:', error);
    return new Response(JSON.stringify([
      'Insight generation temporarily unavailable',
      'Your memory collection is growing nicely',
      'Keep adding memories to unlock better insights'
    ]), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
