import { corsHeaders, error, json, readJson } from '../_shared/http.ts';
import { mediaDetails } from '../_shared/media.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { source, sourceId, mediaType } = await readJson<{ source: string; sourceId: string; mediaType: 'movie' | 'tv' | 'game' }>(req);
    if (!source || !sourceId || !mediaType) return error('source, sourceId, and mediaType are required');

    const data = await mediaDetails(source, sourceId, mediaType);
    return json({ ok: true, data });
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : 'Unable to load media details', 500);
  }
});
