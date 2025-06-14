
-- Create storage bucket for memory attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memory-attachments', 'memory-attachments', true);

-- Create storage policies for memory attachments
CREATE POLICY "Users can view their own attachments" ON storage.objects
FOR SELECT USING (bucket_id = 'memory-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own attachments" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'memory-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own attachments" ON storage.objects
FOR DELETE USING (bucket_id = 'memory-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
