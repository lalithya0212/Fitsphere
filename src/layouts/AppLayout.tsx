import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { useFitSphereStore } from '../store/useFitSphereStore';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useFitSphereStore();

  const isPublicPage = ['/', '/about', '/features', '/login', '/register', '/trainer-assessment'].includes(location.pathname);

  // If user attempts to enter a protected portal workspace without signing in, redirect to login
  if (!isPublicPage && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div
      className={`bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white ${
        isPublicPage ? 'min-h-screen' : 'h-screen overflow-hidden'
      }`}
    >
      {/* 1. Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* 2. Main Workspace Layout */}
      {isPublicPage ? (
        <main className="flex-1">
          <Outlet />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 gap-6 overflow-hidden min-h-0">
          {/* Desktop & Mobile Drawer Sidebar - Fixed and stationary */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Core Content Viewport - Only this scrolls when user interacts or scrolls */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto pb-16 md:pb-6 pr-1 focus:outline-none">
            <Outlet />
          </main>
        </div>
      )}

      {/* 4. Mobile Bottom Navigation Bar (Visible on mobile viewports for athletes/coaches) */}
      <MobileBottomNav />
    </div>
  );
};
