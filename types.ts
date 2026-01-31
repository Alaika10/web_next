
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  tags: string[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Frontend' | 'Backend' | 'Design' | 'Other';
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

// Added optional id property to resolve "Property 'id' does not exist on type 'Profile'" in AdminDashboard.tsx
export interface Profile {
  id?: string | number;
  name: string;
  title: string;
  about: string;
  skills: Skill[];
  experience: Experience[];
  avatar: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

export enum DashboardTab {
  OVERVIEW = 'Overview',
  PROJECTS = 'Projects',
  BLOGS = 'Blogs',
  PROFILE = 'Profile'
}
