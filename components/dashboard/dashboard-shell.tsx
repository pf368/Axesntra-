'use client';

import { ReactNode } from 'react';

interface DashboardShellProps {
  sidebar: ReactNode;
  topBar: ReactNode;
  rightSidebar: ReactNode;
  children: ReactNode;
}

export function DashboardShell({ sidebar, topBar, rightSidebar, children }: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Left sidebar rail */}
      <aside className="hidden lg:flex w-14 shrink-0 flex-col bg-surface-panel">
        {sidebar}
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 bg-surface-panel shadow-ambient">
          {topBar}
        </header>

        {/* Content + right sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
            {children}
          </main>

          {/* Right sidebar */}
          <aside className="hidden xl:flex w-[340px] shrink-0 flex-col overflow-y-auto bg-surface-panel px-5 py-6">
            {rightSidebar}
          </aside>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-surface-panel shadow-ambient z-50">
        {sidebar}
      </div>
    </div>
  );
}
