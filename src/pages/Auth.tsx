
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AuthBackground from '@/components/auth/AuthBackground';
import AuthCard from '@/components/auth/AuthCard';
import EmailConfirmation from '@/components/auth/EmailConfirmation';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const { signIn, signUp, user, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && session) {
      navigate('/dashboard');
    }
  }, [user, session, navigate]);

  const handleSignIn = async (e: React.FormEvent, data: { email: string; password: string }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setPendingEmail(data.email);
          setShowEmailConfirmation(true);
          toast({
            title: "Email not confirmed",
            description: "Please check your email and click the confirmation link.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent, data: { email: string; password: string; firstName: string; lastName: string }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signUp(data.email, data.password, data.firstName, data.lastName);
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setPendingEmail(data.email);
        setShowEmailConfirmation(true);
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToAuth = () => {
    setShowEmailConfirmation(false);
    setPendingEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground />
      {showEmailConfirmation ? (
        <EmailConfirmation 
          email={pendingEmail}
          onBack={handleBackToAuth}
        />
      ) : (
        <AuthCard 
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Auth;
