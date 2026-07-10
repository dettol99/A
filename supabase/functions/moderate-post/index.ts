import { corsHeaders, error, json, readJson } from '../_shared/http.ts';
import { currentUser } from '../_shared/supabaseAdmin.ts';

const forbiddenTerms = (Deno.env.get('MODERATION_BLOCKLIST') ?? '')
  .split(',')
  .map((term) => term.trim().toLowerCase())
  .filter(Boolean);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return error('Method not allowed', 405);

  try {
    await currentUser(req);
    const { body } = await readJson<{ body: string }>(req);
    const normalized = (body ?? '').toLowerCase();
    const matchedTerms = forbiddenTerms.filter((term) => normalized.includes(term));

    return json({
      ok: true,
      data: {
        approved: matchedTerms.length === 0,
        matchedTerms,
      },
    });
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : 'Unable to moderate post', 500);
  }
});
