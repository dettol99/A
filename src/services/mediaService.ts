import type { SearchResult } from '@/types/api';
import type { MediaType } from '@/types/database';
import { supabase } from './supabase';
import { unwrapEdgeFunctionData } from './functionResponse';

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
  trending: async (mediaType?: MediaType) => {
    const response = await supabase.functions.invoke('trending-media', { body: { mediaType } });
    return { ...response, data: unwrapEdgeFunctionData<SearchResult[]>(response.data) ?? [] };
  },
  search: async ({ query, mediaType }: MediaSearchParams) => {
    const response = await supabase.functions.invoke('search-media', { body: { query, mediaType } });
    return { ...response, data: unwrapEdgeFunctionData<SearchResult[]>(response.data) ?? [] };
  },
  details: async ({ source, sourceId, mediaType }: MediaDetailsParams) => {
    const response = await supabase.functions.invoke('media-details', { body: { source, sourceId, mediaType } });
    return { ...response, data: unwrapEdgeFunctionData(response.data) };
  },
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
