// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { IUser, Tokens } from "../types";
import { StorageService } from "../services/StorageService";

interface AuthContextType {
  isAuthenticated: boolean;
  authLoading: boolean;
  user: IUser | null;
  tokens: Tokens | null;
  login: (tokens: Tokens, user: IUser) => void;
  updateUserProfile: (updates: Partial<IUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const tokens = StorageService.getTokens();
    const savedUser = StorageService.getUser();
    if (tokens) {
      setTokens(tokens);
      setIsAuthenticated(true);
      if (savedUser) {
        setUser(savedUser);
      }
    }
    setAuthLoading(false);
  }, []);

  const login = (tokens: Tokens, user: IUser) => {
    setTokens(tokens);
    StorageService.saveTokens(tokens);

    setUser(user);
    StorageService.saveUser(user);

    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    StorageService.deleteTokens();
    StorageService.deleteUser();
    setIsAuthenticated(false);
  };

  const updateUserProfile = (updates: Partial<IUser>) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...updates } : ({ ...updates } as IUser);
      StorageService.saveUser(next);
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authLoading,
        user,
        tokens,
        login,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
