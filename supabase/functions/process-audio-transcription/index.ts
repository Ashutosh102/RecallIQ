
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { attachmentId, audioUrl } = await req.json();
    
    const assemblyaiApiKey = Deno.env.get('ASSEMBLYAI_API_KEY');
    if (!assemblyaiApiKey) {
      throw new Error('ASSEMBLYAI_API_KEY not configured');
    }

    console.log('Processing transcription for attachment:', attachmentId);

    // Fetch the audio file from the URL
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error('Failed to fetch audio file');
    }

    const audioBuffer = await audioResponse.arrayBuffer();

    // Step 1: Upload audio file to AssemblyAI
    console.log('Uploading audio to AssemblyAI...');
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': assemblyaiApiKey,
        'Content-Type': 'application/octet-stream',
      },
      body: audioBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('AssemblyAI upload error:', errorText);
      throw new Error(`AssemblyAI upload error: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    const audioUploadUrl = uploadData.upload_url;
    
    console.log('Audio uploaded successfully, URL:', audioUploadUrl);

    // Step 2: Submit transcription request
    console.log('Submitting transcription request...');
    const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': assemblyaiApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUploadUrl,
        speech_model: 'best',
      }),
    });

    if (!transcriptResponse.ok) {
      const errorText = await transcriptResponse.text();
      console.error('AssemblyAI transcript request error:', errorText);
      throw new Error(`AssemblyAI transcript request error: ${transcriptResponse.status}`);
    }

    const transcriptData = await transcriptResponse.json();
    const transcriptId = transcriptData.id;
    
    console.log('Transcription job submitted, ID:', transcriptId);

    // Step 3: Poll for completion
    let transcription = null;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max (5 second intervals)
    
    while (attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}`);
      
      const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': assemblyaiApiKey,
        },
      });

      if (!pollResponse.ok) {
        throw new Error(`Failed to poll transcription status: ${pollResponse.status}`);
      }

      const pollData = await pollResponse.json();
      console.log('Transcription status:', pollData.status);

      if (pollData.status === 'completed') {
        transcription = pollData.text;
        break;
      } else if (pollData.status === 'error') {
        throw new Error(`Transcription failed: ${pollData.error}`);
      }

      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    if (!transcription && attempts >= maxAttempts) {
      throw new Error('Transcription timed out after 5 minutes');
    }
    
    console.log('Generated transcription:', transcription?.substring(0, 100));

    // Update the attachment record with transcription
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from('memory_attachments')
      .update({
        transcription: transcription || null,
        processing_status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', attachmentId);

    if (updateError) {
      throw updateError;
    }

    console.log('Successfully updated attachment with transcription');

    return new Response(JSON.stringify({ 
      success: true,
      transcription: transcription || null 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-audio-transcription function:', error);
    
    // Update processing status to failed
    try {
      const { attachmentId } = await req.json();
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey && attachmentId) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('memory_attachments')
          .update({
            processing_status: 'failed',
            processed_at: new Date().toISOString()
          })
          .eq('id', attachmentId);
      }
    } catch (updateError) {
      console.error('Failed to update processing status:', updateError);
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
