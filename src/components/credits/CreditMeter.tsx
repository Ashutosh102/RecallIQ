import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Zap, Crown, Sparkles } from 'lucide-react';

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
    color: "from-purple-400 to-pink-400",
    position: 50,
    value: 1,
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
    color: "from-yellow-400 to-orange-400",
    position: 100,
    value: 2
  }
];

interface CreditMeterProps {
  selectedPackage: {
    credits: number;
    price: number;
    title: string;
    description: string;
    features: string[];
    icon: any;
    popular?: boolean;
    color: string;
    position: number;
    value: number;
  };
  onPackageChange: (pkg: {
    credits: number;
    price: number;
    title: string;
    description: string;
    features: string[];
    icon: any;
    popular?: boolean;
    color: string;
    position: number;
    value: number;
  }) => void;
}

const CreditMeter = ({ selectedPackage, onPackageChange }: CreditMeterProps) => {
  const [meterPosition, setMeterPosition] = useState(50);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const pkg = CREDIT_PACKAGES.find(p => p.credits === selectedPackage.credits) || CREDIT_PACKAGES[1];
    setMeterPosition(pkg.position);
  }, [selectedPackage]);

  const handleMeterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    // Snap to nearest checkpoint
    let nearestPackage = CREDIT_PACKAGES[0];
    let minDistance = Math.abs(percentage - CREDIT_PACKAGES[0].position);
    
    CREDIT_PACKAGES.forEach(pkg => {
      const distance = Math.abs(percentage - pkg.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPackage = pkg;
      }
    });
    
    setIsAnimating(true);
    setMeterPosition(nearestPackage.position);
    onPackageChange(nearestPackage);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleCheckpointClick = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setIsAnimating(true);
    setMeterPosition(pkg.position);
    onPackageChange(pkg);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Meter Track */}
      <div 
        className="relative h-20 bg-gradient-to-r from-dark-secondary/30 via-dark-secondary/50 to-dark-secondary/30 rounded-full border border-white/10 cursor-pointer overflow-hidden group"
        onClick={handleMeterClick}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Progress fill */}
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-primary/30 to-teal-accent/30 rounded-full"
          initial={{ width: "50%" }}
          animate={{ width: `${meterPosition}%` }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            duration: 0.5 
          }}
        />
        
        {/* Meter handle */}
        <motion.div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-16 h-16 z-10"
          initial={{ left: "50%" }}
          animate={{ left: `${meterPosition}%` }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            duration: 0.5 
          }}
        >
          <div className={`w-full h-full rounded-full bg-gradient-to-r ${selectedPackage.color} shadow-2xl border-4 border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <selectedPackage.icon className="w-6 h-6 text-white drop-shadow-lg" />
            
            {/* Pulsing glow effect */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${selectedPackage.color} opacity-50 animate-ping`}></div>
          </div>
        </motion.div>
        
        {/* Checkpoint indicators */}
        {CREDIT_PACKAGES.map((pkg, index) => (
          <div
            key={pkg.credits}
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 cursor-pointer group/checkpoint"
            style={{ left: `${pkg.position}%` }}
            onClick={(e) => {
              e.stopPropagation();
              handleCheckpointClick(pkg);
            }}
          >
            <div className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
              selectedPackage.credits === pkg.credits 
                ? 'bg-white border-white shadow-lg scale-125' 
                : 'bg-white/30 border-white/50 group-hover/checkpoint:bg-white/50 group-hover/checkpoint:scale-110'
            }`}>
              {selectedPackage.credits === pkg.credits && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-full bg-gradient-to-r from-purple-primary to-teal-accent flex items-center justify-center"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>
            
            {/* Checkpoint label */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
              <div className={`text-xs font-medium transition-colors duration-300 ${
                selectedPackage.credits === pkg.credits ? 'text-white' : 'text-gray-400'
              }`}>
                {pkg.credits}
              </div>
              <div className="text-xs text-gray-500">credits</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Package info display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPackage.credits}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedPackage.color} flex items-center justify-center`}>
              <selectedPackage.icon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{selectedPackage.title}</h3>
            {selectedPackage.popular && (
              <div className="px-2 py-1 bg-gradient-to-r from-purple-primary to-pink-500 rounded-full text-xs font-medium text-white">
                Most Popular
              </div>
            )}
          </div>
          <p className="text-gray-300 mb-4">{selectedPackage.description}</p>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">₹{selectedPackage.price}</div>
              <div className="text-sm text-gray-400">Total Price</div>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-primary to-teal-accent bg-clip-text text-transparent">
                {selectedPackage.credits}
              </div>
              <div className="text-sm text-gray-400">Credits</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CreditMeter;