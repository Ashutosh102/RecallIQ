
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  credits: number;
  is_premium: boolean;
  premium_expires_at: string;
  joined_at: string;
  first_name?: string;
  last_name?: string;
}

export interface CreditTransaction {
  id: string;
  action_type: string;
  credits_used: number;
  credits_remaining: number;
  description?: string;
  created_at: string;
}

export interface FreemiumUsage {
  memory_saves: number;
  memory_saves_with_media: number;
  ai_searches: number;
}

export const useCredits = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [freemiumUsage, setFreemiumUsage] = useState<FreemiumUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
    }
  }, [user]);

  const fetchFreemiumUsage = useCallback(async () => {
    if (!user || !profile || profile.is_premium) return;

    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const { data, error } = await supabase
        .from('freemium_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('month_year', currentMonth)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
      setFreemiumUsage(data || { memory_saves: 0, memory_saves_with_media: 0, ai_searches: 0 });
    } catch (error: any) {
      console.error('Error fetching freemium usage:', error);
    }
  }, [user, profile]);

  const deductCredits = async (actionType: string, creditsToDeduct: number, description?: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_action_type: actionType,
        p_credits_to_deduct: creditsToDeduct,
        p_description: description
      });

      if (error) throw error;

      // Type assertion for the RPC response
      const typedData = data as { success: boolean; error?: string };

      if (typedData.success) {
        // Refresh profile and transactions
        await fetchProfile();
        await fetchTransactions();
        if (!profile?.is_premium) {
          await fetchFreemiumUsage();
        }
      } else {
        toast({
          title: "Action blocked",
          description: typedData.error,
          variant: "destructive",
        });
      }

      return typedData;
    } catch (error: any) {
      console.error('Error deducting credits:', error);
      toast({
        title: "Error",
        description: "Failed to process action",
        variant: "destructive",
      });
      return { success: false, error: error.message } as { success: boolean; error: string };
    }
  };

  const checkPremiumStatus = async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('check_and_update_premium_status', {
        p_user_id: user.id
      });

      if (error) throw error;
      
      // Type assertion for the RPC response
      const typedData = data as boolean;
      
      // Refresh profile after status check
      await fetchProfile();
      if (!typedData) {
        await fetchFreemiumUsage();
      }
      
      return typedData;
    } catch (error: any) {
      console.error('Error checking premium status:', error);
      return false;
    }
  };

  const getDaysUntilExpiry = () => {
    if (!profile?.premium_expires_at) return 0;
    
    const expiryDate = new Date(profile.premium_expires_at);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const getFreemiumLimits = () => {
    return {
      maxMemorySaves: 5,
      maxMemorySavesWithMedia: 2,
      maxAiSearches: 5,
      usedMemorySaves: freemiumUsage?.memory_saves || 0,
      usedMemorySavesWithMedia: freemiumUsage?.memory_saves_with_media || 0,
      usedAiSearches: freemiumUsage?.ai_searches || 0,
    };
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchProfile(),
        fetchTransactions(),
      ]).finally(() => setLoading(false));
    } else {
      setProfile(null);
      setTransactions([]);
      setFreemiumUsage(null);
      setLoading(false);
    }
  }, [user, fetchProfile, fetchTransactions]);

  useEffect(() => {
    if (profile && !profile.is_premium) {
      fetchFreemiumUsage();
    }
  }, [profile, fetchFreemiumUsage]);

  return {
    profile,
    transactions,
    freemiumUsage,
    loading,
    deductCredits,
    checkPremiumStatus,
    getDaysUntilExpiry,
    getFreemiumLimits,
    refreshProfile: fetchProfile,
  };
};
