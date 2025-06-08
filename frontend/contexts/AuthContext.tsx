'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  userId: number | null;
}

const AuthContext = createContext<AuthContextType>({ userId: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false); // 👈 NEW

  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored) {
      setUserId(parseInt(stored));
    }
    setMounted(true); // 👈 Đánh dấu đã mount client
  }, []);

  // Tránh render khi SSR để tránh hydration mismatch
  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
