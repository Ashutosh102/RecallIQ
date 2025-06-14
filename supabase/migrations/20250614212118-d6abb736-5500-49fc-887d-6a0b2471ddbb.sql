
-- Add columns to memory_attachments table for processed content
ALTER TABLE public.memory_attachments 
ADD COLUMN extracted_text TEXT,
ADD COLUMN transcription TEXT,
ADD COLUMN processing_status TEXT DEFAULT 'pending',
ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE;

-- Create index for searching extracted content
CREATE INDEX idx_memory_attachments_extracted_text ON public.memory_attachments USING gin(to_tsvector('english', extracted_text));
CREATE INDEX idx_memory_attachments_transcription ON public.memory_attachments USING gin(to_tsvector('english', transcription));
CREATE INDEX idx_memory_attachments_processing_status ON public.memory_attachments(processing_status);
