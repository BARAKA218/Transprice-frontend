/**
 * TransPrice Type Definitions
 * Rwanda Transport Pricing Platform
 *
 * All data models are defined using JSDoc comments for documentation.
 * Constants and enums are exported as plain objects for compatibility.
 */

// ─── Roles ───────────────────────────────────────────────────────────────────
export const ROLES = {
  PASSENGER: 'PASSENGER',
  DRIVER: 'DRIVER',
  COOPERATIVE_ADMIN: 'COOPERATIVE_ADMIN',
  AUTHORITY: 'AUTHORITY',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

// ─── Fare Statuses ───────────────────────────────────────────────────────────
export const FARE_STATUSES = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  VERIFIED: 'VERIFIED',
  PUBLISHED: 'PUBLISHED',
  EXPIRED: 'EXPIRED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED',
};

// ─── Source Categories ────────────────────────────────────────────────────────
export const SOURCE_CATEGORIES = {
  OFFICIAL: 'OFFICIAL',
  PUBLIC_INSTITUTION: 'PUBLIC_INSTITUTION',
  OPERATOR: 'OPERATOR',
  NEWS: 'NEWS',
  API: 'API',
  OTHER: 'OTHER',
};

// ─── Source Statuses ──────────────────────────────────────────────────────────
export const SOURCE_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_REVIEW: 'PENDING_REVIEW',
  BLOCKED: 'BLOCKED',
  ERROR: 'ERROR',
};

// ─── Research Statuses ────────────────────────────────────────────────────────
export const RESEARCH_STATUSES = {
  NEW: 'NEW',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED',
};

// ─── Transport Types ──────────────────────────────────────────────────────────
export const TRANSPORT_TYPES = [
  { id: 'bus', label: 'Bus', icon: 'Bus' },
  { id: 'moto', label: 'Moto', icon: 'Bike' },
  { id: 'taxi', label: 'Taxi', icon: 'Car' },
  { id: 'minibus', label: 'Minibus', icon: 'Minibus' },
  { id: 'truck', label: 'Truck', icon: 'Truck' },
];

// ─── Update Categories ────────────────────────────────────────────────────────
export const UPDATE_CATEGORIES = {
  FARE: 'FARE',
  ROUTE: 'ROUTE',
  FUEL: 'FUEL',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  SERVICE_UPDATE: 'SERVICE_UPDATE',
  GENERAL: 'GENERAL',
};

// ─── Notification Types ───────────────────────────────────────────────────────
export const NOTIFICATION_TYPES = {
  FARE_UPDATED: 'FARE_UPDATED',
  ROUTE_ADDED: 'ROUTE_ADDED',
  TARIFF_APPROVED: 'TARIFF_APPROVED',
  TARIFF_REJECTED: 'TARIFF_REJECTED',
  COMPLAINT_UPDATE: 'COMPLAINT_UPDATE',
  TRANSPORT_ANNOUNCEMENT: 'TRANSPORT_ANNOUNCEMENT',
  FUEL_UPDATE: 'FUEL_UPDATE',
  SYSTEM: 'SYSTEM',
};

// ─── Verification Levels ──────────────────────────────────────────────────────
export const VERIFICATION_LEVELS = {
  UNVERIFIED: 'UNVERIFIED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
};

// ─── Complaint Categories ─────────────────────────────────────────────────────
export const COMPLAINT_CATEGORIES = {
  OVERCHARGING: 'OVERCHARGING',
  ROUTE_DEVIATION: 'ROUTE_DEVIATION',
  VEHICLE_CONDITION: 'VEHICLE_CONDITION',
  DRIVER_BEHAVIOR: 'DRIVER_BEHAVIOR',
  SAFETY: 'SAFETY',
  LATE_SERVICE: 'LATE_SERVICE',
  REFUSAL_TO_CARRY: 'REFUSAL_TO_CARRY',
  OTHER: 'OTHER',
};

// ─── Complaint Statuses ───────────────────────────────────────────────────────
export const COMPLAINT_STATUSES = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  DISMISSED: 'DISMISSED',
};

// ─── Audit Actions ────────────────────────────────────────────────────────────
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  PUBLISH: 'PUBLISH',
  UNPUBLISH: 'UNPUBLISH',
  REJECT: 'REJECT',
  APPROVE: 'APPROVE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  EXPORT: 'EXPORT',
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA MODEL SHAPES (JSDoc)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} email - User email
 * @property {string} name - Full name
 * @property {string} role - One of ROLES values
 * @property {string} [avatar] - Avatar URL
 * @property {string} [phone] - Phone number
 * @property {string} [district] - District of residence
 * @property {string} [sector] - Sector of residence
 * @property {boolean} isActive - Whether user account is active
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} [lastLoginAt]
 */

/**
 * @typedef {Object} Route
 * @property {string} id
 * @property {string} name - Route name e.g. "Kimironko - Downtown"
 * @property {string} origin - Origin stop/location
 * @property {string} destination - Destination stop/location
 * @property {string} originDistrict - District of origin
 * @property {string} destinationDistrict - District of destination
 * @property {number} distance - Distance in kilometers
 * @property {number} estimatedTime - Estimated travel time in minutes
 * @property {string[]} transportTypes - Array of transport type IDs
 * @property {Object} coordinates
 * @property {Object} coordinates.origin - { lat, lng }
 * @property {Object} coordinates.destination - { lat, lng }
 * @property {string} status - ACTIVE | INACTIVE | ARCHIVED
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Fare
 * @property {string} id
 * @property {string} routeId
 * @property {string} routeName
 * @property {string} origin
 * @property {string} destination
 * @property {string} transportType - bus | moto | taxi | minibus | truck
 * @property {number} fare - Price in RWF
 * @property {string} currency - Always 'RWF'
 * @property {string} district
 * @property {string} sector
 * @property {string} effectiveDate - ISO date string
 * @property {string} [expiryDate] - ISO date string
 * @property {string} source - Source name
 * @property {string} [sourceUrl]
 * @property {string} sourceDate
 * @property {string} verificationStatus - One of VERIFICATION_LEVELS
 * @property {string} status - One of FARE_STATUSES
 * @property {string} [notes]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {string} updatedBy - User ID who last updated
 */

/**
 * @typedef {Object} FuelPrice
 * @property {string} id
 * @property {string} fuelType - Petrol | Diesel | LPG
 * @property {number} price - Price per litre in RWF
 * @property {string} currency - Always 'RWF'
 * @property {string} effectiveDate
 * @property {string} source
 * @property {string} [sourceUrl]
 * @property {string} status - ACTIVE | INACTIVE
 * @property {string} [notes]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} TransportUpdate
 * @property {string} id
 * @property {string} title
 * @property {string} category - One of UPDATE_CATEGORIES
 * @property {string} description
 * @property {string} source
 * @property {string} [sourceUrl]
 * @property {string} publicationDate
 * @property {string} [effectiveDate]
 * @property {string} [expiryDate]
 * @property {string} status - DRAFT | PUBLISHED | ARCHIVED
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Source
 * @property {string} id
 * @property {string} name
 * @property {string} [website]
 * @property {string} type - One of SOURCE_CATEGORIES
 * @property {string} [description]
 * @property {string} country
 * @property {string} category
 * @property {string} reliabilityLevel - high | medium | low
 * @property {string} [lastChecked]
 * @property {string} status - One of SOURCE_STATUSES
 * @property {string} [notes]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} ResearchItem
 * @property {string} id
 * @property {string} sourceId
 * @property {string} sourceName
 * @property {string} type - fare | route | fuel | announcement
 * @property {string} title
 * @property {number} [oldFare]
 * @property {number} [newFare]
 * @property {string} [routeName]
 * @property {string} [transportType]
 * @property {string} discoveryDate
 * @property {string} status - One of RESEARCH_STATUSES
 * @property {string} [adminNotes]
 * @property {string} [verifiedBy]
 * @property {string} [verifiedAt]
 * @property {string} [publishedAt]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Complaint
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {string} category - One of COMPLAINT_CATEGORIES
 * @property {string} description
 * @property {string} route
 * @property {string} status - One of COMPLAINT_STATUSES
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} AuditLog
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {string} action - One of AUDIT_ACTIONS
 * @property {string} recordType - fare | route | source | user | etc
 * @property {string} recordId
 * @property {*} [oldValue]
 * @property {*} [newValue]
 * @property {string} [ipAddress]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} District
 * @property {string} id
 * @property {string} name
 * @property {string} province
 * @property {number} [lat]
 * @property {number} [lng]
 */

/**
 * @typedef {Object} Sector
 * @property {string} id
 * @property {string} name
 * @property {string} districtId
 * @property {string} districtName
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalFares
 * @property {number} publishedFares
 * @property {number} totalRoutes
 * @property {number} totalUsers
 * @property {number} totalComplaints
 * @property {number} openComplaints
 * @property {number} pendingResearch
 * @property {number} activeSources
 * @property {number} avgFareRwf
 * @property {Object} fareByTransportType
 * @property {Object} fareByDistrict
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} type - One of NOTIFICATION_TYPES
 * @property {string} title
 * @property {string} message
 * @property {boolean} isRead
 * @property {string} [link]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} data
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 * @property {number} totalPages
 */

/**
 * @typedef {Object} FilterParams
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {string} [sortBy]
 * @property {string} [sortOrder] - 'asc' | 'desc'
 * @property {string} [search]
 */
