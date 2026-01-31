
import React from 'react';
import { BlogPost } from '../types';

interface BlogProps {
  blogs: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ blogs }) => {
  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-5xl font-bold">The Journal</h1>
        <p className="text-xl text-slate-500">Thoughts on engineering, design, and the occasional life lesson.</p>
      </div>

      <div className="space-y-12">
        {blogs.map((post) => (
          <article key={post.id} className="flex flex-col md:flex-row gap-8 items-start group">
            <div className="w-full md:w-1/3 aspect-[4/3] rounded-3xl overflow-hidden border">
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex-1 space-y-4 py-2">
              <div className="flex items-center gap-4 text-sm font-bold text-indigo-600 uppercase">
                <span>{post.date}</span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                <span>{post.tags[0]}</span>
              </div>
              <h2 className="text-3xl font-bold group-hover:text-indigo-600 transition-colors">{post.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                {post.excerpt}
              </p>
              <button className="text-indigo-600 font-bold hover:underline">Read Full Article</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
