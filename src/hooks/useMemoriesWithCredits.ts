/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemories } from '@/hooks/useMemories';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/use-toast';

export const useMemoriesWithCredits = () => {
  const memoriesHook = useMemories();
  const { deductCredits } = useCredits();
  const { toast } = useToast();

  const addMemoryWithCredits = async (memoryData: any, hasMedia: boolean = false) => {
    // Determine credit cost
    const creditCost = hasMedia ? 3 : 1;
    const actionType = hasMedia ? 'memory_with_media' : 'memory_save';
    
    // Try to deduct credits first
    const result = await deductCredits(actionType, creditCost, `Memory save: ${memoryData.title}`);
    
    // Type assertion for the result
    const typedResult = result as { success: boolean; error?: string };
    
    if (!typedResult.success) {
      return { success: false, error: typedResult.error };
    }

    try {
      // If credits deducted successfully, add the memory
      const memory = await memoriesHook.addMemory(memoryData);
      
      toast({
        title: "Memory saved successfully!",
        description: `${creditCost} ${creditCost === 1 ? 'credit' : 'credits'} deducted.`,
      });
      
      return { success: true, memory };
    } catch (error: any) {
      // If memory creation fails, we should ideally refund the credits
      // For now, just show error
      toast({
        title: "Error saving memory",
        description: "Memory could not be saved, but credits were deducted. Please contact support.",
        variant: "destructive",
      });
      
      return { success: false, error: error.message };
    }
  };

  return {
    ...memoriesHook,
    addMemoryWithCredits,
  };
};
