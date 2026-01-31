
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RootLayout from './app/layout';
import HomePage from './app/page';
import ProjectsPage from './app/projects/page';
import BlogPage from './app/blog/page';
import AboutPage from './app/about/page';
import AdminPage from './app/admin/page';
import LoginPage from './app/login/page';
import { isAuthenticated } from './lib/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = isAuthenticated();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <HashRouter>
    <RootLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RootLayout>
  </HashRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
