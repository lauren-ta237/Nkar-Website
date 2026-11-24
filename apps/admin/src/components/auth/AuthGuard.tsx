import React, { useEffect, useState } from 'react';
import { getToken, subscribe, clearToken } from '@/lib/auth-token';
import { useMe, normalizeAuthUser } from '@/lib/api/auth.api';
import { useAdminStore } from '@/store/useAdminStore';
import { LoginView } from './LoginView';
import { Loader2, Crown } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const { setCurrentUser } = useAdminStore();

  // Subscribe to token changes (e.g. from axios 401 or login/logout)
  useEffect(() => {
    const unsubscribe = subscribe((newToken) => {
      setTokenState(newToken);
    });
    return unsubscribe;
  }, []);

  const { data: user, isLoading, isError, error } = useMe({
    enabled: Boolean(token),
    retry: 1,
  });

  // Sync authenticated user into global store
  useEffect(() => {
    if (user) {
      setCurrentUser(normalizeAuthUser(user));
    }
  }, [user, setCurrentUser]);

  // Only clear token on explicit 401 authentication failure
  useEffect(() => {
    const status = (error as (Error & { status?: number | null }) | null)?.status;
    if (isError && token && status === 401) {
      clearToken();
      setTokenState(null);
    }
  }, [isError, error, token]);

  // 1. If no token is present, user must sign in
  if (!token) {
    return <LoginView />;
  }

  // 2. Token exists and currently validating / fetching /me
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F281E] flex flex-col items-center justify-center p-6 text-stone-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-black/60 border-2 border-[#D4AF37] p-2 flex items-center justify-center shadow-2xl relative">
            <img
              src="/assets/logo.jpeg"
              alt="Nkar Crest"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <Crown className="w-6 h-6 text-[#D4AF37] absolute" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold tracking-wider text-[#D4AF37] uppercase">
              Nkar Woo Làn Palace
            </h3>
            <p className="text-xs text-stone-400">
              Verifying administrative credentials & permissions...
            </p>
          </div>

          <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // 3. Token exists and authenticated
  return <>{children}</>;
};
