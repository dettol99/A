import { corsHeaders, error, json, readJson } from '../_shared/http.ts';
import { trendingMedia } from '../_shared/media.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { mediaType } = await readJson<{ mediaType: 'movie' | 'tv' | 'game' }>(req);
    const data = await trendingMedia(mediaType);
    return json({ ok: true, data });
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : 'Unable to load trending media', 500);
  }
});
