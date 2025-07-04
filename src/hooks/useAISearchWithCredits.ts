/* eslint-disable @typescript-eslint/no-explicit-any */
import { aiService } from '@/lib/ai';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/components/ui/use-toast';

export const useAISearchWithCredits = () => {
  const { deductCredits } = useCredits();
  const { toast } = useToast();

  const searchMemoriesWithCredits = async (query: string, memories: any[]) => {
    const creditCost = 2;
    const actionType = 'ai_search';

    // Try to deduct credits first
    const result = await deductCredits(actionType, creditCost, `AI Search: ${query}`);

    const typedResult = result as { success: boolean; error?: string };

    if (!typedResult.success) {
      toast({
        title: "Credit Deduction Failed",
        description: typedResult.error || "Could not deduct credits for AI search.",
        variant: "destructive",
      });
      return { success: false, error: typedResult.error };
    }

    try {
      // If credits deducted successfully, perform the AI search
      const searchResult = await aiService.searchMemories(query, memories);

      toast({
        title: "AI Search successful!",
        description: `${creditCost} credits deducted.`,
      });

      return { success: true, searchResult };
    } catch (error: any) {
      // If AI search fails, we should ideally refund the credits
      // For now, just show error
      toast({
        title: "Error performing AI search",
        description: "AI search could not be completed, but credits were deducted. Please contact support.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    }
  };

  return {
    searchMemoriesWithCredits,
  };
};