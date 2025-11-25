
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string; // Base64 or URL
  role: string;
}

interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  notifications: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
}

interface UserState {
  profile: UserProfile;
  preferences: UserPreferences;
  
  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: {
        name: 'Guest User',
        email: '',
        role: 'Explorer'
      },
      preferences: {
        theme: 'dark',
        notifications: true,
        soundEnabled: true,
        autoSave: true,
      },

      updateProfile: (updates) => set((state) => ({ 
        profile: { ...state.profile, ...updates } 
      })),

      updatePreferences: (updates) => set((state) => ({ 
        preferences: { ...state.preferences, ...updates } 
      })),
    }),
    {
      name: 'jirai-user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
