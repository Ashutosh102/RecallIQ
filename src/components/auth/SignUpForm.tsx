
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

interface SignUpFormProps {
  onSubmit: (e: React.FormEvent, data: { email: string; password: string; firstName: string; lastName: string }) => void;
  isLoading: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-firstname" className="text-white flex items-center gap-2">
            <User className="h-4 w-4" />
            First Name
          </Label>
          <Input
            id="signup-firstname"
            type="text"
            placeholder="First name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm focus:bg-white/15 focus:border-purple-primary/50 transition-all duration-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-lastname" className="text-white flex items-center gap-2">
            <User className="h-4 w-4" />
            Last Name
          </Label>
          <Input
            id="signup-lastname"
            type="text"
            placeholder="Last name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm focus:bg-white/15 focus:border-purple-primary/50 transition-all duration-300"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-white flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm focus:bg-white/15 focus:border-purple-primary/50 transition-all duration-300"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-white flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
          'Create Account'
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
