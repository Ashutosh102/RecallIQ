import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Camera, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

interface UserPreferences {
  theme: string;
  notifications: boolean;
  privacy: string;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onClose, anchorRef }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
    email: ''
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    notifications: true,
    privacy: 'public'
  });
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) && 
          anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          avatar_url: data.avatar_url || '',
          email: user?.email || ''
        });
        
        // Safely parse preferences with proper typing
        try {
          const userPreferences = data.preferences as unknown as UserPreferences;
          if (userPreferences && typeof userPreferences === 'object') {
            setPreferences({
              theme: userPreferences.theme || 'dark',
              notifications: userPreferences.notifications ?? true,
              privacy: userPreferences.privacy || 'public'
            });
          } else {
            setPreferences({
              theme: 'dark',
              notifications: true,
              privacy: 'public'
            });
          }
        } catch {
          setPreferences({
            theme: 'dark',
            notifications: true,
            privacy: 'public'
          });
        }
      } else {
        // Create profile if it doesn't exist
        const defaultPreferences = {
          theme: 'dark',
          notifications: true,
          privacy: 'public'
        };

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user?.id,
              first_name: '',
              last_name: '',
              avatar_url: '',
              preferences: defaultPreferences as any
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        setProfile(newProfile);
        setPreferences(defaultPreferences);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          avatar_url: formData.avatar_url,
          preferences: preferences as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      setProfile({ ...profile, ...formData, preferences });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const getInitials = () => {
    const first = formData.first_name || user?.email?.charAt(0) || '';
    const last = formData.last_name?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-4">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div 
        ref={popupRef}
        className="relative w-96 glass-card p-6 animate-slide-in-bottom shadow-2xl border border-white/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-primary/10 to-teal-accent/10 rounded-xl" />
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold gradient-text">Profile</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <Avatar className="h-20 w-20 border-2 border-white/20">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback className="bg-gradient-purple text-white text-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-primary hover:bg-purple-primary/80"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {!isEditing ? (
              <div className="text-center">
                <p className="text-lg font-medium text-white">
                  {formData.first_name || formData.last_name 
                    ? `${formData.first_name} ${formData.last_name}`.trim()
                    : 'User'
                  }
                </p>
                <p className="text-sm text-gray-300">{user?.email}</p>
              </div>
            ) : (
              <div className="w-full space-y-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full glass-input text-white placeholder-gray-400 px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full glass-input text-white placeholder-gray-400 px-3 py-2"
                />
                <input
                  type="url"
                  placeholder="Avatar URL"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                  className="w-full glass-input text-white placeholder-gray-400 px-3 py-2"
                />
              </div>
            )}
          </div>

          {/* Profile Actions */}
          <div className="space-y-3 mb-6">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                variant="outline"
              >
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-gradient-purple hover:opacity-90"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Logout Button */}
          {!isEditing && (
            <Button
              onClick={handleLogout}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
              variant="outline"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
