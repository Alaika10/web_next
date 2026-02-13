import { MetadataRoute } from 'next';
import { supabase } from '../lib/supabase';
import { getSiteUrl } from '../lib/site';

export const revalidate = 3600;

const staticRoutes = ['/', '/projects', '/blog', '/about', '/certifications', '/github'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));

  if (!supabase) return routes;

  try {
    const [projectsResult, blogsResult] = await Promise.all([
      supabase.from('projects').select('id, updated_at'),
      supabase.from('blogs').select('id, updated_at'),
    ]);

    const projectUrls: MetadataRoute.Sitemap = (projectsResult.data || []).map((project) => ({
      url: `${siteUrl}/projects/${project.id}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const blogUrls: MetadataRoute.Sitemap = (blogsResult.data || []).map((blog) => ({
      url: `${siteUrl}/blog/${blog.id}`,
      lastModified: blog.updated_at ? new Date(blog.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...routes, ...projectUrls, ...blogUrls];
  } catch {
    return routes;
  }
}
