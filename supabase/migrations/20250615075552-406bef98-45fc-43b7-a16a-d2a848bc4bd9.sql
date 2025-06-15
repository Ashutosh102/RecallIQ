
-- Create table to store OTP codes for email verification
CREATE TABLE public.email_verification_otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_email_verification_otps_email ON public.email_verification_otps(email);
CREATE INDEX idx_email_verification_otps_expires_at ON public.email_verification_otps(expires_at);

-- Enable RLS
ALTER TABLE public.email_verification_otps ENABLE ROW LEVEL SECURITY;

-- Create policy for OTP operations (no user context needed as this is pre-auth)
CREATE POLICY "Allow OTP operations for email verification" 
  ON public.email_verification_otps 
  FOR ALL 
  USING (true);

-- Function to generate 6-digit OTP
CREATE OR REPLACE FUNCTION generate_otp()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.email_verification_otps 
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create or update OTP for email
CREATE OR REPLACE FUNCTION create_email_verification_otp(p_email TEXT)
RETURNS TEXT AS $$
DECLARE
  v_otp TEXT;
BEGIN
  -- Generate new OTP
  v_otp := generate_otp();
  
  -- Clean up any existing OTPs for this email
  DELETE FROM public.email_verification_otps WHERE email = p_email;
  
  -- Insert new OTP
  INSERT INTO public.email_verification_otps (email, otp_code)
  VALUES (p_email, v_otp);
  
  RETURN v_otp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify OTP
CREATE OR REPLACE FUNCTION verify_email_otp(p_email TEXT, p_otp TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_record RECORD;
BEGIN
  -- Get the OTP record
  SELECT * INTO v_record 
  FROM public.email_verification_otps 
  WHERE email = p_email 
    AND otp_code = p_otp 
    AND expires_at > NOW() 
    AND verified = FALSE
    AND attempts < 3;
  
  IF NOT FOUND THEN
    -- Increment attempts if record exists
    UPDATE public.email_verification_otps 
    SET attempts = attempts + 1 
    WHERE email = p_email AND expires_at > NOW();
    
    RETURN FALSE;
  END IF;
  
  -- Mark as verified
  UPDATE public.email_verification_otps 
  SET verified = TRUE 
  WHERE id = v_record.id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
