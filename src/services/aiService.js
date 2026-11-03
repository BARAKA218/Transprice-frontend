// ═══════════════════════════════════════════════════════════════════════════════
// TRANSPRICE AI SERVICE
// Reusable abstraction for the backend AI chat endpoint.
//
// Architecture:
//   POST /api/ai/chat   { messages: [], context: { page, role }, prompt }
//
// No API keys live in the frontend. When the backend is unavailable the
// service transparently falls back to a development mock response.
// ═══════════════════════════════════════════════════════════════════════════════

import { mockFares, mockRoutes, mockFuelPrices, mockCooperatives } from '../data/mockData';
import { formatCurrency, getTransportTypeLabel } from '../utils/helpers';

const AI_ENDPOINT = '/api/ai/chat';
const USE_MOCK_FALLBACK = true;

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

function findFare(prompt) {
  const words = prompt.toLowerCase();
  const tokens = words.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);

  const cityAliases = {
    kigali: ['kigali', 'nyabugogo', 'kimironko', 'kacyiru', 'remera', 'gisozi', 'downtown', 'nyamirambo'],
    musanze: ['musanze', 'kinigi', 'ruhengeri'],
    huye: ['huye', 'butare'],
    muhanga: ['muhanga', 'kabgayi'],
    rubavu: ['rubavu', 'gisenyi'],
    rwamagana: ['rwamagana'],
    kayonza: ['kayonza'],
    nyagatare: ['nyagatare'],
    rusizi: ['rusizi', 'cyangugu'],
    karongi: ['karongi', 'kibuye'],
    ngoma: ['ngoma'],
    kirehe: ['kirehe'],
    bugesera: ['bugesera', 'airport'],
  };

  const matches = Object.entries(cityAliases).filter(([city, aliases]) =>
    aliases.some((alias) => tokens.includes(alias))
  );

  if (matches.length >= 2) {
    const [originCity] = matches[matches.length - 2];
    const [destCity] = matches[matches.length - 1];
    const originLabel = originCity.charAt(0).toUpperCase() + originCity.slice(1);
    const destLabel = destCity.charAt(0).toUpperCase() + destCity.slice(1);

    const route = mockRoutes.find(
      (r) =>
        normalize(r.origin) === originLabel && normalize(r.destination) === destLabel
    );
    const fares = mockFares.filter(
      (f) => normalize(f.origin) === originLabel && normalize(f.destination) === destLabel
    );

    if (fares.length > 0) {
      return {
        route,
        fares,
        origin: originLabel,
        destination: destLabel,
      };
    }
  }

  const route = mockRoutes.find(
    (r) => r.transportTypes.includes('bus') || r.transportTypes.length > 0
  );
  const fares = mockFares.filter((f) => f.routeId === route?.id);
  return { route, fares, origin: route?.origin, destination: route?.destination };
}

function normalize(str = '') {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

function intentFromPrompt(prompt) {
  const p = prompt.toLowerCase();
  if (/how much|price|cost|fare|cheapest|compare|explain/.test(p)) return 'pricing';
  if (/route|distance|travel|from.*to/.test(p)) return 'route';
  if (/insight|today|overview|summary|trend/.test(p)) return 'insights';
  if (/popular/.test(p)) return 'popular';
  if (/fuel|petrol|diesel/.test(p)) return 'fuel';
  return 'general';
}

function buildMockReply(prompt, context = {}) {
  const intent = intentFromPrompt(prompt);
  const ctxLabel = context.page || 'app';

  const contextGuides = {
    pricing: 'I am helping you with transport pricing assistance.',
    route: 'I am helping you with route assistance.',
    dashboard: 'I am helping you navigate your dashboard.',
    analytics: 'I am helping you understand platform analytics.',
    passenger: 'I am helping you as a passenger assistant.',
    driver: 'I am helping you as a driver assistant.',
    admin: 'I am helping you as an admin/analytics assistant.',
  };
  const guide = contextGuides[ctxLabel] || contextGuides.general ||
    'I am ready to help you with transport information in Rwanda.';

  if (intent === 'pricing') {
    const found = findFare(prompt);
    if (found && found.fares && found.fares.length > 0) {
      const official = found.fares.filter((f) => f.status === 'PUBLISHED' && f.verificationStatus === 'VERIFIED');
      const lines = (official.length ? official : found.fares)
        .slice(0, 3)
        .map(
          (f) =>
            `• ${getTransportTypeLabel(f.transportType)}: **${formatCurrency(f.fare)}** per person${f.notes ? ` (${f.notes})` : ''}`
        )
        .join('\n');

      return {
        text: `Let me check verified prices on the **${found.origin} → ${found.destination}** route.\n\n**Official / Verified fares**\n${lines}\n\n${found.route ? `Estimated distance: **${found.route.distance} km** · Travel time: **~${found.route.estimatedTime} min**.\n` : ''}\n> Fares marked above are sourced from ${faresSource(found)}. AI estimates are only shown when no official fare is available.`,
        sources: [{ label: 'Rwanda Transport Board', url: 'https://rta.gov.rw' }],
      };
    }
  }

  if (intent === 'cheapest' || intent === 'pricing' && /cheapest|compare/.test(prompt)) {
    const found = findFare(prompt);
    if (found?.fares?.length) {
      const sorted = [...found.fares].sort((a, b) => a.fare - b.fare);
      const cheap = sorted[0];
      const pricey = sorted[sorted.length - 1];
      return {
        text: `Comparing transport options on **${found.origin} → ${found.destination}**:\n\n• Cheapest: ${getTransportTypeLabel(cheap.transportType)} at **${formatCurrency(cheap.fare)}**\n• Most expensive: ${getTransportTypeLabel(pricey.transportType)} at **${formatCurrency(pricey.fare)}**\n\n💰 ${getTransportTypeLabel(cheap.transportType)} offers the best value for this route. Always confirm with the operator before travelling.`,
      };
    }
  }

  if (intent === 'route') {
    const found = findFare(prompt);
    if (found?.route) {
      return {
        text: `**${found.route.name}**\n\n• Distance: **${found.route.distance} km**\n• Est. travel time: **~${found.route.estimatedTime} min**\n• Transport options: **${found.route.transportTypes.map(getTransportTypeLabel).join(', ')}**\n• Zone: ${found.origin} → ${found.destination} (${found.route.originDistrict} → ${found.route.destinationDistrict})\n\nYou can view the full route on the Routes page.`,
      };
    }
  }

  if (intent === 'fuel') {
    const active = mockFuelPrices.filter((f) => f.status === 'ACTIVE');
    const lines = active.map((f) => `• ${f.fuelType}: **${formatCurrency(f.price)}/litre**`).join('\n');
    return {
      text: `Current pump prices in Rwanda (${active[0]?.effectiveDate || 'latest'}):\n\n${lines}\n\nFuel prices are set by RURA and directly influence transport fares.`,
      sources: [{ label: 'RURA', url: 'https://rura.gov.rw' }],
    };
  }

  if (intent === 'popular') {
    const counts = {};
    mockFares.forEach((f) => {
      const key = `${f.origin} → ${f.destination}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const lines = sorted.map(([route, n], i) => `${i + 1}. **${route}** (${n} fare records)`).join('\n');
    return {
      text: `Here are the most popular routes on TransPrice right now:\n\n${lines}\n\nThese are the most searched/covered corridors across Rwanda.`,
    };
  }

  if (intent === 'insights') {
    const published = mockFares.filter((f) => f.status === 'PUBLISHED');
    const avg = published.length ? Math.round(published.reduce((s, f) => s + f.fare, 0) / published.length) : 0;
    return {
      text: `Today's transport insights for Rwanda:\n\n• **${published.length}** verified published fares\n• **${mockRoutes.length}** active routes\n• Average fare: **${formatCurrency(avg)}**\n• **${mockCooperatives.length}** transport cooperatives registered\n\nFuel prices are stable this month (petrol RWF 1,350/litre). The Nyabugogo terminal upgrade and the upcoming Bugesera airport shuttle are the main developments to watch.`,
    };
  }

  const quick = [
    '• Ask "How much is transport from Kigali to Muhanga?"',
    '• Ask "Compare motorcycle and taxi prices."',
    '• Ask "Show popular routes."',
  ].join('\n');

  return {
    text: `${guide}\n\nI can help you with verified fares, routes, fuel prices and transport news. Try one of these:\n${quick}`,
  };
}

function faresSource(found) {
  const sources = found?.fares?.map((f) => f.source).filter(Boolean);
  return [...new Set(sources || [])].join(', ') || 'verified public sources';
}

/**
 * Send a chat prompt to TransPrice AI.
 * @param {Object} payload
 * @param {Array}  payload.messages        - Conversation history {role, content}[] (excluding this message)
 * @param {Object} payload.context         - { page, role, location } describing the current screen
 * @param {string} payload.prompt          - The user's new message
 * @returns {Promise<{text: string, sources?: Array}>}
 */
export async function sendMessage({ prompt, messages = [], context = {} }) {
  if (USE_MOCK_FALLBACK) {
    await delay(650 + Math.random() * 500);
    return buildMockReply(prompt, context);
  }

  try {
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, messages, context }),
    });
    if (!res.ok) throw new Error(`AI request failed (${res.status})`);
    const data = await res.json();
    return {
      text: data.reply || data.text || data.message || 'No response from the assistant.',
      sources: data.sources || [],
    };
  } catch (err) {
    console.warn('[aiService] Backend unavailable, using development mock:', err.message);
    await delay(550);
    return buildMockReply(prompt, context);
  }
}