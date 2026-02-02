import React from 'react';
import { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VercelAnalytics from '../components/VercelAnalytics';

export const metadata: Metadata = {
  title: 'DataLab | AI & Machine Learning Portfolio',
  description: 'Building intelligent systems with rigor and precision. Portfolio and research journal of Alex Sterling.',
  openGraph: {
    title: 'DataLab | AI & Machine Learning Portfolio',
    description: 'Specialized in turning high-dimensional data into predictive power.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const globalStyles = `
    body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
    .glass-effect { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
    .dark { background: #020617; }
    .dark .glass-effect { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); }
    
    .data-grid-bg {
      background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px);
      background-size: 24px 24px;
    }
    .dark .data-grid-bg {
      background-image: radial-gradient(#1e293b 0.5px, transparent 0.5px);
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .dark ::-webkit-scrollbar-thumb { background: #334155; }
    
    .animate-in { animation: animateIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes animateIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .font-mono-tech { font-family: 'ui-monospace', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace; }

    .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 {
      font-weight: 900;
      letter-spacing: -0.05em;
      margin-top: 2.5rem;
      margin-bottom: 1.5rem;
      color: currentColor;
    }
    .rich-text-content p {
      margin-bottom: 1.5rem;
      line-height: 1.8;
    }
  `;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='30' fill='%234f46e5'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-weight='900' font-size='65' fill='white'%3ED%3C/text%3E%3C/svg%3E" />
        <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 antialiased data-grid-bg">
        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
        <VercelAnalytics />
      </body>
    </html>
  );
}