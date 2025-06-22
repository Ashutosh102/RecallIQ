
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/use-toast';
import CreditsUpgrade from '@/components/credits/CreditsUpgrade';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Razorpay types
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Upgrade = () => {
  const [loading, setLoading] = useState(false);
  const { profile } = useCredits();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpgrade = async (credits: number, price: number) => {
    if (!profile) return;

    // Check if user is still in premium period
    if (profile.is_premium) {
      toast({
        title: "Premium period active",
        description: "You can't purchase credits during your premium period. Enjoy your free credits!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create order on backend (you'll need to implement this)
      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price * 100, // Razorpay expects amount in paisa
          currency: 'INR',
          receipt: `credit_purchase_${Date.now()}`,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error('Failed to create order');
      }

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key
        amount: price * 100,
        currency: 'INR',
        name: 'RecallIQ',
        description: `${credits} Credits Purchase`,
        order_id: orderData.order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/verify-razorpay-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...response,
                credits,
                user_id: profile.id,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast({
                title: "Payment successful!",
                description: `${credits} credits have been added to your account.`,
              });
              navigate('/dashboard');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast({
              title: "Payment verification failed",
              description: "Please contact support if credits weren't added.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          email: 'user@example.com', // You'll need to get this from auth context
        },
        theme: {
          color: '#8B5CF6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <div className="bg-dark-bg/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-poppins font-bold gradient-text">RecallIQ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <CreditsUpgrade onUpgrade={handleUpgrade} loading={loading} />
      </div>
    </div>
  );
};

export default Upgrade;
