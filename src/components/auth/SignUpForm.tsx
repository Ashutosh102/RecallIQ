
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { validatePassword } from '@/lib/passwordValidation';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { Loader2, Eye, EyeOff, Mail, Lock, User, UserCircle } from 'lucide-react';

interface SignUpFormProps {
  onSubmit: (e: React.FormEvent, data: { email: string; password: string; firstName: string; lastName: string }) => void;
  onOTPRequired: (email: string, formData: any) => void;
  isLoading: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, onOTPRequired, isLoading }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Password validation failed",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    // Call onOTPRequired to trigger email verification before sign up
    onOTPRequired(email, { email, password, firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white flex items-center gap-2">
            <User className="h-4 w-4" />
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm focus:bg-white/15 focus:border-purple-primary/50 transition-all duration-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm focus:bg-white/15 focus:border-purple-primary/50 transition-all duration-300"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm focus:bg-white/15 focus:border-purple-primary/50 transition-all duration-300"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm focus:bg-white/15 focus:border-purple-primary/50 transition-all duration-300 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrengthIndicator password={password} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm focus:bg-white/15 focus:border-purple-primary/50 transition-all duration-300 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-sm text-red-400 mt-1">Passwords don't match</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-purple hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Creating Account...
          </>
        ) : (
          'Sign Up'
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
