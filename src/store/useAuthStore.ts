import { create } from 'zustand';

interface User {
  id: string;
  email: string | null;
  minecraftUsername?: string;
  role?: string;
  createdAt?: string;
  totalSpent?: number;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isAdminLoggedIn: false,
  setAdminLoggedIn: (status) => set({ isAdminLoggedIn: status }),
}));
