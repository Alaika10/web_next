
import React from 'react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-5xl font-bold">My Portfolio</h1>
        <p className="text-xl text-slate-500">A collection of projects I've built, ranging from simple tools to complex enterprise applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="aspect-[4/3] relative">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase tracking-wider">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col space-y-4">
              <h3 className="text-2xl font-bold">{project.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow">{project.description}</p>
              <a href={project.link} className="inline-flex items-center text-indigo-600 font-bold hover:gap-2 transition-all">
                Learn More <span className="ml-1">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
