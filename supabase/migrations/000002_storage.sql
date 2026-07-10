insert into storage.buckets (id, name, public) values ('community-images', 'community-images', true) on conflict (id) do nothing;
create policy "community images public read" on storage.objects for select using (bucket_id = 'community-images');
create policy "community images authenticated upload" on storage.objects for insert to authenticated with check (bucket_id = 'community-images');
