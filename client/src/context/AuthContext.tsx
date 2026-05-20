import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const GUEST_STORAGE_KEY = 'mailx_guest_mode';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readGuestFlag(): boolean {
  try {
    return localStorage.getItem(GUEST_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeGuestFlag(active: boolean) {
  try {
    if (active) {
      localStorage.setItem(GUEST_STORAGE_KEY, '1');
    } else {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
  } catch {
    /* storage unavailable */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(readGuestFlag);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) {
        setIsGuest(false);
        writeGuestFlag(false);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) {
        setIsGuest(false);
        writeGuestFlag(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const enterGuestMode = useCallback(() => {
    setIsGuest(true);
    writeGuestFlag(true);
  }, []);

  const exitGuestMode = useCallback(() => {
    setIsGuest(false);
    writeGuestFlag(false);
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    exitGuestMode();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signIn = async (email: string, password: string) => {
    exitGuestMode();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    exitGuestMode();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        isGuest,
        enterGuestMode,
        exitGuestMode,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
