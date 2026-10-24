// AuthContext.tsx
//
// Stub authentication context — placeholder state and handlers.
// For actual integration, inject dependencies as props or via hooks.

import React, { createContext, useState, useContext } from "react";
import type { AuthUser } from "@/lib/api/auth.api";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isLoadingPublicSettings: boolean;
  authError: string | null;
  authChecked: boolean;
  appPublicSettings: { id: string; public_settings: unknown } | null;
  checkAppState: () => Promise<void>;
  checkUserAuth: () => Promise<void>;
  logout: (shouldRedirect?: boolean) => void;
  navigateToLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * The AuthProvider mimics authentication context state.
 * For actual integration, inject dependencies as props or via hooks.
 */
export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState<{
    id: string;
    public_settings: unknown;
  } | null>(null); // Contains only { id, public_settings }

  // Placeholder handlers replace external logic
  // These should be implemented according to the actual app's requirements

  const checkAppState = async () => {
    setIsLoadingPublicSettings(true);
    setAuthError(null);
    // Implement actual logic to load public settings and check user auth
    // setAppPublicSettings({...});
    // Optionally checkUserAuth();
    setIsLoadingPublicSettings(false);
    setIsLoadingAuth(false);
    setIsAuthenticated(false);
    setAuthChecked(true);
  };

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    // Implement actual logic to check authentication and set user
    // setUser({...}), setIsAuthenticated(true), etc.
    setIsLoadingAuth(false);
    setIsAuthenticated(false);
    setAuthChecked(true);
    // Optionally set authError on failure
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    // Implement any cleanup or redirection here
    // if (shouldRedirect) ...
  };

  const navigateToLogin = () => {
    // Implement navigation or redirection logic for login
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};