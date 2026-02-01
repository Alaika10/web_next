
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const globalStyles = `
    body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
    .glass-effect { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
    .dark .glass-effect { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .dark ::-webkit-scrollbar-thumb { background: #334155; }
    
    /* Animation helper classes */
    .animate-in { animation: animateIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes animateIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Zoom in animation */
    .zoom-in { animation: zoomIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    /* Rich Text Typography Fixes */
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
    .rich-text-content img {
      margin: 3rem 0;
    }
  `;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Zenith | Portfolio CMS</title>
        <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300 antialiased overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
