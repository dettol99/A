import type { MediaType } from '@/types/database';
import { supabase } from './supabase';

export type MediaSearchParams = {
  query: string;
  mediaType?: MediaType;
};

export type MediaDetailsParams = {
  source: string;
  sourceId: string;
  mediaType: MediaType;
};

export const mediaService = {
  trending: (mediaType?: MediaType) => supabase.functions.invoke('trending-media', { body: { mediaType } }),
  search: ({ query, mediaType }: MediaSearchParams) => supabase.functions.invoke('search-media', { body: { query, mediaType } }),
  details: ({ source, sourceId, mediaType }: MediaDetailsParams) =>
    supabase.functions.invoke('media-details', { body: { source, sourceId, mediaType } }),
  persist: (item: {
    source: string;
    sourceId: string;
    mediaType: MediaType;
    title: string;
    posterUrl?: string | null;
    overview?: string | null;
    releaseDate?: string | null;
    metadata?: Record<string, unknown>;
  }) =>
    supabase
      .from('media_items')
      .upsert(
        {
          source: item.source,
          source_id: item.sourceId,
          media_type: item.mediaType,
          title: item.title,
          poster_url: item.posterUrl ?? null,
          overview: item.overview ?? null,
          release_date: item.releaseDate ?? null,
          metadata: item.metadata ?? {},
        },
        { onConflict: 'source,source_id,media_type' },
      )
      .select()
      .single(),
};
