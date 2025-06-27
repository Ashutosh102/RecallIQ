import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Zap, Star, Crown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-dark-secondary/50">
      <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
       <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold mb-6 gradient-text">Our Pricing</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Choose the perfect plan for your needs
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {CREDIT_PACKAGES.map((pkg) => {
          const Icon = pkg.icon;
          
          return (
            <Card 
              key={pkg.credits}
              className={`relative transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                pkg.popular 
                  ? 'bg-gradient-purple hover:opacity-90 hover:shadow-lg hover:shadow-purple-primary/30 transition-all duration-300 ring-2 ring-purple-primary bg-gradient-to-br from-purple-primary/10 to-teal-accent/5 shadow-lg shadow-purple-primary/20'
                  : 'bg-white/20 border-white/40 hover:bg-white/30 hover:border-white/60'
              } ${pkg.popular ? 'border-purple-primary' : ''}`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-primary">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center ${pkg.popular ? 'bg-gradient-purple' : 'bg-white/30'}`}>
                  <Icon className={`h-6 w-6 ${pkg.popular ? 'text-white' : 'text-purple-200'}`} />
                </div>
                <CardTitle className={`${pkg.popular ? 'text-white' : 'text-white/90'} text-xl`}>{pkg.title}</CardTitle>
                <CardDescription className={`${pkg.popular ? 'text-gray-400' : 'text-gray-400/90'}`}>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <span className={`text-3xl font-bold ${pkg.popular ? 'text-white' : 'text-white/90'}`}>₹{pkg.price}</span>
                  <span className={`${pkg.popular ? 'text-gray-400' : 'text-gray-400/90'} ml-2`}>for {pkg.credits} credits</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <Check className={`h-4 w-4 ${pkg.popular ? 'text-green-400' : 'text-green-400/80'} mr-2 flex-shrink-0`} />
                      <span className={`text-sm ${pkg.popular ? 'text-gray-300' : 'text-gray-300/90'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Go to Dashboard Button */}
      <div className="text-center mt-8">
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-gradient-purple hover:opacity-90 hover:shadow-lg hover:shadow-purple-primary/30 transition-all duration-300 text-white px-8 py-3 text-lg"
          size="lg"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
    </section>
  );
};

export default PricingSection;