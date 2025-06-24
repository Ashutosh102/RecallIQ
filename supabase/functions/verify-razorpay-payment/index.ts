import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper function to create HMAC SHA-256 signature using Web Crypto API
async function createHmacSha256(message: string, secret: string): Promise<string> {
  // Convert message and secret to Uint8Array
  const encoder = new TextEncoder();
  const messageUint8 = encoder.encode(message);
  const secretUint8 = encoder.encode(secret);
  
  // Import the secret key
  const key = await crypto.subtle.importKey(
    'raw',
    secretUint8,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Sign the message
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    messageUint8
  );
  
  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  credits: number;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      credits,
      user_id 
    }: VerifyPaymentRequest = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !credits || !user_id) {
      throw new Error("Missing required parameters");
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Razorpay key secret from environment variables
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

    // Verify signature using Web Crypto API
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = await createHmacSha256(payload, razorpayKeySecret);

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid signature");
    }

    // Add credits to user's account
    const { data, error } = await supabase.rpc('add_credits', {
      p_user_id: user_id,
      p_credits_to_add: credits,
      p_description: `Purchase of ${credits} credits (Payment ID: ${razorpay_payment_id})`
    });

    if (error) {
      throw error;
    }

    // Store payment information in a new table for record-keeping
    const { error: paymentError } = await supabase
      .from('payment_records')
      .insert({
        user_id,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount_credits: credits,
        payment_status: 'completed',
        payment_provider: 'razorpay'
      });

    if (paymentError) {
      console.error('Error storing payment record:', paymentError);
      // Continue anyway as credits were added successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
};

serve(handler);