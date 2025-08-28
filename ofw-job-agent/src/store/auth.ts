import { create } from 'zustand';
import type { Application } from '../types/models';

export type AuthState = {
  isSignedIn: boolean;
  userId?: string;
  applications: Application[];
  signIn: (userId: string) => void;
  signOut: () => void;
  addApplication: (application: Application) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: false,
  userId: 'u1',
  applications: [],
  signIn: (userId: string) => set({ isSignedIn: true, userId }),
  signOut: () => set({ isSignedIn: false }),
  addApplication: (application: Application) => set((state) => ({
    applications: [application, ...state.applications],
  })),
}));