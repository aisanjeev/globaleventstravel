"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth.store";

export function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { login, logout, setHasHydrated } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        login({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        logout();
      }
      setHasHydrated(true);
    });

    return unsubscribe;
  }, [login, logout, setHasHydrated]);

  return <>{children}</>;
}
