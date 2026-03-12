import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  plan: 'free' | 'pro' | 'elite';
  language: string;
  full_name?: string;
  avatar_url?: string;
  credits?: number;
  is_blocked?: boolean;
  blocked_reason?: string;
  provider?: string;
  has_course_access?: boolean;
}

// ... existing code ...


interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isPro: boolean;
  hasCourseAccess: boolean;
  isBlocked: boolean;
  isAdmin: boolean;
  blockedReason: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, captchaToken?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCourseAccess, setHasCourseAccess] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      const profileData = data as any;
      setProfile(profileData as Profile);
      setHasCourseAccess(!!profileData.has_course_access);

      // Check if user is blocked
      if (profileData.is_blocked) {
        setIsBlocked(true);
        setBlockedReason(profileData.blocked_reason || 'Conta suspensa pelo administrador');
      } else {
        setIsBlocked(false);
        setBlockedReason(null);
      }

      // Record login (non-blocking)
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any).rpc('record_login').then(() => { }).catch(() => { });
      } catch { }

      // Check admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!roleData);
    }
  };

  useEffect(() => {
    let profileFetched = false; // Prevent double-fetch race

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          if (!profileFetched) {
            profileFetched = true;
            fetchProfile(session.user.id).finally(() => {
              setLoading(false);
            });
          }
        } else {
          setProfile(null);
          setHasCourseAccess(false);
          setIsBlocked(false);
          setIsAdmin(false);
          setBlockedReason(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        if (!profileFetched) {
          profileFetched = true;
          await fetchProfile(session.user.id);
        }
        setLoading(false);
      } else {
        const hasAuthParams = window.location.hash.includes('access_token') ||
          window.location.hash.includes('type=recovery') ||
          window.location.search.includes('code=') ||
          window.location.search.includes('error=');
        if (!hasAuthParams) {
          setLoading(false);
        }
      }
    }).catch(() => {
      setLoading(false);
    });

    // Safety timeout — if Supabase hangs, don't block the user forever
    const timeout = setTimeout(() => {
      setLoading((current) => {
        if (current) console.warn('[Auth] Session check timed out, releasing UI');
        return false;
      });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, captchaToken?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        emailRedirectTo: redirectUrl,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsBlocked(false);
    setIsAdmin(false);
    setBlockedReason(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error: error as Error | null };
  };

  const isPro = profile?.plan === 'pro' || profile?.plan === 'elite';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isPro,
        hasCourseAccess,
        isBlocked,
        isAdmin,
        blockedReason,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        refreshProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
