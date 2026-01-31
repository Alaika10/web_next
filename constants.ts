
import { Profile, Project, BlogPost } from './types';

export const INITIAL_PROFILE: Profile = {
  name: "Alex Sterling",
  title: "Senior Full Stack Engineer & Designer",
  about: "I'm a passionate developer with over 8 years of experience building scalable web applications. I love bridging the gap between design and code, creating seamless user experiences that solve real-world problems. When I'm not coding, you'll find me exploring mountains or reading about AI ethics.",
  skills: [
    { name: "React / Next.js", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Frontend" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "Tailwind CSS", level: 98, category: "Design" },
    { name: "PostgreSQL", level: 80, category: "Backend" },
    { name: "UI/UX Design", level: 88, category: "Design" }
  ],
  experience: [
    {
      company: "TechNova Solutions",
      role: "Lead Frontend Engineer",
      period: "2021 - Present",
      description: "Leading a team of 12 engineers in developing a multi-tenant SaaS platform used by Fortune 500 companies."
    },
    {
      company: "Creative Pulse",
      role: "Senior Full Stack Developer",
      period: "2018 - 2021",
      description: "Designed and implemented robust backend architectures and highly interactive client interfaces."
    }
  ],
  avatar: "https://picsum.photos/seed/alex/400/400",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    title: "E-Commerce Re-imagined",
    description: "A headless commerce solution using Next.js and Shopify API, focusing on speed and accessibility.",
    imageUrl: "https://picsum.photos/seed/shop/800/450",
    technologies: ["Next.js", "Tailwind", "Shopify"],
    link: "#",
    createdAt: "2023-10-15"
  },
  {
    id: "2",
    title: "TaskFlow Pro",
    description: "A productivity dashboard with real-time collaboration features and advanced data visualization.",
    imageUrl: "https://picsum.photos/seed/flow/800/450",
    technologies: ["React", "Firebase", "D3.js"],
    link: "#",
    createdAt: "2023-08-10"
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Web Development with AI",
    excerpt: "How generative AI is changing the way we write code and design interfaces.",
    content: "Full content of the blog post about AI...",
    imageUrl: "https://picsum.photos/seed/ai/800/450",
    author: "Alex Sterling",
    date: "2024-01-20",
    tags: ["AI", "Web Dev", "Trends"]
  }
];
