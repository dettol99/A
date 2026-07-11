import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';

type AuthContextValue = { user: User | null; isGuest: boolean; loading: boolean; continueAsGuest: () => void; signOut: () => Promise<void> };
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function ensureProfile(user: User | null) {
  if (!user) return;
  const username = user.email?.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 24) || `user_${user.id.slice(0, 8)}`;
  await authService.createProfile(user.id, username);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => { await ensureProfile(data.user ?? null); setUser(data.user ?? null); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => { await ensureProfile(session?.user ?? null); setUser(session?.user ?? null); });
    return () => data.subscription.unsubscribe();
  }, []);
  const value = useMemo(() => ({ user, isGuest, loading, continueAsGuest: () => setGuest(true), signOut: async () => { setGuest(false); await supabase.auth.signOut(); } }), [user, isGuest, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
