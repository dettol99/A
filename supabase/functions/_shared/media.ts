import { fetchJson, requiredEnv } from './http.ts';

type MediaType = 'movie' | 'tv' | 'game';

type TmdbItem = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
};

type RawgGame = {
  id: number;
  name: string;
  background_image?: string | null;
  released?: string;
  rating?: number;
};

const tmdbBase = 'https://api.themoviedb.org/3';
const tmdbImageBase = 'https://image.tmdb.org/t/p/w500';
const rawgBase = 'https://api.rawg.io/api';

function tmdbHeaders() {
  return { Authorization: `Bearer ${requiredEnv('TMDB_ACCESS_TOKEN')}`, accept: 'application/json' };
}

function normalizeTmdb(item: TmdbItem, mediaType: 'movie' | 'tv') {
  return {
    id: `${mediaType}:${item.id}`,
    source: 'tmdb' as const,
    sourceId: String(item.id),
    mediaType,
    title: item.title ?? item.name ?? 'Untitled',
    posterUrl: item.poster_path ? `${tmdbImageBase}${item.poster_path}` : null,
    overview: item.overview ?? null,
    releaseDate: item.release_date ?? item.first_air_date ?? null,
    rating: item.vote_average ?? null,
  };
}

function normalizeRawg(item: RawgGame) {
  return {
    id: `game:${item.id}`,
    source: 'rawg' as const,
    sourceId: String(item.id),
    mediaType: 'game' as const,
    title: item.name,
    posterUrl: item.background_image ?? null,
    overview: null,
    releaseDate: item.released ?? null,
    rating: item.rating ?? null,
  };
}

export async function trendingMedia(mediaType?: MediaType) {
  const requests: Promise<unknown[]>[] = [];

  if (!mediaType || mediaType === 'movie') {
    requests.push(fetchJson<{ results: TmdbItem[] }>(`${tmdbBase}/trending/movie/week?language=ar`, { headers: tmdbHeaders() }).then((r) => r.results.map((item) => normalizeTmdb(item, 'movie'))));
  }

  if (!mediaType || mediaType === 'tv') {
    requests.push(fetchJson<{ results: TmdbItem[] }>(`${tmdbBase}/trending/tv/week?language=ar`, { headers: tmdbHeaders() }).then((r) => r.results.map((item) => normalizeTmdb(item, 'tv'))));
  }

  if (!mediaType || mediaType === 'game') {
    const key = requiredEnv('RAWG_API_KEY');
    requests.push(fetchJson<{ results: RawgGame[] }>(`${rawgBase}/games?key=${key}&ordering=-added&page_size=20`).then((r) => r.results.map(normalizeRawg)));
  }

  return (await Promise.all(requests)).flat();
}

export async function searchMedia(query: string, mediaType?: MediaType) {
  const q = encodeURIComponent(query);
  const requests: Promise<unknown[]>[] = [];

  if (!mediaType || mediaType === 'movie') {
    requests.push(fetchJson<{ results: TmdbItem[] }>(`${tmdbBase}/search/movie?query=${q}&language=ar&include_adult=false`, { headers: tmdbHeaders() }).then((r) => r.results.map((item) => normalizeTmdb(item, 'movie'))));
  }

  if (!mediaType || mediaType === 'tv') {
    requests.push(fetchJson<{ results: TmdbItem[] }>(`${tmdbBase}/search/tv?query=${q}&language=ar&include_adult=false`, { headers: tmdbHeaders() }).then((r) => r.results.map((item) => normalizeTmdb(item, 'tv'))));
  }

  if (!mediaType || mediaType === 'game') {
    const key = requiredEnv('RAWG_API_KEY');
    requests.push(fetchJson<{ results: RawgGame[] }>(`${rawgBase}/games?key=${key}&search=${q}&page_size=20`).then((r) => r.results.map(normalizeRawg)));
  }

  return (await Promise.all(requests)).flat();
}

export async function mediaDetails(source: string, sourceId: string, mediaType: MediaType) {
  if (source === 'tmdb' && (mediaType === 'movie' || mediaType === 'tv')) {
    const item = await fetchJson<TmdbItem>(`${tmdbBase}/${mediaType}/${sourceId}?language=ar`, { headers: tmdbHeaders() });
    return normalizeTmdb(item, mediaType);
  }

  if (source === 'rawg' && mediaType === 'game') {
    const key = requiredEnv('RAWG_API_KEY');
    const item = await fetchJson<RawgGame & { description_raw?: string }>(`${rawgBase}/games/${sourceId}?key=${key}`);
    return { ...normalizeRawg(item), overview: item.description_raw ?? null };
  }

  throw new Error('Unsupported media source or type');
}
