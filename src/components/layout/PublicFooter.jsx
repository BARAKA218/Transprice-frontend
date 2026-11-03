import { Link } from 'react-router-dom';
import { Mail, Phone, ExternalLink } from 'lucide-react';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Check Fare', to: '/check-fare' },
  { label: 'Routes', to: '/routes' },
  { label: 'Fares', to: '/fares' },
  { label: 'Updates', to: '/updates' },
];

const aboutLinks = [
  { label: 'About', to: '/about' },
  { label: 'Transparency', to: '/transparency' },
  { label: 'Contact', to: '/contact' },
];

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 dark:bg-[#0a1a30] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 text-white text-sm font-bold">
                T
              </div>
              <span className="text-xl font-bold">
                Trans<span className="text-green-400">Price</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Fair journeys. Clear prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 hover:text-green-400 transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">
              About
            </h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 hover:text-green-400 transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="text-sm text-neutral-400">
                <span className="text-neutral-300 font-medium">Management:</span>{' '}
                BARAKA
              </li>
              <li>
                <a
                  href="tel:0794607004"
                  className="text-sm text-neutral-400 hover:text-green-400 transition-colors inline-flex items-center gap-2"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
            0781171187
                </a>
              </li>
              <li>
                <a
                  href="mailto:barakagermain320@gmail.com"
                  className="text-sm text-neutral-400 hover:text-green-400 transition-colors inline-flex items-center gap-2 break-all"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  barakagermain320@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-10 pt-8 border-t border-neutral-700/50">
          <div className="rounded-lg bg-neutral-800/40 p-4 mb-8">
            <p className="text-xs text-neutral-400 leading-relaxed">
              <ExternalLink className="inline h-3 w-3 mr-1 -mt-0.5" />
              <span className="font-medium text-neutral-300">Important:</span>{' '}
              TransPrice is an independent platform. Data is clearly sourced and
              verified. Demo data is clearly labeled.
            </p>
          </div>
          <p className="text-xs text-neutral-500 text-center">
            &copy; {currentYear} TransPrice. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
