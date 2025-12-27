'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User, LoginCredentials, RegisterData } from '@/types/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  handleOAuthCallback: (accessToken: string, refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/oauth-success',
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const isInitialMount = useRef(true);
  const isCheckingAuth = useRef(false);
  const hasRedirected = useRef(false);

  const isPublicRoute = useCallback(
    (path: string) =>
      PUBLIC_PATHS.includes(path) || path.startsWith('/oauth/'),
    []
  );

  // =========================
  // REFRESH TOKEN
  // =========================
  const refresh = useCallback(async () => {
    if (isCheckingAuth.current) return;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    isCheckingAuth.current = true;
    setIsLoading(true);

    try {
      const result = await api.refreshToken(refreshToken);

      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      api.setToken(result.accessToken);

      const profile = await api.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('Refresh failed:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      api.clearToken();
      setUser(null);
    } finally {
      isCheckingAuth.current = false;
      setIsLoading(false);
    }
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await api.logout();
    } catch {
      // ignore
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    api.clearToken();
    setUser(null);

    setIsLoading(false);
    hasRedirected.current = false;

    if (!isPublicRoute(pathname)) {
      router.replace('/login');
    }
  }, [router, pathname, isPublicRoute]);

  // =========================
  // INITIAL AUTH CHECK (RUNS ONCE)
  // =========================
  useEffect(() => {
    if (!isInitialMount.current) return;

    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        api.setToken(accessToken);
        const profile = await api.getProfile();
        setUser(profile);
      } catch (err: any) {
        if (err?.code === 401) {
          await refresh();
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    isInitialMount.current = false;
  }, [refresh]);

  // =========================
  // TOKEN EXPIRED EVENT
  // =========================
  useEffect(() => {
    const onTokenExpired = () => {
      if (!isCheckingAuth.current) {
        refresh();
      }
    };

    window.addEventListener('auth:token-expired', onTokenExpired);
    return () =>
      window.removeEventListener('auth:token-expired', onTokenExpired);
  }, [refresh]);

  // =========================
  // ROUTE GUARD (SINGLE REDIRECT SOURCE)
  // =========================
  useEffect(() => {
    if (isLoading) return;
    if (hasRedirected.current) return;

    const isPublic = isPublicRoute(pathname);
    const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/oauth-success';


    if (!user && !isPublic && !isCheckingAuth.current) {
      hasRedirected.current = true;
      router.replace('/login');
    } else if (user && isAuthRoute) {
      hasRedirected.current = true;
      router.replace('/dashboard');
    }
  }, [user, pathname, isLoading, router, isPublicRoute]);

  useEffect(() => {
    hasRedirected.current = false;
  }, [pathname]);

  // =========================
  // LOGIN
  // =========================
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await api.login(credentials);

      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      api.setToken(result.accessToken);

      setUser(result.user);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // REGISTER
  // =========================
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await api.register(data);

      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      api.setToken(result.accessToken);

      setUser(result.user);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // OAUTH CALLBACK
  // =========================
  const handleOAuthCallback = async (
    accessToken: string,
    refreshToken: string
  ) => {
    setIsLoading(true);
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      api.setToken(accessToken);

      const profile = await api.getProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refresh,
        handleOAuthCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
