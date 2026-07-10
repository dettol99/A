import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { requiredEnv } from './http.ts';

export function adminClient() {
  return createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function currentUser(req: Request) {
  const authorization = req.headers.get('Authorization');
  if (!authorization) throw new Error('Missing Authorization header');

  const supabase = adminClient();
  const token = authorization.replace(/^Bearer\s+/i, '');
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error('Invalid user token');

  return { supabase, user: data.user };
}
