
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SendOTPRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate and store OTP
    const { data: otpData, error: otpError } = await supabase
      .rpc('create_email_verification_otp', { p_email: email });

    if (otpError) {
      throw new Error(`Failed to generate OTP: ${otpError.message}`);
    }

    // For now, we'll return the OTP in the response for testing
    // In production, you would send this via email using Resend
    console.log(`Generated OTP for ${email}: ${otpData}`);

    // TODO: Implement actual email sending with Resend
    // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    // await resend.emails.send({
    //   from: "noreply@yourdomain.com",
    //   to: [email],
    //   subject: "Your verification code",
    //   html: `Your verification code is: <strong>${otpData}</strong>`
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully",
        // Remove this in production - only for testing
        otp: otpData 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-otp-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
