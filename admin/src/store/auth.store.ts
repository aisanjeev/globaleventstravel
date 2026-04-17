"use client";

import { create } from "zustand";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  _hasHydrated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    signOut(auth).catch(() => {});
    set({ user: null, isAuthenticated: false });
  },
  setHasHydrated: (state) => set({ _hasHydrated: state }),
}));
