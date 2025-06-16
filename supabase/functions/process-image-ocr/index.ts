
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
    const { attachmentId, imageUrl } = await req.json();
    
    const ocrApiKey = Deno.env.get('OCR_SPACE_API_KEY');
    if (!ocrApiKey) {
      throw new Error('OCR_SPACE_API_KEY not configured');
    }

    console.log('Processing OCR for attachment:', attachmentId);

    // Use OCR.space API to extract text from image
    const formData = new FormData();
    formData.append('url', imageUrl);
    formData.append('apikey', ocrApiKey);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'false');
    formData.append('scale', 'true');
    formData.append('isTable', 'false');
    formData.append('OCREngine', '2');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OCR.space API error:', errorText);
      throw new Error(`OCR.space API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.IsErroredOnProcessing && data.ParsedResults && data.ParsedResults.length > 0) {
      const extractedText = data.ParsedResults[0].ParsedText;
      
      console.log('Extracted text:', extractedText.substring(0, 100));

      // Update the attachment record with extracted text
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: updateError } = await supabase
        .from('memory_attachments')
        .update({
          extracted_text: extractedText || null,
          processing_status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', attachmentId);

      if (updateError) {
        throw updateError;
      }

      console.log('Successfully updated attachment with OCR results');

      return new Response(JSON.stringify({ 
        success: true,
        extractedText: extractedText || null 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Handle OCR processing error
      const errorMessage = data.ErrorMessage || 'No text found in image';
      console.log('OCR processing result:', errorMessage);

      // Update attachment with completed status but no text
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('memory_attachments')
          .update({
            extracted_text: null,
            processing_status: 'completed',
            processed_at: new Date().toISOString()
          })
          .eq('id', attachmentId);
      }

      return new Response(JSON.stringify({ 
        success: true,
        extractedText: null,
        message: errorMessage
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in process-image-ocr function:', error);
    
    // Update processing status to failed
    if (req.body) {
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
