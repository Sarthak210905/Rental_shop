
"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { AppUser } from '@/lib/services/userService';

type AuthContextType = {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, appUser: null, loading: true, isAdmin: false });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (user) {
        setLoading(true);
        const userDocRef = doc(db, "users", user.uid);
        
        // Use onSnapshot for real-time updates to user roles or profile data
        const unsubUserDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data() as AppUser;
                setAppUser(userData);
                setIsAdmin(userData.role === 'admin');
            } else {
                // Handle case where user exists in Auth but not in Firestore
                setAppUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });
        
        return () => unsubUserDoc(); // Cleanup snapshot listener

      } else {
        // No user logged in
        setAppUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup auth state listener
  }, []);

  return (
    <AuthContext.Provider value={{ user, appUser, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useRequireAuth = (redirectUrl = '/login') => {
    const authData = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authData.loading && !authData.user) {
            router.push(redirectUrl);
        }
    }, [authData.user, authData.loading, router, redirectUrl]);

    return authData;
}
