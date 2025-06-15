
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import OTPVerification from './OTPVerification';

interface AuthCardProps {
  onSignIn: (e: React.FormEvent, data: { email: string; password: string }) => void;
  onSignUp: (e: React.FormEvent, data: { email: string; password: string; firstName: string; lastName: string }) => void;
  isLoading: boolean;
}

const AuthCard: React.FC<AuthCardProps> = ({ onSignIn, onSignUp, isLoading }) => {
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingSignUpData, setPendingSignUpData] = useState<any>(null);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleOTPRequired = (email: string, formData: any) => {
    setPendingSignUpData(formData);
    setVerificationEmail(email);
    setShowOTPVerification(true);
  };

  const handleOTPVerified = () => {
    if (pendingSignUpData) {
      // Create a mock event and call the original signup function
      const mockEvent = { preventDefault: () => {} } as React.FormEvent;
      onSignUp(mockEvent, pendingSignUpData);
      
      // Reset state
      setShowOTPVerification(false);
      setPendingSignUpData(null);
      setVerificationEmail('');
    }
  };

  const handleBackToSignUp = () => {
    setShowOTPVerification(false);
    setPendingSignUpData(null);
    setVerificationEmail('');
  };

  return (
    <Card className="w-full max-w-md glass-card border-white/20 backdrop-blur-xl bg-dark-bg/20 animate-scale-in glow-effect">
      <CardHeader className="text-center relative">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center animate-glow">
            <Brain className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-poppins gradient-text mt-4 animate-fade-in">
          Welcome to RecallIQ
        </CardTitle>
        <CardDescription className="text-gray-300 animate-fade-in delay-200">
          <Sparkles className="inline h-4 w-4 mr-1" />
          Your AI-powered memory assistant
        </CardDescription>
      </CardHeader>
      
      <CardContent className="animate-fade-in delay-300">
        {showOTPVerification ? (
          <OTPVerification 
            email={verificationEmail}
            onVerified={handleOTPVerified}
            onBack={handleBackToSignUp}
          />
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20">
              <TabsTrigger 
                value="signin" 
                className="text-white data-[state=active]:bg-gradient-purple data-[state=active]:text-white transition-all duration-300"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="text-white data-[state=active]:bg-gradient-purple data-[state=active]:text-white transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-6 mt-8 animate-fade-in">
              <SignInForm onSubmit={onSignIn} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-6 mt-8 animate-fade-in">
              <SignUpForm 
                onSubmit={onSignUp} 
                onOTPRequired={handleOTPRequired}
                isLoading={isLoading} 
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthCard;
