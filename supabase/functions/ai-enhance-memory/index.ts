
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { description, people, existingTags, memoryId } = await req.json();
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    console.log('Processing AI enhancement request for description:', description.substring(0, 100));

    // Fetch file content for this memory if memoryId is provided
    let fileContent = '';
    if (memoryId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data: attachments } = await supabase
          .from('memory_attachments')
          .select('extracted_text, transcription, file_name, file_type')
          .eq('memory_id', memoryId)
          .eq('processing_status', 'completed');

        if (attachments && attachments.length > 0) {
          const fileTexts = attachments.map(att => {
            const content = [];
            if (att.extracted_text) {
              content.push(`Text from ${att.file_name}: ${att.extracted_text}`);
            }
            if (att.transcription) {
              content.push(`Audio transcription from ${att.file_name}: ${att.transcription}`);
            }
            return content.join('\n');
          }).filter(text => text.length > 0);
          
          if (fileTexts.length > 0) {
            fileContent = '\n\nFile Content:\n' + fileTexts.join('\n\n');
          }
        }
      }
    }

    const prompt = `You are an expert memory assistant. Analyze the following memory description and extract key information. Respond ONLY with valid JSON in this exact format:

{
  "summary": "A concise 1-2 sentence summary",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "insights": ["insight1", "insight2", "insight3"],
  "enhancedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Memory description: "${description}"
Existing people mentioned: ${people.join(', ')}
Existing tags: ${existingTags.join(', ')}${fileContent}

Focus on:
- Creating a clear, concise summary that includes information from attached files
- Identifying 3-5 key topics or themes from both description and file content
- Providing actionable insights about relationships or follow-ups
- Generating relevant tags that enhance searchability, including content from files
- Include the existing tags plus new relevant ones
- If there are images with text or audio transcriptions, incorporate that content into your analysis`;

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
            content: 'You are a helpful memory assistant that responds only with valid JSON. Never include markdown formatting or code blocks in your response.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
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
    
    console.log('Raw AI response:', aiResponse);

    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean the response in case there are any markdown code blocks
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      // Fallback response
      parsedResponse = {
        summary: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
        keyTopics: ['conversation', 'networking'],
        insights: ['Consider following up on this interaction'],
        enhancedTags: [...existingTags, 'ai-processed']
      };
    }

    console.log('Parsed AI response:', parsedResponse);

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-enhance-memory function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      // Fallback response for errors
      summary: 'Memory processing temporarily unavailable',
      keyTopics: ['general'],
      insights: ['AI enhancement temporarily unavailable'],
      enhancedTags: ['unprocessed']
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
