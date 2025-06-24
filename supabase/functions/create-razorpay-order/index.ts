import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency, receipt }: CreateOrderRequest = await req.json();

    if (!amount || !currency) {
      throw new Error("Amount and currency are required");
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Razorpay API key and secret from environment variables
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID")!;
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

    // Create order using Razorpay API
    const razorpayUrl = "https://api.razorpay.com/v1/orders";
    const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;  

    const response = await fetch(razorpayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.description || "Failed to create Razorpay order");
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: data,
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