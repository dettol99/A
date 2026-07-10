import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
type AuthContextValue = { user: User | null; isGuest: boolean; loading: boolean; continueAsGuest: () => void; signOut: () => Promise<void> };
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) { const [user, setUser] = useState<User | null>(null); const [isGuest, setGuest] = useState(false); const [loading, setLoading] = useState(true); useEffect(() => { supabase.auth.getUser().then(({ data }) => { setUser(data.user ?? null); setLoading(false); }); const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null)); return () => data.subscription.unsubscribe(); }, []); const value = useMemo(() => ({ user, isGuest, loading, continueAsGuest: () => setGuest(true), signOut: async () => { setGuest(false); await supabase.auth.signOut(); } }), [user, isGuest, loading]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; }
