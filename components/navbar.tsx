'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { href: '/#features', label: 'Product' },
  { href: '/#transform', label: 'Solutions' },
  { href: '/resources', label: 'Resources' },
  { href: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut, isConfigured } = useAuth();
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center px-8 py-4 w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sb-outline-variant/10">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-xl font-bold tracking-tighter text-blue-800">
          Axesntra
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href.startsWith('/#') && pathname === '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive && link.href === '/#features'
                    ? 'text-blue-700 border-b-2 border-blue-700 font-semibold pb-1'
                    : 'text-slate-600 hover:text-blue-600 transition-colors'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden md:flex items-center gap-4">
        {isConfigured ? (
          user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                <User className="h-3.5 w-3.5" />
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-slate-600 hover:text-blue-600 font-medium text-sm"
            >
              Log In
            </Link>
          )
        ) : (
          <button className="text-slate-600 hover:text-blue-600 font-medium text-sm">
            Log In
          </button>
        )}
        <Link
          href="/early-access"
          className="bg-sb-primary hover:bg-sb-primary-container text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
        >
          Contact Sales
        </Link>
      </div>

      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden p-2 text-slate-600 hover:text-sb-on-surface"
        aria-label="Toggle mobile menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md md:hidden py-4 px-8 space-y-3 border-b border-sb-outline-variant/10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-slate-600 hover:text-blue-600 transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
          {isConfigured && !user && (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors py-1"
            >
              <LogIn className="h-3.5 w-3.5" />
              Log In
            </Link>
          )}
          <Link
            href="/early-access"
            onClick={() => setMobileOpen(false)}
            className="block text-sm bg-sb-primary text-white px-4 py-2 rounded-lg font-semibold text-center"
          >
            Contact Sales
          </Link>
        </div>
      )}
    </header>
  );
}
