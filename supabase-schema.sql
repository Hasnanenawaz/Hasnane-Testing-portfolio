-- ============================================================
-- Supabase Schema for hasnanenawaz.in Blog System
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Create the blogs table
create table if not exists public.blogs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  excerpt       text,
  content       text,
  cover_image   text,
  published     boolean not null default false,
  meta_title    text,
  meta_description text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast slug lookup (used on every blog post page)
create index if not exists blogs_slug_idx on public.blogs (slug);

-- Index for published feed (used on /blog listing)
create index if not exists blogs_published_idx on public.blogs (published, created_at desc);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table public.blogs enable row level security;

-- Public: anyone can read published blogs
create policy "Public can read published blogs"
  on public.blogs for select
  using (published = true);

-- Service role (used by supabaseAdmin in API routes) bypasses RLS automatically.
-- No extra policy needed for admin operations.

-- ============================================================
-- Storage bucket for blog cover images
-- ============================================================

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Allow anyone to read images (bucket is public)
create policy "Public can view blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- Allow service role to upload/delete (handled server-side via supabaseAdmin)
-- No extra policy needed — service role bypasses RLS.
