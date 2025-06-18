
-- Create storage bucket for memory attachments if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'memory-attachments') THEN
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('memory-attachments', 'memory-attachments', true);
    END IF;
END $$;

-- Create storage policies for memory attachments if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Users can view their own attachments'
    ) THEN
        CREATE POLICY "Users can view their own attachments" ON storage.objects
        FOR SELECT USING (bucket_id = 'memory-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Users can upload their own attachments'
    ) THEN
        CREATE POLICY "Users can upload their own attachments" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'memory-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Users can delete their own attachments'
    ) THEN
        CREATE POLICY "Users can delete their own attachments" ON storage.objects
        FOR DELETE USING (bucket_id = 'memory-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
END $$;
