import { corsHeaders, error, json, readJson } from '../_shared/http.ts';
import { searchMedia } from '../_shared/media.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { query, mediaType } = await readJson<{ query: string; mediaType: 'movie' | 'tv' | 'game' }>(req);
    if (!query || query.trim().length < 2) return error('Search query must be at least 2 characters');

    const data = await searchMedia(query.trim(), mediaType);
    return json({ ok: true, data });
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : 'Unable to search media', 500);
  }
});
