
import { Profile, Project, BlogPost } from './types';

export const INITIAL_PROFILE: Profile = {
  name: "Alex Sterling",
  title: "Data Scientist & Machine Learning Engineer",
  about: "I'm a researcher and engineer specialized in Deep Learning and Predictive Analytics. With over 6 years of experience, I bridge the gap between raw data and actionable intelligence. I build neural architectures that solve complex business problems, from computer vision to natural language processing. My mission is to turn massive datasets into competitive advantages.",
  skills: [
    { name: "Python / PyTorch", level: 95, category: "Backend" },
    { name: "Scikit-Learn", level: 90, category: "Backend" },
    { name: "Deep Learning", level: 92, category: "Other" },
    { name: "SQL & BigQuery", level: 88, category: "Backend" },
    { name: "Data Visualization (D3/Tableau)", level: 85, category: "Design" },
    { name: "MLOps & Docker", level: 80, category: "Other" }
  ],
  experience: [
    {
      company: "NeuralMind AI",
      role: "Lead Machine Learning Engineer",
      period: "2021 - Present",
      description: "Architecting large-scale recommendation systems and deploying LLMs for automated customer insight extraction."
    },
    {
      company: "DataSphere Corp",
      role: "Senior Data Scientist",
      period: "2018 - 2021",
      description: "Developed predictive maintenance models for industrial IoT sensors, reducing downtime by 24% across 3 global factories."
    }
  ],
  avatar: "https://picsum.photos/seed/data-alex/400/400",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    title: "NeuroVision Scanner",
    description: "A real-time object detection system optimized for low-latency edge computing using YOLOv8 and TensorRT.",
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800",
    technologies: ["PyTorch", "OpenCV", "CUDA"],
    link: "#",
    createdAt: "2023-11-20"
  },
  {
    id: "2",
    title: "MarketSentient AI",
    description: "NLP-driven market analysis tool that predicts stock volatility by analyzing millions of social media signals and news feeds.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800",
    technologies: ["Transformers", "Python", "FastAPI"],
    link: "#",
    createdAt: "2023-09-05"
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Attention Mechanisms in Transformers",
    excerpt: "A deep dive into why Self-Attention is the most important breakthrough in modern NLP architectures.",
    content: "Full content about transformers and attention mechanisms...",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800",
    author: "Alaika Izatul Ilmi",
    date: "2024-02-10",
    tags: ["Deep Learning", "NLP", "AI"]
  }
];
