import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

function buildBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Home', to: '/' }];
  let path = '';
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      to: path,
    });
  }
  return crumbs;
}

export default function DashboardHeader({ onToggleSidebar }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const menuRef = useRef(null);
  const location = useLocation();
  const crumbs = buildBreadcrumbs(location.pathname);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const unreadCount = 3;

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            {crumbs.map((crumb, i) => (
              <span key={crumb.to} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />}
                {i === crumbs.length - 1 ? (
                  <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.to}
                    className="text-neutral-500 hover:text-navy-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-48 lg:w-56 rounded-lg border bg-neutral-50 dark:bg-neutral-800 pl-9 pr-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none transition-all duration-200 ${
                searchFocused
                  ? 'border-green-500 ring-1 ring-green-500/30 w-64 lg:w-72'
                  : 'border-neutral-300 dark:border-neutral-600'
              }`}
            />
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <button
            className="relative inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white text-sm font-semibold">
                B
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-white leading-tight">BARAKA</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight">Admin</p>
              </div>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#1e293b] border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden"
                >
                  <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">BARAKA</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">barakagermain320@gmail.com</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
