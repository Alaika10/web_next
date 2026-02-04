export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  contentHtml?: string;
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
  contentHtml?: string;
  imageUrl: string;
  author: string;
  date: string;
  tags: string[];
  isHeadline?: boolean;
  isTrending?: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  imageUrl: string;
  credentialUrl: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'Frontend' | 'Backend' | 'Design' | 'Other';
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

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
  CERTIFICATIONS = 'Certifications',
  PROFILE = 'Profile'
}