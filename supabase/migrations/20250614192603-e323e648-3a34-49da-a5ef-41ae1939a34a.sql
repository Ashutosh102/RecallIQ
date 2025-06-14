
-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create memories table to store user memories
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  people TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT,
  ai_enhanced BOOLEAN DEFAULT FALSE,
  ai_insights JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memory attachments table for files/images
CREATE TABLE public.memory_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI insights table for storing AI analysis
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL, -- 'connection_pattern', 'frequent_contact', 'topic_trend', etc.
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  relevance_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for memories table
CREATE POLICY "Users can view their own memories" 
  ON public.memories FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories" 
  ON public.memories FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories" 
  ON public.memories FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories" 
  ON public.memories FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS Policies for memory attachments
CREATE POLICY "Users can view attachments for their memories" 
  ON public.memory_attachments FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.memories 
    WHERE id = memory_attachments.memory_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create attachments for their memories" 
  ON public.memory_attachments FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.memories 
    WHERE id = memory_attachments.memory_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete attachments for their memories" 
  ON public.memory_attachments FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.memories 
    WHERE id = memory_attachments.memory_id 
    AND user_id = auth.uid()
  ));

-- RLS Policies for AI insights
CREATE POLICY "Users can view their own AI insights" 
  ON public.ai_insights FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI insights" 
  ON public.ai_insights FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_memories_user_id ON public.memories(user_id);
CREATE INDEX idx_memories_date ON public.memories(date);
CREATE INDEX idx_memories_tags ON public.memories USING gin(tags);
CREATE INDEX idx_memories_people ON public.memories USING gin(people);
CREATE INDEX idx_memory_attachments_memory_id ON public.memory_attachments(memory_id);
CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON public.ai_insights(insight_type);

-- Update function to set updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_memories_updated_at 
  BEFORE UPDATE ON public.memories 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
