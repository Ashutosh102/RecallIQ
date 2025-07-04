
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Zap, Crown, Check, Sparkles, Star } from 'lucide-react';
import CreditMeter from './CreditMeter';

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
    popular: false,
    color: "from-blue-400 to-cyan-400",
    position: 0,
    value: 0
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
    popular: true,
    color: "from-purple-400 to-pink-400",
    position: 50,
    value: 1
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
    popular: false,
    color: "from-yellow-400 to-orange-400",
    position: 100,
    value: 2
  }
];

interface CreditsUpgradeProps {
  onUpgrade: (credits: number, price: number) => void;
  loading?: boolean;
}

const CreditsUpgrade = ({ onUpgrade, loading = false }: CreditsUpgradeProps) => {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]); // Default to Power User

  const handlePackageChange = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelectedPackage(pkg);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">Upgrade Your Credits</h1>
            <Sparkles className="w-8 h-8 text-teal-400" />
          </motion.div>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Choose the perfect credit package for your AI-powered memory journey
          </motion.p>
        </motion.div>

        {/* Credit Meter */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="glass-card p-8 mb-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-2">Interactive Credit Selector</h3>
              <p className="text-gray-400">Drag the meter or click on checkpoints to select your package</p>
            </div>
            <CreditMeter 
              selectedPackage={selectedPackage}
              onPackageChange={handlePackageChange}
            />
          </div>
        </motion.div>

        {/* Package Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {CREDIT_PACKAGES.map((pkg, index) => {
            const Icon = pkg.icon;
            const isSelected = selectedPackage.credits === pkg.credits;
            
            return (
              <motion.div
                key={pkg.credits}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                onClick={() => handlePackageChange(pkg)}
              >
                <Card 
                  className={`relative transition-all duration-500 cursor-pointer h-full ${
                    isSelected 
                      ? 'glass-card-selected ring-2 ring-purple-primary/50 shadow-2xl shadow-purple-primary/20' 
                      : 'glass-card hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {pkg.popular && (
                    <motion.div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Badge className="bg-gradient-to-r from-purple-primary to-pink-500 text-white px-4 py-1 shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </motion.div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center relative ${
                        isSelected ? `bg-gradient-to-r ${pkg.color}` : 'bg-white/10'
                      }`}
                      animate={isSelected ? { rotate: 360 } : {}}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <Icon className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-gray-300'}`} />
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </motion.div>
                    
                    <CardTitle className={`text-2xl mb-2 ${isSelected ? 'text-white' : 'text-white/90'}`}>
                      {pkg.title}
                    </CardTitle>
                    <CardDescription className={`${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {pkg.description}
                    </CardDescription>
                    
                    <div className="mt-6 space-y-2">
                      <div className={`text-4xl font-bold ${isSelected ? 'text-white' : 'text-white/90'}`}>
                        ₹{pkg.price}
                      </div>
                      <div className={`text-lg ${isSelected ? 'gradient-text' : 'text-gray-400'}`}>
                        {pkg.credits} credits
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-center text-gray-300"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + featureIndex * 0.1 }}
                        >
                          <Check className={`h-4 w-4 mr-3 flex-shrink-0 ${
                            isSelected ? 'text-green-400' : 'text-green-400/70'
                          }`} />
                          <span className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-300'}`}>
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Purchase Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.div 
            className="mb-8 p-6 glass-card-selected inline-block shadow-2xl shadow-purple-primary/30 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl font-semibold gradient-text mb-4">Selected Package Summary</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <motion.div 
                  className="flex items-center justify-center mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Coins className="h-6 w-6 text-purple-400 mr-2" />
                  <p className="text-3xl font-bold gradient-text">{selectedPackage.credits}</p>
                </motion.div>
                <p className="text-sm text-gray-400">Credits</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-2">₹{selectedPackage.price}</p>
                <p className="text-sm text-gray-400">Total Price</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={() => onUpgrade(selectedPackage.credits, selectedPackage.price)}
              className="bg-gradient-to-r from-purple-primary to-teal-accent hover:from-purple-primary/90 hover:to-teal-accent/90 text-white px-12 py-4 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-purple-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <motion.div
                  className="flex items-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6 mr-3" />
                  Processing...
                </motion.div>
              ) : (
                <div className="flex items-center">
                  <Coins className="h-6 w-6 mr-3" />
                  Purchase {selectedPackage.credits} Credits for ₹{selectedPackage.price}
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreditsUpgrade;
