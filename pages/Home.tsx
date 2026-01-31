
import React from 'react';
import { Link } from 'react-router-dom';
import { Profile, Project, BlogPost } from '../types';

interface HomeProps {
  profile: Profile;
  projects: Project[];
  blogs: BlogPost[];
}

const Home: React.FC<HomeProps> = ({ profile, projects, blogs }) => {
  return (
    <div className="space-y-24 py-12 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 pt-12">
        <div className="flex-1 space-y-6">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold tracking-wide uppercase">Available for hire</span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            I'm {profile.name}, <span className="text-indigo-600">designing digital</span> excellence.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            {profile.about.substring(0, 160)}...
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/projects" className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
              View My Work
            </Link>
            <Link to="/about" className="px-8 py-3.5 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
              About Me
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0 relative">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl z-10 relative rotate-3 hover:rotate-0 transition-transform duration-500">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-indigo-200 dark:border-indigo-900 rounded-3xl -z-0"></div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <p className="text-slate-500">A collection of my recent web and mobile endeavors.</p>
          </div>
          <Link to="/projects" className="text-indigo-600 font-semibold hover:underline">View All Projects →</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.slice(0, 2).map((project) => (
            <div key={project.id} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all">
              <div className="h-64 overflow-hidden relative">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-black px-6 py-2 rounded-full font-bold">View Project</span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-lg uppercase">{tech}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Teaser */}
      <section className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/20 blur-3xl rounded-full"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Bridging ideas with robust implementation.</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              I specialize in crafting high-performance, accessible, and beautiful web applications using modern stacks. My focus is always on user outcomes.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-bold text-indigo-400">8+</p>
                <p className="text-slate-400">Years Experience</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-400">50+</p>
                <p className="text-slate-400">Projects Launched</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {profile.skills.slice(0, 4).map(skill => (
              <div key={skill.name} className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="font-bold text-lg mb-2">{skill.name}</p>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">From the Blog</h2>
            <p className="text-slate-500">Insights, tutorials, and thoughts on the tech industry.</p>
          </div>
          <Link to="/blog" className="text-indigo-600 font-semibold hover:underline">Read All Posts →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map(post => (
            <div key={post.id} className="space-y-4 group">
              <div className="aspect-video rounded-2xl overflow-hidden border">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="text-indigo-600 font-bold text-xs uppercase">{post.date}</span>
              <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">{post.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
