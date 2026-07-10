import { corsHeaders, error, fetchJson, json, readJson, requiredEnv } from '../_shared/http.ts';

type GNewsArticle = {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt: string;
  source?: { name?: string; url?: string };
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { query = 'entertainment OR games', lang = 'ar' } = await readJson<{ query: string; lang: string }>(req);
    const key = requiredEnv('GNEWS_API_KEY');
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${encodeURIComponent(lang)}&max=20&apikey=${key}`;
    const result = await fetchJson<{ articles: GNewsArticle[] }>(url);
    const data = result.articles.map((article) => ({
      id: article.url,
      title: article.title,
      description: article.description ?? null,
      url: article.url,
      imageUrl: article.image ?? null,
      publishedAt: article.publishedAt,
      sourceName: article.source?.name ?? null,
    }));

    return json({ ok: true, data });
  } catch (cause) {
    return error(cause instanceof Error ? cause.message : 'Unable to load trending news', 500);
  }
});
