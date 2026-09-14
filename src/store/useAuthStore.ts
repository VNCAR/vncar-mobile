import { create } from 'zustand';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export type UserRole = 'customer' | 'driver';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  role: UserRole;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Initial state is loading until Firebase restores the session
  role: 'customer',
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setRole: (role) => set({ role }),
}));
