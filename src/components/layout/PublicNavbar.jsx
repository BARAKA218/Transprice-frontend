import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Check Fare', to: '/check-fare' },
  { label: 'Routes', to: '/routes' },
  { label: 'Fares', to: '/fares' },
  { label: 'Updates', to: '/updates' },
  { label: 'Fuel Prices', to: '/fuel-prices' },
];

const linkClass = ({ isActive }) =>
  `relative text-sm font-medium transition-colors duration-200 ${
    isActive
      ? 'text-green-500'
      : 'text-neutral-600 hover:text-navy-900 dark:text-neutral-300 dark:hover:text-white'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block py-3 px-4 text-base font-medium rounded-lg transition-colors duration-200 ${
    isActive
      ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
  }`;

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl shadow-sm border-b border-neutral-200/50 dark:border-neutral-700/50'
          : 'bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white text-sm font-bold">
              T
            </div>
            <span className="text-lg font-bold text-navy-900 dark:text-white">
              Trans<span className="text-green-500">Price</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-navy-900 dark:text-white border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              Register
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-navy-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-[#1e293b] shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white text-sm font-bold">
                    T
                  </div>
                  <span className="text-lg font-bold text-navy-900 dark:text-white">
                    Trans<span className="text-green-500">Price</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={mobileLinkClass}
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-navy-900 dark:text-white border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors shadow-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
