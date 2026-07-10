import { corsHeaders, error, json } from '../_shared/http.ts';
import { currentUser } from '../_shared/supabaseAdmin.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return error('Method not allowed', 405);

  try {
    const { supabase, user } = await currentUser(req);
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;

    return json({ ok: true, data: { deletedUserId: user.id } });
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : 'Unable to delete account', 500);
  }
});
