
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onVerified, onBack }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Start countdown for resend button
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSendOTP = async () => {
    setIsResending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${email}`,
      });

      // For testing purposes, show the OTP in console
      if (data?.otp) {
        console.log('OTP for testing:', data.otp);
        toast({
          title: "Testing Mode",
          description: `OTP: ${data.otp} (Check console for details)`,
          variant: "default",
        });
      }

      // Reset countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, otp }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified!",
        });
        onVerified();
      } else {
        toast({
          title: "Verification Failed",
          description: data?.error || "Invalid verification code",
          variant: "destructive",
        });
        setOtp('');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  // Send OTP when component mounts
  useEffect(() => {
    handleSendOTP();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">Check your email</h3>
        <p className="text-gray-300 text-sm">
          We sent a verification code to <br />
          <span className="font-medium text-white">{email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white text-center block">Enter verification code</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="bg-white/10 border-white/30 text-white" />
                <InputOTPSlot index={1} className="bg-white/10 border-white/30 text-white" />
                <InputOTPSlot index={2} className="bg-white/10 border-white/30 text-white" />
                <InputOTPSlot index={3} className="bg-white/10 border-white/30 text-white" />
                <InputOTPSlot index={4} className="bg-white/10 border-white/30 text-white" />
                <InputOTPSlot index={5} className="bg-white/10 border-white/30 text-white" />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          onClick={handleVerifyOTP}
          disabled={otp.length !== 6 || isVerifying}
          className="w-full bg-gradient-purple hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">Didn't receive the code?</p>
          <Button
            variant="ghost"
            onClick={handleSendOTP}
            disabled={countdown > 0 || isResending}
            className="text-purple-primary hover:text-purple-primary/80 text-sm"
          >
            {isResending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Resend Code
              </>
            )}
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full text-gray-400 hover:text-white"
        >
          ← Back to Sign Up
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
