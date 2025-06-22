
-- Add credits and premium fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 500;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '2 months');
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT true;

-- Create table to track credit usage history
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL, -- 'memory_save', 'memory_with_media', 'ai_search', 'purchase'
  credits_used INTEGER NOT NULL, -- negative for usage, positive for purchases
  credits_remaining INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table to track freemium usage limits
CREATE TABLE IF NOT EXISTS public.freemium_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL, -- format: 'YYYY-MM'
  memory_saves INTEGER DEFAULT 0,
  memory_saves_with_media INTEGER DEFAULT 0,
  ai_searches INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS on new tables
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freemium_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for credit_transactions
CREATE POLICY "Users can view their own credit transactions" 
  ON public.credit_transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credit transactions" 
  ON public.credit_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for freemium_usage
CREATE POLICY "Users can view their own freemium usage" 
  ON public.freemium_usage FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own freemium usage" 
  ON public.freemium_usage FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to check and update premium status
CREATE OR REPLACE FUNCTION public.check_and_update_premium_status(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_profile RECORD;
  current_month TEXT;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile FROM public.profiles WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if premium has expired
  IF user_profile.is_premium AND user_profile.premium_expires_at < NOW() THEN
    -- Update to freemium
    UPDATE public.profiles 
    SET is_premium = FALSE, credits = 0 
    WHERE id = p_user_id;
    
    -- Initialize freemium usage for current month
    current_month := TO_CHAR(NOW(), 'YYYY-MM');
    INSERT INTO public.freemium_usage (user_id, month_year)
    VALUES (p_user_id, current_month)
    ON CONFLICT (user_id, month_year) DO NOTHING;
    
    RETURN FALSE;
  END IF;
  
  RETURN user_profile.is_premium;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits and track usage
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_action_type TEXT,
  p_credits_to_deduct INTEGER,
  p_description TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  user_profile RECORD;
  current_month TEXT;
  freemium_record RECORD;
  result JSONB;
BEGIN
  -- Check premium status first
  PERFORM public.check_and_update_premium_status(p_user_id);
  
  -- Get updated user profile
  SELECT * INTO user_profile FROM public.profiles WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- If premium, check credits
  IF user_profile.is_premium THEN
    IF user_profile.credits < p_credits_to_deduct THEN
      RETURN jsonb_build_object('success', false, 'error', 'Insufficient credits');
    END IF;
    
    -- Deduct credits
    UPDATE public.profiles 
    SET credits = credits - p_credits_to_deduct 
    WHERE id = p_user_id;
    
    -- Log transaction
    INSERT INTO public.credit_transactions (user_id, action_type, credits_used, credits_remaining, description)
    VALUES (p_user_id, p_action_type, -p_credits_to_deduct, user_profile.credits - p_credits_to_deduct, p_description);
    
    RETURN jsonb_build_object('success', true, 'credits_remaining', user_profile.credits - p_credits_to_deduct);
  ELSE
    -- Freemium mode - check limits
    current_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    -- Get or create freemium usage record
    INSERT INTO public.freemium_usage (user_id, month_year)
    VALUES (p_user_id, current_month)
    ON CONFLICT (user_id, month_year) DO NOTHING;
    
    SELECT * INTO freemium_record FROM public.freemium_usage 
    WHERE user_id = p_user_id AND month_year = current_month;
    
    -- Check limits based on action type
    IF p_action_type = 'memory_save' THEN
      IF freemium_record.memory_saves >= 5 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Monthly limit reached for memory saves');
      END IF;
      UPDATE public.freemium_usage 
      SET memory_saves = memory_saves + 1, updated_at = NOW()
      WHERE user_id = p_user_id AND month_year = current_month;
    ELSIF p_action_type = 'memory_with_media' THEN
      IF freemium_record.memory_saves >= 5 OR freemium_record.memory_saves_with_media >= 2 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Monthly limit reached for memory saves with media');
      END IF;
      UPDATE public.freemium_usage 
      SET memory_saves = memory_saves + 1, memory_saves_with_media = memory_saves_with_media + 1, updated_at = NOW()
      WHERE user_id = p_user_id AND month_year = current_month;
    ELSIF p_action_type = 'ai_search' THEN
      IF freemium_record.ai_searches >= 5 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Monthly limit reached for AI searches');
      END IF;
      UPDATE public.freemium_usage 
      SET ai_searches = ai_searches + 1, updated_at = NOW()
      WHERE user_id = p_user_id AND month_year = current_month;
    END IF;
    
    RETURN jsonb_build_object('success', true, 'freemium', true);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (for purchases)
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_credits_to_add INTEGER,
  p_description TEXT DEFAULT 'Credit purchase'
)
RETURNS JSONB AS $$
DECLARE
  user_profile RECORD;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile FROM public.profiles WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Add credits
  UPDATE public.profiles 
  SET credits = credits + p_credits_to_add 
  WHERE id = p_user_id;
  
  -- Log transaction
  INSERT INTO public.credit_transactions (user_id, action_type, credits_used, credits_remaining, description)
  VALUES (p_user_id, 'purchase', p_credits_to_add, user_profile.credits + p_credits_to_add, p_description);
  
  RETURN jsonb_build_object('success', true, 'credits_total', user_profile.credits + p_credits_to_add);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to set initial credits properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, credits, joined_at, premium_expires_at, is_premium)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    500, -- Initial credits
    NOW(),
    NOW() + INTERVAL '2 months', -- Premium expires in 2 months
    true -- Initially premium
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_freemium_usage_user_month ON public.freemium_usage(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_profiles_premium_expires ON public.profiles(premium_expires_at) WHERE is_premium = true;
