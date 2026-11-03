import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useAIStore from '../store/aiStore';

/**
 * Maps the current route/pathname to a small context object that is sent to the
 * AI service so replies can be tailored to the page the user is viewing.
 */
function contextFromPath(pathname) {
  const path = pathname.toLowerCase();

  if (path.startsWith('/driver')) return { page: 'driver', role: 'driver', location: 'Dashboard' };
  if (path.startsWith('/cooperative')) return { page: 'cooperative', role: 'cooperative', location: 'Operations' };
  if (path.startsWith('/authority')) return { page: 'authority', role: 'authority', location: 'Regulation' };
  if (path.startsWith('/admin')) return { page: 'admin', role: 'admin', location: 'Platform' };
  if (path.startsWith('/passenger') || path.includes('check-fare')) return { page: 'passenger', role: 'passenger', location: 'Dashboard' };

  if (path.includes('pricing') || path.includes('fares') || path.includes('check') || path.includes('history'))
    return { page: 'pricing', location: 'Fares & Pricing' };
  if (path.includes('route')) return { page: 'route', location: 'Routes' };
  if (path.includes('fuel') || path.includes('update')) return { page: 'market-intel', location: 'Market Intel' };
  if (path.includes('about') || path.includes('transparency') || path.includes('contact'))
    return { page: 'about', location: 'About & Transparency' };

  return { page: 'home', location: 'Home' };
}

const CONTEXT_HINTS = {
  full: {
    pricing: {
      title: 'Pricing Assistant',
      guildText:
        'Ask about verified fares in Kigali, Musanze, Huye or Muhanga — for example "How much is transport from Kigali to Muhanga?" or "Compare bus and moto prices."',
    },
    route: {
      title: 'Route Assistant',
      guildText:
        'Ask about route distances, travel times and transport options, e.g. "What are the options from Kimironko to Downtown?"',
    },
    'market-intel': {
      title: 'Market Intel Assistant',
      guildText:
        'Ask for fuel price updates or the latest transport announcements, e.g. "Any updates on Kigali-Huye road works?"',
    },
    home: {
      title: 'Transport Assistant',
      guildText:
        'I have the verified TransPrice dataset loaded. Pick a suggested question below or type your own.',
    },
    dashboard: {
      title: 'Dashboard Assistant',
      guildText:
        'I can summarise your dashboard — recent trips, fare levels, alerts and what changed lately.',
    },
    passenger: {
      title: 'Passenger Assistant',
      guildText:
        'I can help you find fares, compare options, flag overcharging and understand your trips.',
    },
    driver: {
      title: 'Driver Assistant',
      guildText:
        'I can help summarise your trips, earnings and the latest tariff alerts on your routes.',
    },
    cooperative: {
      title: 'Operations Assistant',
      guildText:
        'I can summarise proposals, vehicle/driver status and recent complaints for your cooperative.',
    },
    authority: {
      title: 'Regulatory Assistant',
      guildText:
        'I can help you review proposals, spot non-compliance and summarise fare trends by district.',
    },
    admin: {
      title: 'Admin Assistant',
      guildText:
        'I can summarise platform analytics, audit activity and fare quality issues.',
    },
  },
};

export default function useAIContext() {
  const { pathname } = useLocation();
  const setContext = useAIStore((s) => s.setContext);

  const context = useMemo(() => contextFromPath(pathname), [pathname]);

  useEffect(() => {
    setContext(context);
  }, [context, setContext]);

  return { context, hint: CONTEXT_HINTS.full[context.page] };
}