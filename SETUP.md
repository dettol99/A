# Setup

1. Copy `.env.example` to `.env` and fill `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
2. Run `npm install`.
3. Apply migrations in `supabase/migrations` to your Supabase project.
4. Deploy functions in `supabase/functions` and configure server-side provider keys only in Supabase secrets.
5. Run `npm run typecheck` and `npm run lint`.
6. Start the app with `npm start`.

## External actions required
- Configure Supabase Auth providers.
- Set Supabase Edge Function secrets for TMDB, RAWG, and GNews.
- Deploy storage policies and verify the `community-images` bucket.
