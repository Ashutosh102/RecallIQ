
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface Memory {
  id: string;
  title: string;
  summary: string;
  content?: string;
  people: string[];
  tags: string[];
  date: string;
  location?: string;
  ai_enhanced: boolean;
  ai_insights: any;
  created_at: string;
  updated_at: string;
}

export const useMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMemories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setMemories(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching memories",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMemory = async (memoryData: Omit<Memory, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('memories')
        .insert([{
          ...memoryData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setMemories(prev => [data, ...prev]);
      toast({
        title: "Memory added",
        description: "Your memory has been successfully saved.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error adding memory",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMemory = async (id: string, updates: Partial<Memory>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('memories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMemories(prev => prev.map(memory => 
        memory.id === id ? { ...memory, ...data } : memory
      ));
      
      toast({
        title: "Memory updated",
        description: "Your memory has been successfully updated.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating memory",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteMemory = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMemories(prev => prev.filter(memory => memory.id !== id));
      toast({
        title: "Memory deleted",
        description: "Your memory has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting memory",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [user]);

  return {
    memories,
    loading,
    addMemory,
    updateMemory,
    deleteMemory,
    refetch: fetchMemories,
  };
};
