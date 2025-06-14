
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('memory-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('memory-attachments')
        .getPublicUrl(filePath);

      return {
        id: fileName,
        name: file.name,
        url: publicUrl,
        type: file.type,
        size: file.size
      };
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileName: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const filePath = `${user.id}/${fileName}`;
      const { error } = await supabase.storage
        .from('memory-attachments')
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading
  };
};
