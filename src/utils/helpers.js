import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Format a number as Rwandan Francs (RWF).
 * @param {number} amount
 * @returns {string} e.g. "RWF 2,500"
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return 'RWF 0';
  const num = Number(amount);
  if (isNaN(num)) return 'RWF 0';
  return `RWF ${num.toLocaleString('en-RW')}`;
}

/**
 * Format a date string into a readable format.
 * @param {string|Date} date
 * @returns {string} e.g. "January 15, 2026"
 */
export function formatDate(date) {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Format a date string with time.
 * @param {string|Date} date
 * @returns {string} e.g. "January 15, 2026 at 2:30 PM"
 */
export function formatDateTime(date) {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Format a date as a short string.
 * @param {string|Date} date
 * @returns {string} e.g. "Jan 15, 2026"
 */
export function formatDateShort(date) {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Returns a Tailwind CSS color class for a given status string.
 * @param {string} status
 * @returns {string} Tailwind classes for text color and background
 */
export function getStatusColor(status) {
  const colors = {
    // Fare statuses
    DRAFT: 'text-gray-600 bg-gray-100',
    PENDING_REVIEW: 'text-amber-600 bg-amber-100',
    VERIFIED: 'text-blue-600 bg-blue-100',
    PUBLISHED: 'text-green-600 bg-green-100',
    EXPIRED: 'text-red-500 bg-red-50',
    REJECTED: 'text-red-600 bg-red-100',
    ARCHIVED: 'text-gray-500 bg-gray-50',

    // Generic
    ACTIVE: 'text-green-600 bg-green-100',
    INACTIVE: 'text-gray-500 bg-gray-100',
    BLOCKED: 'text-red-600 bg-red-100',
    ERROR: 'text-red-700 bg-red-100',
    NEW: 'text-blue-600 bg-blue-100',
    APPROVED: 'text-green-600 bg-green-100',
    OPEN: 'text-blue-600 bg-blue-100',
    IN_PROGRESS: 'text-amber-600 bg-amber-100',
    RESOLVED: 'text-green-600 bg-green-100',
    CLOSED: 'text-gray-500 bg-gray-100',
    DISMISSED: 'text-gray-400 bg-gray-50',
    UNDER_REVIEW: 'text-amber-600 bg-amber-100',
    HIGH: 'text-green-600 bg-green-100',
    MEDIUM: 'text-amber-600 bg-amber-100',
    LOW: 'text-red-600 bg-red-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}

/**
 * Returns a human-readable label for a given status string.
 * @param {string} status
 * @returns {string}
 */
export function getStatusLabel(status) {
  const labels = {
    DRAFT: 'Draft',
    PENDING_REVIEW: 'Pending Review',
    VERIFIED: 'Verified',
    PUBLISHED: 'Published',
    EXPIRED: 'Expired',
    REJECTED: 'Rejected',
    ARCHIVED: 'Archived',
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    BLOCKED: 'Blocked',
    ERROR: 'Error',
    NEW: 'New',
    PENDING_VERIFICATION: 'Pending Verification',
    APPROVED: 'Approved',
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
    DISMISSED: 'Dismissed',
    UNDER_REVIEW: 'Under Review',
    UNVERIFIED: 'Unverified',
  };
  return labels[status] || status?.replace(/_/g, ' ') || 'Unknown';
}

/**
 * Returns a human-readable label for a source category.
 * @param {string} category
 * @returns {string}
 */
export function getSourceCategoryLabel(category) {
  const labels = {
    OFFICIAL: 'Official Government',
    PUBLIC_INSTITUTION: 'Public Institution',
    OPERATOR: 'Transport Operator',
    NEWS: 'News & Media',
    API: 'API / Data Feed',
    OTHER: 'Other',
  };
  return labels[category] || category || 'Unknown';
}

/**
 * Returns a human-readable label for a transport type ID.
 * @param {string} type
 * @returns {string}
 */
export function getTransportTypeLabel(type) {
  const labels = {
    bus: 'Bus',
    moto: 'Moto',
    taxi: 'Taxi',
    minibus: 'Minibus',
    truck: 'Truck',
  };
  return labels[type] || type || 'Unknown';
}

/**
 * Truncate a string to a given length with ellipsis.
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export function truncate(str, length = 50) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

/**
 * Debounce a function.
 * @param {Function} fn
 * @param {number} ms
 * @returns {Function}
 */
export function debounce(fn, ms = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Case-insensitive search of a query within text.
 * @param {string} query
 * @param {string} text
 * @returns {boolean}
 */
export function searchInText(query, text) {
  if (!query || !text) return false;
  return text.toLowerCase().includes(query.toLowerCase());
}

/**
 * Merge class names using clsx and tailwind-merge.
 * @param {...(string|Object|Array)} args
 * @returns {string}
 */
export function classNames(...args) {
  return twMerge(clsx(...args));
}

/**
 * Generate a deterministic route key from origin and destination.
 * @param {string} origin
 * @param {string} destination
 * @returns {string}
 */
export function generateRouteKey(origin, destination) {
  if (!origin || !destination) return '';
  const sorted = [origin.toLowerCase(), destination.toLowerCase()].sort();
  return sorted.join('_to_');
}

/**
 * Calculate distance between two coordinates using Haversine formula.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Format distance in km.
 * @param {number} km
 * @returns {string}
 */
export function formatDistance(km) {
  if (!km && km !== 0) return 'N/A';
  return `${km} km`;
}

/**
 * Format time in minutes to a readable string.
 * @param {number} minutes
 * @returns {string} e.g. "1h 30min"
 */
export function formatTime(minutes) {
  if (!minutes && minutes !== 0) return 'N/A';
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/**
 * Returns a Tailwind color class for a verification status.
 * @param {string} status
 * @returns {string}
 */
export function getVerificationColor(status) {
  const colors = {
    UNVERIFIED: 'text-gray-500 bg-gray-50 border-gray-200',
    UNDER_REVIEW: 'text-amber-600 bg-amber-50 border-amber-200',
    VERIFIED: 'text-green-600 bg-green-50 border-green-200',
    REJECTED: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[status] || 'text-gray-500 bg-gray-50 border-gray-200';
}
