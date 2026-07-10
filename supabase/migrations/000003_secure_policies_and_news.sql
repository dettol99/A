-- Harden RLS for user-owned tables reviewed by Codex. Policies are idempotently
-- recreated so existing databases get the secure auth.uid() checks too.

drop policy if exists "own user interests read" on public.user_interests;
drop policy if exists "own user interests write" on public.user_interests;
create policy "own user interests read" on public.user_interests for select using (auth.uid() = user_id);
create policy "own user interests write" on public.user_interests for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own ratings read" on public.ratings;
drop policy if exists "own ratings write" on public.ratings;
create policy "own ratings read" on public.ratings for select using (auth.uid() = user_id);
create policy "own ratings write" on public.ratings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own lists read" on public.user_lists;
drop policy if exists "own lists write" on public.user_lists;
create policy "own lists read" on public.user_lists for select using (auth.uid() = user_id);
create policy "own lists write" on public.user_lists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own list items read" on public.list_items;
drop policy if exists "own list items write" on public.list_items;
create policy "own list items read" on public.list_items for select using (exists (select 1 from public.user_lists where user_lists.id = list_items.list_id and user_lists.user_id = auth.uid()));
create policy "own list items write" on public.list_items for all using (exists (select 1 from public.user_lists where user_lists.id = list_items.list_id and user_lists.user_id = auth.uid())) with check (exists (select 1 from public.user_lists where user_lists.id = list_items.list_id and user_lists.user_id = auth.uid()));

drop policy if exists "own saved news read" on public.saved_news;
drop policy if exists "own saved news write" on public.saved_news;
create policy "own saved news read" on public.saved_news for select using (auth.uid() = user_id);
create policy "own saved news write" on public.saved_news for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own reactions read" on public.post_reactions;
drop policy if exists "own reactions write" on public.post_reactions;
create policy "own reactions read" on public.post_reactions for select using (auth.uid() = user_id);
create policy "own reactions write" on public.post_reactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own follows read" on public.follows;
drop policy if exists "own follows write" on public.follows;
create policy "own follows read" on public.follows for select using (auth.uid() = follower_id);
create policy "own follows write" on public.follows for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

drop policy if exists "own blocks read" on public.blocks;
drop policy if exists "own blocks write" on public.blocks;
create policy "own blocks read" on public.blocks for select using (auth.uid() = blocker_id);
create policy "own blocks write" on public.blocks for all using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);

drop policy if exists "own reports read" on public.reports;
drop policy if exists "own reports create" on public.reports;
create policy "own reports read" on public.reports for select using (auth.uid() = reporter_id);
create policy "own reports create" on public.reports for insert with check (auth.uid() = reporter_id);

-- Authenticated users may create/update canonical news records before saving them;
-- saved_news itself still stores only the news_items.id UUID and remains user-owned.
drop policy if exists "authenticated news insert" on public.news_items;
drop policy if exists "authenticated news update" on public.news_items;
create policy "authenticated news insert" on public.news_items for insert with check (auth.uid() is not null);
create policy "authenticated news update" on public.news_items for update using (auth.uid() is not null) with check (auth.uid() is not null);
