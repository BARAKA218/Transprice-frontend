import {
  mockRoutes,
  mockFares,
  mockTransportUpdates,
  mockFuelPrices,
  mockSources,
  mockResearchItems,
  mockComplaints,
  mockAuditLogs,
  mockUsers,
  mockDistricts,
  mockSectors,
  mockNotifications,
  mockTrips,
  mockVehicles,
  mockDrivers,
  mockProposals,
  mockCooperatives,
  mockMembers,
} from '../data/mockData';
import { searchInText } from '../utils/helpers';
import {
  buildFareResult,
  searchSuggestions as engineSearchSuggestions,
  getPopularRoutes as engineGetPopularRoutes,
} from './searchService';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
export const generateId = () => Math.random().toString(36).substr(2, 9);

function paginate(items, page = 1, pageSize = 20) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

function applyFilters(items, filters = {}) {
  let result = [...items];

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (key === 'search' || key === 'q') {
      result = result.filter((item) =>
        Object.values(item).some(
          (v) => typeof v === 'string' && searchInText(value, v)
        )
      );
    } else if (key === 'sortBy') {
      // handled separately
    } else if (key === 'sortOrder') {
      // handled separately
    } else if (Array.isArray(value) && value.length > 0) {
      result = result.filter((item) => value.includes(item[key]));
    } else if (typeof value === 'string') {
      result = result.filter(
        (item) =>
          typeof item[key] === 'string' &&
          item[key].toLowerCase().includes(value.toLowerCase())
      );
    }
  });

  const sortBy = filters.sortBy || 'createdAt';
  const sortOrder = filters.sortOrder || 'desc';
  result.sort((a, b) => {
    const aVal = a[sortBy] || '';
    const bVal = b[sortBy] || '';
    if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  return result;
}

// ─── In-memory data stores (mutable copies) ──────────────────────────────────
const stores = {
  routes: [...mockRoutes],
  fares: [...mockFares],
  transportUpdates: [...mockTransportUpdates],
  fuelPrices: [...mockFuelPrices],
  sources: [...mockSources],
  researchItems: [...mockResearchItems],
  complaints: [...mockComplaints],
  auditLogs: [...mockAuditLogs],
  users: [...mockUsers],
  notifications: [...mockNotifications],
  trips: [...mockTrips],
  vehicles: [...mockVehicles],
  drivers: [...mockDrivers],
  proposals: [...mockProposals],
  cooperatives: [...mockCooperatives],
  members: [...mockMembers],
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const authService = {
  async login(email, _password) {
    await delay(400);
    const user = stores.users.find((u) => u.email === email);
    if (user) {
      const updated = { ...user, lastLoginAt: new Date().toISOString() };
      const idx = stores.users.findIndex((u) => u.id === user.id);
      stores.users[idx] = updated;
      return { success: true, user: updated, token: `demo-token-${user.id}` };
    }
    const roleMap = {
      passenger: 'PASSENGER',
      driver: 'DRIVER',
      cooperative: 'COOPERATIVE_ADMIN',
      authority: 'AUTHORITY',
      admin: 'SUPER_ADMIN',
    };
    const prefix = email.split('@')[0].toLowerCase();
    const role = roleMap[prefix] || 'PASSENGER';
    const newUser = {
      id: generateId(),
      email,
      name: prefix.charAt(0).toUpperCase() + prefix.slice(1),
      role,
      avatar: null,
      phone: '',
      district: '',
      sector: '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    stores.users.push(newUser);
    return { success: true, user: newUser, token: `demo-token-${newUser.id}` };
  },

  async register(data) {
    await delay(400);
    const existing = stores.users.find((u) => u.email === data.email);
    if (existing) return { success: false, error: 'Email already registered' };
    const newUser = {
      id: generateId(),
      email: data.email,
      name: data.name,
      role: data.role || 'PASSENGER',
      avatar: null,
      phone: data.phone || '',
      district: data.district || '',
      sector: data.sector || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    stores.users.push(newUser);
    return { success: true, user: newUser, token: `demo-token-${newUser.id}` };
  },

  async logout() {
    await delay(200);
    return { success: true };
  },

  async getCurrentUser() {
    await delay(100);
    return null;
  },

  async forgotPassword(email) {
    await delay(400);
    return { success: true, message: 'Password reset email sent (demo)' };
  },

  async resetPassword(_token, _password) {
    await delay(400);
    return { success: true, message: 'Password reset successfully (demo)' };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FARE SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const fareService = {
  async getFares(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.fares, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getFare(id) {
    await delay(200);
    return stores.fares.find((f) => f.id === id) || null;
  },

  async createFare(data) {
    await delay(400);
    const fare = {
      id: generateId(),
      ...data,
      currency: 'RWF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stores.fares.unshift(fare);
    return fare;
  },

  async updateFare(id, data) {
    await delay(400);
    const idx = stores.fares.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    stores.fares[idx] = { ...stores.fares[idx], ...data, updatedAt: new Date().toISOString() };
    return stores.fares[idx];
  },

  async publishFare(id) {
    await delay(400);
    return this.updateFare(id, { status: 'PUBLISHED', verificationStatus: 'VERIFIED' });
  },

  async unpublishFare(id) {
    await delay(400);
    return this.updateFare(id, { status: 'VERIFIED' });
  },

  async archiveFare(id) {
    await delay(400);
    return this.updateFare(id, { status: 'ARCHIVED' });
  },

  async getFareHistory(routeId) {
    await delay(300);
    return stores.fares.filter((f) => f.routeId === routeId).sort((a, b) => a.effectiveDate > b.effectiveDate ? -1 : 1);
  },

  async searchFares(query) {
    await delay(300);
    if (typeof query === 'string') {
      return stores.fares.filter((f) =>
        searchInText(query, f.routeName) ||
        searchInText(query, f.origin) ||
        searchInText(query, f.destination) ||
        searchInText(query, f.transportType)
      );
    }
    const result = buildFareResult(query, { routes: stores.routes, fares: stores.fares });
    return result.ok ? result.options : [];
  },

  async findFareResult({ origin, destination, transportType }) {
    await delay(300);
    return buildFareResult(
      { origin, destination, transportType },
      { routes: stores.routes, fares: stores.fares }
    );
  },

  async getSearchSuggestions(query, limit = 6) {
    await delay(120);
    return engineSearchSuggestions(query, { routes: stores.routes, fares: stores.fares, limit });
  },

  async getPopularRoutes() {
    await delay(100);
    return engineGetPopularRoutes({ routes: stores.routes, fares: stores.fares });
  },

  async getRecentFares(limit = 5) {
    await delay(200);
    return stores.fares.slice(0, limit);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const routeService = {
  async getRoutes(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.routes, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getRoute(id) {
    await delay(200);
    return stores.routes.find((r) => r.id === id) || null;
  },

  async createRoute(data) {
    await delay(400);
    const route = {
      id: generateId(),
      ...data,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stores.routes.unshift(route);
    return route;
  },

  async updateRoute(id, data) {
    await delay(400);
    const idx = stores.routes.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    stores.routes[idx] = { ...stores.routes[idx], ...data, updatedAt: new Date().toISOString() };
    return stores.routes[idx];
  },

  async archiveRoute(id) {
    await delay(400);
    return this.updateRoute(id, { status: 'ARCHIVED' });
  },

  async searchRoutes(query) {
    await delay(300);
    return stores.routes.filter((r) =>
      searchInText(query, r.name) ||
      searchInText(query, r.origin) ||
      searchInText(query, r.destination) ||
      searchInText(query, r.originDistrict) ||
      searchInText(query, r.destinationDistrict)
    );
  },

  async getRouteFares(routeId) {
    await delay(300);
    return stores.fares.filter((f) => f.routeId === routeId);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSPORT UPDATE SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const transportUpdateService = {
  async getUpdates(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.transportUpdates, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getUpdate(id) {
    await delay(200);
    return stores.transportUpdates.find((u) => u.id === id) || null;
  },

  async createUpdate(data) {
    await delay(400);
    const update = {
      id: generateId(),
      ...data,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    };
    stores.transportUpdates.unshift(update);
    return update;
  },

  async updateUpdate(id, data) {
    await delay(400);
    const idx = stores.transportUpdates.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    stores.transportUpdates[idx] = { ...stores.transportUpdates[idx], ...data };
    return stores.transportUpdates[idx];
  },

  async publishUpdate(id) {
    await delay(400);
    return this.updateUpdate(id, { status: 'PUBLISHED' });
  },

  async unpublishUpdate(id) {
    await delay(400);
    return this.updateUpdate(id, { status: 'DRAFT' });
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FUEL PRICE SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const fuelPriceService = {
  async getFuelPrices(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.fuelPrices, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getFuelPrice(id) {
    await delay(200);
    return stores.fuelPrices.find((f) => f.id === id) || null;
  },

  async createFuelPrice(data) {
    await delay(400);
    const fuelPrice = {
      id: generateId(),
      ...data,
      currency: 'RWF',
      createdAt: new Date().toISOString(),
    };
    stores.fuelPrices.unshift(fuelPrice);
    return fuelPrice;
  },

  async updateFuelPrice(id, data) {
    await delay(400);
    const idx = stores.fuelPrices.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    stores.fuelPrices[idx] = { ...stores.fuelPrices[idx], ...data };
    return stores.fuelPrices[idx];
  },

  async getCurrentFuelPrices() {
    await delay(200);
    return stores.fuelPrices.filter((f) => f.status === 'ACTIVE');
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCE SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const sourceService = {
  async getSources(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.sources, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getSource(id) {
    await delay(200);
    return stores.sources.find((s) => s.id === id) || null;
  },

  async createSource(data) {
    await delay(400);
    const source = {
      id: generateId(),
      ...data,
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
    };
    stores.sources.unshift(source);
    return source;
  },

  async updateSource(id, data) {
    await delay(400);
    const idx = stores.sources.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    stores.sources[idx] = { ...stores.sources[idx], ...data };
    return stores.sources[idx];
  },

  async getSourceHealth(id) {
    await delay(500);
    const source = stores.sources.find((s) => s.id === id);
    if (!source) return null;
    const items = stores.researchItems.filter((r) => r.sourceId === id);
    return {
      sourceId: id,
      totalDiscoveries: items.length,
      verified: items.filter((r) => r.status === 'PUBLISHED' || r.status === 'APPROVED').length,
      rejected: items.filter((r) => r.status === 'REJECTED').length,
      pending: items.filter((r) => r.status === 'NEW' || r.status === 'PENDING_VERIFICATION').length,
      lastChecked: source.lastChecked,
      reliabilityLevel: source.reliabilityLevel,
    };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESEARCH SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const researchService = {
  async getDiscoveries(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.researchItems, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getDiscovery(id) {
    await delay(200);
    return stores.researchItems.find((r) => r.id === id) || null;
  },

  async verifyDiscovery(id, data) {
    await delay(400);
    const idx = stores.researchItems.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    stores.researchItems[idx] = {
      ...stores.researchItems[idx],
      status: 'PENDING_VERIFICATION',
      adminNotes: data.adminNotes || stores.researchItems[idx].adminNotes,
    };
    return stores.researchItems[idx];
  },

  async rejectDiscovery(id, data) {
    await delay(400);
    const idx = stores.researchItems.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    stores.researchItems[idx] = {
      ...stores.researchItems[idx],
      status: 'REJECTED',
      adminNotes: data.adminNotes || 'Rejected by admin',
      verifiedBy: data.verifiedBy || 'admin',
      verifiedAt: new Date().toISOString(),
    };
    return stores.researchItems[idx];
  },

  async approveDiscovery(id) {
    await delay(400);
    const idx = stores.researchItems.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    stores.researchItems[idx] = {
      ...stores.researchItems[idx],
      status: 'APPROVED',
      verifiedAt: new Date().toISOString(),
    };
    return stores.researchItems[idx];
  },

  async publishDiscovery(id) {
    await delay(400);
    const idx = stores.researchItems.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    stores.researchItems[idx] = {
      ...stores.researchItems[idx],
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
    };
    return stores.researchItems[idx];
  },

  async importDiscovery(id) {
    await delay(500);
    const item = stores.researchItems.find((r) => r.id === id);
    if (!item) return null;
    if (item.type === 'fare' && item.routeName && item.newFare) {
      const fare = {
        id: generateId(),
        routeId: '',
        routeName: item.routeName,
        origin: item.routeName.split('→')[0]?.trim() || '',
        destination: item.routeName.split('→')[1]?.trim() || '',
        transportType: item.transportType || 'bus',
        fare: item.newFare,
        currency: 'RWF',
        district: '',
        sector: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        source: item.sourceName,
        sourceDate: item.discoveryDate,
        verificationStatus: 'VERIFIED',
        status: 'PUBLISHED',
        notes: `Imported from research item ${item.id}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'system',
      };
      stores.fares.unshift(fare);
      return { success: true, fare };
    }
    return { success: false, error: 'Unable to auto-import this discovery' };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLAINT SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const complaintService = {
  async getComplaints(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.complaints, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getComplaint(id) {
    await delay(200);
    return stores.complaints.find((c) => c.id === id) || null;
  },

  async createComplaint(data) {
    await delay(400);
    const complaint = {
      id: generateId(),
      ...data,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stores.complaints.unshift(complaint);
    return complaint;
  },

  async updateComplaint(id, data) {
    await delay(400);
    const idx = stores.complaints.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    stores.complaints[idx] = { ...stores.complaints[idx], ...data, updatedAt: new Date().toISOString() };
    return stores.complaints[idx];
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const userService = {
  async getUsers(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.users, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getUser(id) {
    await delay(200);
    return stores.users.find((u) => u.id === id) || null;
  },

  async createUser(data) {
    await delay(400);
    const user = {
      id: generateId(),
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stores.users.push(user);
    return user;
  },

  async updateUser(id, data) {
    await delay(400);
    const idx = stores.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    stores.users[idx] = { ...stores.users[idx], ...data, updatedAt: new Date().toISOString() };
    return stores.users[idx];
  },

  async getUserStats() {
    await delay(300);
    const total = stores.users.length;
    const byRole = {};
    stores.users.forEach((u) => {
      byRole[u.role] = (byRole[u.role] || 0) + 1;
    });
    return { total, byRole };
  },

  async getCurrentDriver() {
    await delay(300);
    const driver = stores.users.find((u) => u.role === 'DRIVER') || stores.users[3];
    const vehicle = stores.vehicles.find((v) => v.driverId === driver?.id) || stores.vehicles[0];
    const weekTrips = stores.trips.filter((t) => t.status === 'COMPLETED').slice(0, 7);
    return {
      success: true,
      data: {
        id: driver?.id || 'u04',
        name: driver?.name || 'Driver One',
        email: driver?.email || 'driver@example.com',
        phone: driver?.phone || '+250788000004',
        licenseNumber: 'DL-2024-001',
        rating: 4.8,
        vehicle,
        earnings: {
          today: weekTrips.length > 0 ? weekTrips[0].earnings : 24000,
          week: weekTrips.reduce((sum, t) => sum + (t.earnings || 0), 0),
        },
      },
    };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const analyticsService = {
  async getDashboardStats() {
    await delay(400);
    const publishedFares = stores.fares.filter((f) => f.status === 'PUBLISHED');
    const avgFare =
      publishedFares.length > 0
        ? Math.round(publishedFares.reduce((sum, f) => sum + f.fare, 0) / publishedFares.length)
        : 0;

    const fareByTransportType = {};
    publishedFares.forEach((f) => {
      fareByTransportType[f.transportType] = (fareByTransportType[f.transportType] || 0) + 1;
    });

    const fareByDistrict = {};
    publishedFares.forEach((f) => {
      if (f.district) fareByDistrict[f.district] = (fareByDistrict[f.district] || 0) + 1;
    });

    return {
      totalFares: stores.fares.length,
      publishedFares: publishedFares.length,
      totalRoutes: stores.routes.length,
      totalUsers: stores.users.length,
      totalComplaints: stores.complaints.length,
      openComplaints: stores.complaints.filter((c) => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length,
      pendingResearch: stores.researchItems.filter((r) => r.status === 'NEW' || r.status === 'PENDING_VERIFICATION').length,
      activeSources: stores.sources.filter((s) => s.status === 'ACTIVE').length,
      avgFareRwf: avgFare,
      fareByTransportType,
      fareByDistrict,
    };
  },

  async getFareTrends() {
    await delay(300);
    const months = {};
    stores.fares.forEach((f) => {
      const d = new Date(f.effectiveDate || f.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) months[key] = { count: 0, totalFare: 0 };
      months[key].count += 1;
      months[key].totalFare += f.fare;
    });
    return Object.entries(months)
      .map(([month, data]) => ({
        month,
        count: data.count,
        avgFare: Math.round(data.totalFare / data.count),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },

  async getRouteActivity() {
    await delay(300);
    const routeCounts = {};
    stores.fares.forEach((f) => {
      if (f.routeName) {
        routeCounts[f.routeName] = (routeCounts[f.routeName] || 0) + 1;
      }
    });
    return Object.entries(routeCounts)
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count);
  },

  async getComplaintStats() {
    await delay(300);
    const byStatus = {};
    const byCategory = {};
    stores.complaints.forEach((c) => {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    });
    return { byStatus, byCategory, total: stores.complaints.length };
  },

  async getResearchStats() {
    await delay(300);
    const byStatus = {};
    const byType = {};
    stores.researchItems.forEach((r) => {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      byType[r.type] = (byType[r.type] || 0) + 1;
    });
    return { byStatus, byType, total: stores.researchItems.length };
  },

  async getSourceActivity() {
    await delay(300);
    return stores.sources.map((s) => {
      const discoveries = stores.researchItems.filter((r) => r.sourceId === s.id);
      return {
        sourceId: s.id,
        sourceName: s.name,
        totalDiscoveries: discoveries.length,
        reliability: s.reliabilityLevel,
        status: s.status,
      };
    });
  },

  async getDistrictActivity() {
    await delay(300);
    const districtFares = {};
    stores.fares.forEach((f) => {
      const d = f.district || 'Unknown';
      districtFares[d] = (districtFares[d] || 0) + 1;
    });
    return Object.entries(districtFares)
      .map(([district, count]) => ({ district, count }))
      .sort((a, b) => b.count - a.count);
  },

  async getTransportUsage() {
    await delay(300);
    const typeCounts = {};
    stores.fares.forEach((f) => {
      typeCounts[f.transportType] = (typeCounts[f.transportType] || 0) + 1;
    });
    return Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  },

  async getRecentActivity() {
    await delay(300);
    return [...stores.auditLogs]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 10);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const notificationService = {
  async getNotifications(filters = {}) {
    await delay(200);
    const filtered = applyFilters(stores.notifications, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async markAsRead(id) {
    await delay(100);
    const idx = stores.notifications.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    stores.notifications[idx] = { ...stores.notifications[idx], isRead: true };
    return stores.notifications[idx];
  },

  async markAllAsRead() {
    await delay(200);
    stores.notifications = stores.notifications.map((n) => ({ ...n, isRead: true }));
    return { success: true };
  },

  async getUnreadCount() {
    await delay(100);
    return stores.notifications.filter((n) => !n.isRead).length;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const auditLogService = {
  async getAuditLogs(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.auditLogs, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getAuditLog(id) {
    await delay(200);
    return stores.auditLogs.find((a) => a.id === id) || null;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DISTRICT & SECTOR SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const locationService = {
  async getDistricts() {
    await delay(200);
    return mockDistricts;
  },

  async getSectors(districtId) {
    await delay(200);
    if (districtId) return mockSectors.filter((s) => s.districtId === districtId);
    return mockSectors;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRIP SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const tripService = {
  async getTrips(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.trips, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getTrip(id) {
    await delay(200);
    return stores.trips.find((t) => t.id === id) || null;
  },

  async getActiveTrip() {
    await delay(200);
    return stores.trips.find((t) => t.status === 'ONGOING') || null;
  },

  async startTrip(data) {
    await delay(400);
    const trip = {
      id: generateId(),
      date: new Date().toISOString(),
      status: 'ONGOING',
      passengers: 0,
      fare: 0,
      earnings: 0,
      ...data,
    };
    stores.trips.unshift(trip);
    return { success: true, data: trip };
  },

  async completeTrip(id, data = {}) {
    await delay(400);
    const idx = stores.trips.findIndex((t) => t.id === id);
    if (idx === -1) return { success: false, error: 'Trip not found' };
    stores.trips[idx] = {
      ...stores.trips[idx],
      ...data,
      status: 'COMPLETED',
    };
    return { success: true, data: stores.trips[idx] };
  },

  async cancelTrip(id, reason) {
    await delay(400);
    const idx = stores.trips.findIndex((t) => t.id === id);
    if (idx === -1) return { success: false, error: 'Trip not found' };
    stores.trips[idx] = { ...stores.trips[idx], status: 'CANCELLED', cancelReason: reason || '' };
    return { success: true, data: stores.trips[idx] };
  },

  async getTripStats(userId) {
    await delay(300);
    const trips = userId
      ? stores.trips
      : stores.trips;
    const completed = trips.filter((t) => t.status === 'COMPLETED');
    return {
      totalTrips: trips.length,
      completedTrips: completed.length,
      cancelledTrips: trips.filter((t) => t.status === 'CANCELLED').length,
      totalSpent: completed.reduce((sum, t) => sum + (t.fare || 0), 0),
    };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// VEHICLE SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const vehicleService = {
  async getVehicles(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.vehicles, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getVehicle(id) {
    await delay(200);
    return stores.vehicles.find((v) => v.id === id) || null;
  },

  async createVehicle(data) {
    await delay(400);
    const vehicle = {
      id: generateId(),
      status: 'ACTIVE',
      registrationStatus: 'PENDING_REVIEW',
      insuranceExpiry: '2026-12-31',
      lastInspection: null,
      cooperativeId: 'coop1',
      driverId: null,
      driverName: 'Unassigned',
      ...data,
      createdAt: new Date().toISOString(),
    };
    stores.vehicles.unshift(vehicle);
    return { success: true, data: vehicle };
  },

  async updateVehicle(id, data) {
    await delay(400);
    const idx = stores.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return { success: false, error: 'Vehicle not found' };
    stores.vehicles[idx] = { ...stores.vehicles[idx], ...data };
    return { success: true, data: stores.vehicles[idx] };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DRIVER SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const driverService = {
  async getDrivers(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.drivers, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getDriver(id) {
    await delay(200);
    return stores.drivers.find((d) => d.id === id) || null;
  },

  async assignVehicle(driverId, vehicleId) {
    await delay(400);
    const vehicle = stores.vehicles.find((v) => v.id === vehicleId);
    const driver = stores.drivers.find((d) => d.id === driverId);
    if (!vehicle || !driver) return { success: false, error: 'Driver or vehicle not found' };
    const idx = stores.vehicles.findIndex((v) => v.id === vehicleId);
    stores.vehicles[idx] = {
      ...stores.vehicles[idx],
      driverId,
      driverName: driver.name,
      status: 'ACTIVE',
    };
    const dIdx = stores.drivers.findIndex((d) => d.id === driverId);
    stores.drivers[dIdx] = { ...stores.drivers[dIdx], vehicle: vehicle.plateNumber, vehicleId };
    return { success: true, data: stores.vehicles[idx] };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COOPERATIVE SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const cooperativeService = {
  async getCooperatives(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.cooperatives, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getCooperative(id) {
    await delay(200);
    return stores.cooperatives.find((c) => c.id === id) || null;
  },

  async createCooperative(data) {
    await delay(400);
    const coop = {
      id: generateId(),
      status: 'PENDING_REVIEW',
      joinDate: new Date().toISOString().split('T')[0],
      members: 0,
      drivers: 0,
      routes: 0,
      activeTariffs: 0,
      ...data,
    };
    stores.cooperatives.unshift(coop);
    return { success: true, data: coop };
  },

  async updateCooperative(id, data) {
    await delay(400);
    const idx = stores.cooperatives.findIndex((c) => c.id === id);
    if (idx === -1) return { success: false, error: 'Cooperative not found' };
    stores.cooperatives[idx] = { ...stores.cooperatives[idx], ...data };
    return { success: true, data: stores.cooperatives[idx] };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROPOSAL SERVICE (Tariff proposals)
// ═══════════════════════════════════════════════════════════════════════════════
export const proposalService = {
  async getProposals(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.proposals, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getProposal(id) {
    await delay(200);
    return stores.proposals.find((p) => p.id === id) || null;
  },

  async createProposal(data) {
    await delay(400);
    const proposal = {
      id: generateId(),
      status: 'PENDING',
      submittedDate: new Date().toISOString().split('T')[0],
      cooperativeId: 'coop1',
      ...data,
    };
    stores.proposals.unshift(proposal);
    return { success: true, data: proposal };
  },

  async reviewProposal(id, status, notes) {
    await delay(400);
    const idx = stores.proposals.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, error: 'Proposal not found' };
    stores.proposals[idx] = {
      ...stores.proposals[idx],
      status,
      reviewNotes: notes || '',
      reviewedAt: new Date().toISOString(),
    };
    return { success: true, data: stores.proposals[idx] };
  },

  async withdrawProposal(id) {
    await delay(400);
    const idx = stores.proposals.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, error: 'Proposal not found' };
    stores.proposals[idx] = { ...stores.proposals[idx], status: 'REJECTED' };
    return { success: true, data: stores.proposals[idx] };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// REPORT SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const reportService = {
  async getReport(type = 'trips', dateRange = {}) {
    await delay(500);
    const { from, to } = dateRange;
    const trips = stores.trips.filter((t) => {
      if (from && t.date && t.date.slice(0, 10) < from) return false;
      if (to && t.date && t.date.slice(0, 10) > to) return false;
      return true;
    });
    const totalRevenue = trips.reduce((sum, t) => sum + (t.earnings || t.fare || 0), 0);
    const totalComplaints = stores.complaints.length;

    let summary;
    if (type === 'revenue') {
      summary = { totalTrips: trips.length, total: totalRevenue, avgPerTrip: trips.length ? Math.round(totalRevenue / trips.length) : 0, refundedTrips: trips.filter((t) => t.status === 'CANCELLED').length };
    } else if (type === 'complaints') {
      summary = { totalTrips: trips.length, total: totalComplaints, open: stores.complaints.filter((c) => c.status === 'OPEN').length, resolved: stores.complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length };
    } else {
      summary = { totalTrips: trips.length, total: totalRevenue, completedTrips: trips.filter((t) => t.status === 'COMPLETED').length, cancelledTrips: trips.filter((t) => t.status === 'CANCELLED').length };
    }

    return {
      success: true,
      data: {
        type,
        summary,
        generatedAt: new Date().toISOString(),
      },
    };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MEMBER SERVICE (Cooperative members)
// ═══════════════════════════════════════════════════════════════════════════════
export const memberService = {
  async getMembers(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.members, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getMember(id) {
    await delay(200);
    return stores.members.find((m) => m.id === id) || null;
  },

  async createMember(data) {
    await delay(400);
    const member = {
      id: generateId(),
      status: 'PENDING_VERIFICATION',
      joinDate: new Date().toISOString().split('T')[0],
      trips: 0,
      ...data,
    };
    stores.members.unshift(member);
    return { success: true, data: member };
  },

  async updateMember(id, data) {
    await delay(400);
    const idx = stores.members.findIndex((m) => m.id === id);
    if (idx === -1) return { success: false, error: 'Member not found' };
    stores.members[idx] = { ...stores.members[idx], ...data };
    return { success: true, data: stores.members[idx] };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT SERVICE (alias used by Authority pages)
// ═══════════════════════════════════════════════════════════════════════════════
export const auditService = {
  async getAuditLogs(filters = {}) {
    await delay();
    const filtered = applyFilters(stores.auditLogs, filters);
    return paginate(filtered, filters.page, filters.pageSize);
  },

  async getAuditLog(id) {
    await delay(200);
    return stores.auditLogs.find((a) => a.id === id) || null;
  },
};
