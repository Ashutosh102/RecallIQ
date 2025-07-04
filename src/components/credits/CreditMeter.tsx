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

  // Handle both mouse and touch events for better mobile experience
  const handleMeterInteraction = (clientX: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    const interactionX = clientX - rect.left;
    const percentage = (interactionX / rect.width) * 100;
    
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

  const handleMeterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMeterInteraction(e.clientX, e.currentTarget);
  };
  
  const handleMeterTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    // Prevent scrolling while touching the meter
    e.preventDefault();
    const touch = e.touches[0];
    handleMeterInteraction(touch.clientX, e.currentTarget);
  };

  const handleCheckpointClick = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setIsAnimating(true);
    setMeterPosition(pkg.position);
    onPackageChange(pkg);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
      {/* Meter Track Container */}
      <div className="relative mb-16 sm:mb-20 md:mb-24">
        {/* Meter Track */}
        <div 
          className="relative h-12 sm:h-14 md:h-16 lg:h-20 bg-gradient-to-r from-dark-secondary/30 via-dark-secondary/50 to-dark-secondary/30 rounded-full border border-white/10 cursor-pointer overflow-hidden group mx-2 sm:mx-4 md:mx-8"
          onClick={handleMeterClick}
          onTouchStart={handleMeterTouch}
          onTouchMove={handleMeterTouch}
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
          
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
            className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 z-10"
            initial={{ left: "50%" }}
            animate={{ left: `${meterPosition}%` }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 20,
              duration: 0.5 
            }}
            style={{ 
              marginLeft: meterPosition === 0 ? '0px' : meterPosition === 100 ? '-32px' : '-16px'
            }}
          >
            <div className={`w-full h-full rounded-full bg-gradient-to-r ${selectedPackage.color} shadow-2xl border-2 sm:border-3 md:border-4 border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <selectedPackage.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white drop-shadow-lg" />
              
              {/* Pulsing glow effect */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${selectedPackage.color} opacity-50 animate-ping`}></div>
            </div>
          </motion.div>
          
          {/* Checkpoint indicators */}
          {CREDIT_PACKAGES.map((pkg, index) => {
            // Calculate safe positions to prevent overflow
            const safePosition = pkg.position === 0 ? 8 : pkg.position === 100 ? 92 : pkg.position;
            
            return (
              <div
                key={pkg.credits}
                className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer group/checkpoint z-20"
                style={{ 
                  left: `${safePosition}%`,
                  marginLeft: pkg.position === 0 ? '0px' : pkg.position === 100 ? '-16px' : '-8px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckpointClick(pkg);
                }}
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full border-2 transition-all duration-300 ${
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
                      <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 text-white" />
                    </motion.div>
                  )}
                </div>
                
                {/* Checkpoint label */}
                <div className="absolute top-full mt-4 sm:mt-6 md:mt-8 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                  <div className={`text-xs sm:text-sm md:text-base font-medium transition-colors duration-300 ${
                    selectedPackage.credits === pkg.credits ? 'text-white' : 'text-gray-400'
                  }`}>
                    {pkg.credits}
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">credits</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Package info display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPackage.credits}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center px-2 sm:px-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-4">
            <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r ${selectedPackage.color} flex items-center justify-center`}>
              <selectedPackage.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center sm:text-left">{selectedPackage.title}</h3>
            {selectedPackage.popular && (
              <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-purple-primary to-pink-500 rounded-full text-[10px] sm:text-xs font-medium text-white">
                Most Popular
              </div>
            )}
          </div>
          <p className="text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base max-w-md mx-auto">{selectedPackage.description}</p>
          <div className="flex flex-row items-center justify-center space-x-6 sm:space-x-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">₹{selectedPackage.price}</div>
              <div className="text-xs sm:text-sm text-gray-400">Total Price</div>
            </div>
            <div className="block w-px h-8 sm:h-10 md:h-12 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-primary to-teal-accent bg-clip-text text-transparent">
                {selectedPackage.credits}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Credits</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CreditMeter;