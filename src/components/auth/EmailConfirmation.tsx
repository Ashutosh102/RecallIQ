
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface EmailConfirmationProps {
  email: string;
  onBack: () => void;
}

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({ email, onBack }) => {
  const [isResending, setIsResending] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      // Trigger a new sign up to resend confirmation email
      const { error } = await signUp(email, '');
      
      if (error && !error.message.includes('already registered')) {
        toast({
          title: "Failed to resend confirmation",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Confirmation email sent",
          description: "Please check your email for the confirmation link.",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass-card border-white/20 backdrop-blur-xl bg-dark-bg/20 animate-scale-in glow-effect">
      <CardHeader className="text-center relative">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center animate-glow">
            <Mail className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-poppins gradient-text mt-4 animate-fade-in">
          Check Your Email
        </CardTitle>
        <CardDescription className="text-gray-300 animate-fade-in delay-200">
          We've sent a confirmation link to your email address
        </CardDescription>
      </CardHeader>
      
      <CardContent className="animate-fade-in delay-300 space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
            <div className="flex items-center justify-center space-x-2 text-white mb-2">
              <Mail className="h-4 w-4" />
              <span className="font-medium">{email}</span>
            </div>
            <p className="text-sm text-gray-300">
              Click the confirmation link in the email to activate your account.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-teal-accent">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Didn't receive the email? Check your spam folder</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">This page will automatically update once confirmed</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleResendConfirmation}
            disabled={isResending}
            className="w-full bg-gradient-purple hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend Confirmation Email
              </>
            )}
          </Button>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full bg-white/10 border-white/30 text-white hover:bg-white/15 hover:border-white/50 transition-all duration-300"
          >
            Back to Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailConfirmation;
