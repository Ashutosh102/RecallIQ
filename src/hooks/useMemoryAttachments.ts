
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface MemoryAttachment {
  id: string;
  memory_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
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
          file_size: file.size
        })
        .select()
        .single();

      if (error) throw error;
      
      setAttachments(prev => [...prev, data]);
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

  const fetchAttachments = async (memoryId: string) => {
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
  };

  return {
    attachments,
    loading,
    addAttachment,
    removeAttachment,
    fetchAttachments
  };
};
