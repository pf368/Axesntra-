'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const DASHBOARD_ROUTES = ['/sample-report'];
const FULL_PAGE_ROUTES = ['/'];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_ROUTES.some((route) => pathname.startsWith(route));
  const isFullPage = FULL_PAGE_ROUTES.some((route) => pathname === route);

  if (isDashboard || isFullPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
