
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { aiService } from '@/lib/ai';

export interface MemoryAttachment {
  id: string;
  memory_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
  extracted_text?: string;
  transcription?: string;
  processing_status?: string;
  processed_at?: string;
}

export const useMemoryAttachments = () => {
  const [attachments, setAttachments] = useState<MemoryAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const addAttachment = async (memoryId: string, file: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('memory_attachments')
        .insert({
          memory_id: memoryId,
          file_name: file.name,
          file_url: file.url,
          file_type: file.type,
          file_size: file.size,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      setAttachments(prev => [...prev, data]);

      // Process file content in background
      processFileContent(data);
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error adding attachment",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const processFileContent = async (attachment: MemoryAttachment) => {
    try {
      if (attachment.file_type.startsWith('image/')) {
        // Process OCR for images
        await aiService.processImageOCR(attachment.id, attachment.file_url);
      } else if (attachment.file_type.startsWith('audio/')) {
        // Process transcription for audio
        await aiService.processAudioTranscription(attachment.id, attachment.file_url);
      }
      
      // Refresh attachments to get updated processing status
      fetchAttachments(attachment.memory_id);
    } catch (error) {
      console.error('File processing failed:', error);
      toast({
        title: "File processing failed",
        description: "Content extraction from this file failed, but the file is still attached.",
        variant: "destructive",
      });
    }
  };

  const removeAttachment = async (attachmentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('memory_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) throw error;
      
      setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    } catch (error: any) {
      toast({
        title: "Error removing attachment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchAttachments = useCallback(async (memoryId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('memory_attachments')
        .select('*')
        .eq('memory_id', memoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttachments(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching attachments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  return {
    attachments,
    loading,
    addAttachment,
    removeAttachment,
    fetchAttachments
  };
};
