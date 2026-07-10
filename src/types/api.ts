import type { MediaType } from './database';
export type SearchResult = { id: string; source: 'tmdb' | 'rawg'; sourceId: string; mediaType: MediaType; title: string; posterUrl?: string | null; overview?: string | null };
export type NewsArticle = { id: string; title: string; url: string; imageUrl?: string | null; publishedAt: string; category?: string | null };
