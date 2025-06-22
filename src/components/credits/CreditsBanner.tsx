
import { useCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Coins, Clock, Crown } from 'lucide-react';

const CreditsBanner = () => {
  const { profile, getDaysUntilExpiry, getFreemiumLimits } = useCredits();
  const navigate = useNavigate();

  if (!profile) return null;

  const daysUntilExpiry = getDaysUntilExpiry();
  const freemiumLimits = getFreemiumLimits();

  if (profile.is_premium) {
    return (
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-6 w-6 text-yellow-400" />
            <div>
              <p className="text-white font-semibold">
                You're in your Premium Period! 🎉
              </p>
              <p className="text-gray-300 text-sm">
                Credits: {profile.credits} | Expires in {daysUntilExpiry} days
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-medium">{profile.credits}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-gray-400" />
          <div>
            <p className="text-white font-semibold">
              You're on the Freemium Plan
            </p>
            <p className="text-gray-300 text-sm">
              Memory saves: {freemiumLimits.usedMemorySaves}/{freemiumLimits.maxMemorySaves} | 
              AI searches: {freemiumLimits.usedAiSearches}/{freemiumLimits.maxAiSearches}
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/upgrade')}
          className="bg-purple-primary hover:bg-purple-secondary"
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  );
};

export default CreditsBanner;
