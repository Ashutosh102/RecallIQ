-- Create table to store payment records
CREATE TABLE IF NOT EXISTS public.payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  payment_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  amount_credits INTEGER NOT NULL,
  payment_status TEXT NOT NULL, -- 'completed', 'failed', 'refunded'
  payment_provider TEXT NOT NULL, -- 'razorpay', etc.
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on payment_records table
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_records
CREATE POLICY "Users can view their own payment records" 
  ON public.payment_records FOR SELECT 
  USING (auth.uid() = user_id);

-- Only service role can insert payment records
CREATE POLICY "Service role can insert payment records" 
  ON public.payment_records FOR INSERT 
  WITH CHECK (false);

-- Create index for faster lookups
CREATE INDEX idx_payment_records_user_id ON public.payment_records(user_id);
CREATE INDEX idx_payment_records_payment_id ON public.payment_records(payment_id);