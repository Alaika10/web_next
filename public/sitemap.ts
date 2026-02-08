import { MetadataRoute } from 'next';
import { supabase } from '../lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alexdatalabs.vercel.app';

  const routes = ['', '/projects', '/blog', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  let projectUrls: any[] = [];
  let blogUrls: any[] = [];

  if (supabase) {
    const { data: projects } = await supabase.from('projects').select('id');
    const { data: blogs } = await supabase.from('blogs').select('id');

    projectUrls = (projects || []).map((p) => ({
      url: `${baseUrl}/projects/${p.id}`,
      lastModified: new Date(),
    }));

    blogUrls = (blogs || []).map((b) => ({
      url: `${baseUrl}/blog/${b.id}`,
      lastModified: new Date(),
    }));
  }

  return [...routes, ...projectUrls, ...blogUrls];
}