export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type MediaType = 'movie' | 'tv' | 'game';

type Row = Record<string, unknown>;
type Table = {
  Row: Row;
  Insert: Row;
  Update: Row;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table;
      user_interests: Table;
      media_items: Table;
      user_lists: Table;
      list_items: Table;
      ratings: Table;
      news_items: Table;
      saved_news: Table;
      posts: Table;
      comments: Table;
      post_reactions: Table;
      follows: Table;
      blocks: Table;
      reports: Table;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
