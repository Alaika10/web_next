-- Run in Supabase SQL Editor
-- Tujuan: menyamakan schema `projects` agar fitur detail/editor kaya dapat dipakai penuh

alter table public.projects
  add column if not exists demo_url text,
  add column if not exists deploy_demo_url text,
  add column if not exists github_url text,
  add column if not exists git_url text,
  add column if not exists repository_url text,
  add column if not exists content_html text,
  add column if not exists metrics jsonb,
  add column if not exists matrix jsonb;

-- Optional: isi default agar tidak null untuk data lama
update public.projects
set
  demo_url = coalesce(demo_url, link, ''),
  deploy_demo_url = coalesce(deploy_demo_url, demo_url, link, ''),
  github_url = coalesce(github_url, ''),
  git_url = coalesce(git_url, github_url, ''),
  repository_url = coalesce(repository_url, github_url, git_url, ''),
  content_html = coalesce(content_html, ''),
  metrics = coalesce(metrics, '[]'::jsonb),
  matrix = coalesce(matrix, '[]'::jsonb);
