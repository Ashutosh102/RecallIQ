
-- Fix Email OTP Security (CRITICAL)
-- Add proper RLS policies to email_verification_otps table
DROP POLICY IF EXISTS "Allow OTP operations for email verification" ON public.email_verification_otps;

-- Create restrictive policies for OTP operations
CREATE POLICY "Service can manage OTP operations" 
  ON public.email_verification_otps 
  FOR ALL 
  USING (false)
  WITH CHECK (false);

-- Allow service role to bypass RLS for OTP operations
ALTER TABLE public.email_verification_otps FORCE ROW LEVEL SECURITY;

-- Fix Memory Attachments UPDATE Policy (CRITICAL)
-- Add missing UPDATE policy for memory_attachments table
CREATE POLICY "Users can update their own attachments processing status" 
  ON public.memory_attachments 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.memories 
    WHERE id = memory_attachments.memory_id 
    AND user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.memories 
    WHERE id = memory_attachments.memory_id 
    AND user_id = auth.uid()
  ));

-- Secure Storage Bucket (HIGH)
-- Make memory-attachments bucket private and update policies
UPDATE storage.buckets 
SET public = false 
WHERE id = 'memory-attachments';

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;

-- Create secure storage policies
CREATE POLICY "Users can view their own memory attachments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'memory-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own memory attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'memory-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own memory attachments" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'memory-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own memory attachments" ON storage.objects
FOR DELETE USING (
  bucket_id = 'memory-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add cleanup function for expired OTPs (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps_secure()
RETURNS void AS $$
BEGIN
  DELETE FROM public.email_verification_otps 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
