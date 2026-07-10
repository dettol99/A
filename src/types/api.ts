import type { MediaType } from './database';

export type SearchResult = {
  id: string;
  source: 'tmdb' | 'rawg';
  sourceId: string;
  mediaType: MediaType;
  title: string;
  posterUrl?: string | null;
  overview?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
};

export type NewsArticle = {
  id: string;
  sourceId: string;
  title: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
  publishedAt: string;
  category?: string | null;
  sourceName?: string | null;
};
