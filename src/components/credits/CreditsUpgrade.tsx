
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Zap, Star, Crown, Check } from 'lucide-react';

const CREDIT_PACKAGES = [
  {
    credits: 100,
    price: 49,
    title: "Starter Pack",
    description: "Perfect for light usage",
    features: [
      "100 Memory saves",
      "33 Memory saves with media",
      "50 AI searches",
      "Valid for 6 months"
    ],
    icon: Coins,
    popular: false
  },
  {
    credits: 500,
    price: 199,
    title: "Power User",
    description: "Great for regular users",
    features: [
      "500 Memory saves",
      "166 Memory saves with media",
      "250 AI searches",
      "Valid for 12 months",
      "Priority support"
    ],
    icon: Zap,
    popular: true
  },
  {
    credits: 1000,
    price: 349,
    title: "Pro Bundle",
    description: "For heavy users & teams",
    features: [
      "1000 Memory saves",
      "333 Memory saves with media",
      "500 AI searches",
      "Valid for 18 months",
      "Priority support",
      "Advanced AI insights"
    ],
    icon: Crown,
    popular: false
  }
];

interface CreditsUpgradeProps {
  onUpgrade: (credits: number, price: number) => void;
  loading?: boolean;
}

const CreditsUpgrade = ({ onUpgrade, loading = false }: CreditsUpgradeProps) => {
  const [selectedCredits, setSelectedCredits] = useState([500]);

  const getSelectedPackage = () => {
    const credits = selectedCredits[0];
    return CREDIT_PACKAGES.find(pkg => pkg.credits === credits) || CREDIT_PACKAGES[1];
  };

  const handleSliderChange = (value: number[]) => {
    setSelectedCredits(value);
  };

  const selectedPackage = getSelectedPackage();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-4">Upgrade Your Credits</h1>
        <p className="text-gray-300 text-lg">
          Choose the perfect credit package for your needs
        </p>
      </div>

      {/* Credit Slider */}
      <div className="mb-8 p-6 glass-card">
        <h3 className="text-xl font-semibold text-white mb-4">Select Your Package</h3>
        <div className="space-y-4">
          <Slider
            value={selectedCredits}
            onValueChange={handleSliderChange}
            min={100}
            max={1000}
            step={1}
            className="w-full"
            // Custom styling for the slider to show package stops
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>100 Credits</span>
            <span>500 Credits</span>
            <span>1000 Credits</span>
          </div>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {CREDIT_PACKAGES.map((pkg) => {
          const Icon = pkg.icon;
          const isSelected = selectedCredits[0] === pkg.credits;
          
          return (
            <Card 
              key={pkg.credits}
              className={`relative transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                isSelected 
                  ? 'bg-gradient-purple hover:opacity-90 hover:shadow-lg hover:shadow-purple-primary/30 transition-all duration-300 ring-2 ring-purple-primary bg-gradient-to-br from-purple-primary/10 to-teal-accent/5 shadow-lg shadow-purple-primary/20' 
                  : 'bg-white/20 border-white/40 hover:bg-white/30 hover:border-white/60'
              } ${pkg.popular ? 'border-purple-primary' : ''}`}
              onClick={() => setSelectedCredits([pkg.credits])}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-primary">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? 'bg-gradient-purple' : 'bg-white/30'}`}>
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-purple-200'}`} />
                </div>
                <CardTitle className={`${isSelected ? 'text-white' : 'text-white/90'} text-xl`}>{pkg.title}</CardTitle>
                <CardDescription className={`${isSelected ? 'text-gray-400' : 'text-gray-400/90'}`}>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <span className={`text-3xl font-bold ${isSelected ? 'text-white' : 'text-white/90'}`}>₹{pkg.price}</span>
                  <span className={`${isSelected ? 'text-gray-400' : 'text-gray-400/90'} ml-2`}>for {pkg.credits} credits</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <Check className={`h-4 w-4 ${isSelected ? 'text-green-400' : 'text-green-400/80'} mr-2 flex-shrink-0`} />
                      <span className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-300/90'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Purchase Button */}
      <div className="text-center">
        <div className="mb-4 p-4 glass-card-selected inline-block shadow-lg shadow-purple-primary/20 transform transition-all duration-300">
          <h3 className="text-lg font-semibold gradient-text mb-2">Selected Package</h3>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Coins className="h-5 w-5 text-purple-400 mr-2" />
                <p className="text-2xl font-bold text-purple-400">{selectedPackage.credits}</p>
              </div>
              <p className="text-sm text-gray-400">Credits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">₹{selectedPackage.price}</p>
              <p className="text-sm text-gray-400">Total Price</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => onUpgrade(selectedPackage.credits, selectedPackage.price)}
          className="bg-gradient-purple hover:opacity-90 hover:shadow-lg hover:shadow-purple-primary/30 transition-all duration-300 text-white px-8 py-3 text-lg"
          disabled={loading}
          size="lg"
        >
          <Coins className="h-5 w-5 mr-2" />
          {loading ? 'Processing...' : `Purchase ${selectedPackage.credits} Credits for ₹${selectedPackage.price}`}
        </Button>
      </div>
    </div>
  );
};

export default CreditsUpgrade;
