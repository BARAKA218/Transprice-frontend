// ═══════════════════════════════════════════════════════════════════════════════
// TransPrice Mock Data - Rwanda Transport Pricing Platform
// ALL DATA IS DEMO DATA FOR DEVELOPMENT PURPOSES ONLY
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Districts ────────────────────────────────────────────────────────────────
export const mockDistricts = [
  // Kigali City
  { id: 'd01', name: 'Gasabo', province: 'Kigali City', lat: -1.9403, lng: 29.9955 },
  { id: 'd02', name: 'Kicukiro', province: 'Kigali City', lat: -1.9686, lng: 30.0588 },
  { id: 'd03', name: 'Nyarugenge', province: 'Kigali City', lat: -1.9536, lng: 30.0607 },

  // Northern Province
  { id: 'd04', name: 'Musanze', province: 'Northern', lat: -1.4994, lng: 29.6333 },
  { id: 'd05', name: 'Burera', province: 'Northern', lat: -1.4478, lng: 29.8650 },
  { id: 'd06', name: 'Gakenke', province: 'Northern', lat: -1.6822, lng: 29.7933 },
  { id: 'd07', name: 'Rulindo', province: 'Northern', lat: -1.7283, lng: 29.9325 },

  // Western Province
  { id: 'd08', name: 'Rubavu', province: 'Western', lat: -1.7014, lng: 29.2264 },
  { id: 'd09', name: 'Nyabihu', province: 'Western', lat: -1.6375, lng: 29.4936 },
  { id: 'd10', name: 'Nyamasheke', province: 'Western', lat: -2.3167, lng: 29.1500 },
  { id: 'd11', name: 'Karongi', province: 'Western', lat: -2.0500, lng: 29.4333 },
  { id: 'd12', name: 'Rusizi', province: 'Western', lat: -2.4964, lng: 28.9078 },
  { id: 'd13', name: 'Nyamagabe', province: 'Western', lat: -2.4686, lng: 29.5567 },

  // Southern Province
  { id: 'd14', name: 'Huye', province: 'Southern', lat: -2.5933, lng: 29.5919 },
  { id: 'd15', name: 'Nyanza', province: 'Southern', lat: -2.3525, lng: 29.7508 },
  { id: 'd16', name: 'Muhanga', province: 'Southern', lat: -2.0794, lng: 29.7567 },
  { id: 'd17', name: 'Kamonyi', province: 'Southern', lat: -2.0167, lng: 29.8833 },
  { id: 'd18', name: 'Gisagara', province: 'Southern', lat: -2.5167, lng: 29.8667 },
  { id: 'd19', name: 'Nyaruguru', province: 'Southern', lat: -2.6167, lng: 29.6333 },
  { id: 'd20', name: 'Nyamagabe', province: 'Southern', lat: -2.4686, lng: 29.5567 },

  // Eastern Province
  { id: 'd21', name: 'Kayonza', province: 'Eastern', lat: -1.8564, lng: 30.5625 },
  { id: 'd22', name: 'Gatsibo', province: 'Eastern', lat: -1.5833, lng: 30.4333 },
  { id: 'd23', name: 'Nyagatare', province: 'Eastern', lat: -1.2953, lng: 30.3278 },
  { id: 'd24', name: 'Rwamagana', province: 'Eastern', lat: -1.9486, lng: 30.4333 },
  { id: 'd25', name: 'Ngoma', province: 'Eastern', lat: -2.1833, lng: 30.5167 },
  { id: 'd26', name: 'Kirehe', province: 'Eastern', lat: -2.1917, lng: 30.7333 },
  { id: 'd27', name: 'Bugesera', province: 'Eastern', lat: -2.2333, lng: 30.2000 },

  // Additional
  { id: 'd28', name: 'Gicumbi', province: 'Northern', lat: -1.5833, lng: 30.0667 },
  { id: 'd29', name: 'Ruhango', province: 'Southern', lat: -2.1667, lng: 29.7833 },
  { id: 'd30', name: 'Musanze', province: 'Northern', lat: -1.4994, lng: 29.6333 },
];

// ─── Sectors ──────────────────────────────────────────────────────────────────
export const mockSectors = [
  // Gasabo
  { id: 's01', name: 'Kimironko', districtId: 'd01', districtName: 'Gasabo' },
  { id: 's02', name: 'Kacyiru', districtId: 'd01', districtName: 'Gasabo' },
  { id: 's03', name: 'Remera', districtId: 'd01', districtName: 'Gasabo' },
  { id: 's04', name: 'Kabuga', districtId: 'd01', districtName: 'Gasabo' },
  { id: 's05', name: 'Gisozi', districtId: 'd01', districtName: 'Gasabo' },

  // Kicukiro
  { id: 's06', name: 'Kicukiro', districtId: 'd02', districtName: 'Kicukiro' },
  { id: 's07', name: 'Nyanza', districtId: 'd02', districtName: 'Kicukiro' },
  { id: 's08', name: 'Gatenga', districtId: 'd02', districtName: 'Kicukiro' },
  { id: 's09', name: 'Kagugu', districtId: 'd02', districtName: 'Kicukiro' },

  // Nyarugenge
  { id: 's10', name: 'Downtown', districtId: 'd03', districtName: 'Nyarugenge' },
  { id: 's11', name: 'Nyamirambo', districtId: 'd03', districtName: 'Nyarugenge' },
  { id: 's12', name: 'Nyabugogo', districtId: 'd03', districtName: 'Nyarugenge' },
  { id: 's13', name: 'Kimisagara', districtId: 'd03', districtName: 'Nyarugenge' },
  { id: 's14', name: 'Rwezamenyo', districtId: 'd03', districtName: 'Nyarugenge' },

  // Musanze
  { id: 's15', name: 'Musanze Town', districtId: 'd04', districtName: 'Musanze' },
  { id: 's16', name: 'Kinigi', districtId: 'd04', districtName: 'Musanze' },
  { id: 's17', name: 'Muhoza', districtId: 'd04', districtName: 'Musanze' },
  { id: 's18', name: 'Nyakinama', districtId: 'd04', districtName: 'Musanze' },

  // Rubavu
  { id: 's19', name: 'Gisenyi', districtId: 'd08', districtName: 'Rubavu' },
  { id: 's20', name: 'Cyangugu', districtId: 'd08', districtName: 'Rubavu' },
  { id: 's21', name: 'Bugarama', districtId: 'd08', districtName: 'Rubavu' },

  // Huye
  { id: 's22', name: 'Huye Town', districtId: 'd14', districtName: 'Huye' },
  { id: 's23', name: 'Ngoma', districtId: 'd14', districtName: 'Huye' },
  { id: 's24', name: 'Tumba', districtId: 'd14', districtName: 'Huye' },

  // Muhanga
  { id: 's25', name: 'Muhanga Town', districtId: 'd16', districtName: 'Muhanga' },
  { id: 's26', name: 'Cyarubare', districtId: 'd16', districtName: 'Muhanga' },
  { id: 's27', name: 'Kabgayi', districtId: 'd16', districtName: 'Muhanga' },

  // Kayonza
  { id: 's28', name: 'Kayonza Town', districtId: 'd21', districtName: 'Kayonza' },
  { id: 's29', name: 'Kabare', districtId: 'd21', districtName: 'Kayonza' },
  { id: 's30', name: 'Rwimbogo', districtId: 'd21', districtName: 'Kayonza' },

  // Bugesera
  { id: 's31', name: 'Bugesera Town', districtId: 'd27', districtName: 'Bugesera' },
  { id: 's32', name: 'Ntarama', districtId: 'd27', districtName: 'Bugesera' },
  { id: 's33', name: 'Rilima', districtId: 'd27', districtName: 'Bugesera' },

  // Rwamagana
  { id: 's34', name: 'Rwamagana Town', districtId: 'd24', districtName: 'Rwamagana' },
  { id: 's35', name: 'Muhazi', districtId: 'd24', districtName: 'Rwamagana' },
  { id: 's36', name: 'Fumba', districtId: 'd24', districtName: 'Rwamagana' },
];

// ─── Routes ───────────────────────────────────────────────────────────────────
export const mockRoutes = [
  {
    id: 'r01',
    name: 'Kimironko → Downtown',
    origin: 'Kimironko',
    destination: 'Downtown',
    originDistrict: 'Gasabo',
    destinationDistrict: 'Nyarugenge',
    distance: 8.5,
    estimatedTime: 25,
    transportTypes: ['bus', 'taxi', 'minibus'],
    coordinates: { origin: { lat: -1.9217, lng: 30.0183 }, destination: { lat: -1.9536, lng: 30.0607 } },
    status: 'ACTIVE',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r02',
    name: 'Nyabugogo → Kimironko',
    origin: 'Nyabugogo',
    destination: 'Kimironko',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Gasabo',
    distance: 6.2,
    estimatedTime: 18,
    transportTypes: ['bus', 'taxi'],
    coordinates: { origin: { lat: -1.9458, lng: 30.0403 }, destination: { lat: -1.9217, lng: 30.0183 } },
    status: 'ACTIVE',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r03',
    name: 'Kicukiro → Downtown',
    origin: 'Kicukiro',
    destination: 'Downtown',
    originDistrict: 'Kicukiro',
    destinationDistrict: 'Nyarugenge',
    distance: 7.0,
    estimatedTime: 20,
    transportTypes: ['bus', 'taxi', 'minibus'],
    coordinates: { origin: { lat: -1.9686, lng: 30.0588 }, destination: { lat: -1.9536, lng: 30.0607 } },
    status: 'ACTIVE',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r04',
    name: 'Kimironko → Nyamirambo',
    origin: 'Kimironko',
    destination: 'Nyamirambo',
    originDistrict: 'Gasabo',
    destinationDistrict: 'Nyarugenge',
    distance: 9.3,
    estimatedTime: 28,
    transportTypes: ['bus', 'taxi', 'minibus'],
    coordinates: { origin: { lat: -1.9217, lng: 30.0183 }, destination: { lat: -1.9611, lng: 30.0397 } },
    status: 'ACTIVE',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r05',
    name: 'Nyamirambo → Downtown',
    origin: 'Nyamirambo',
    destination: 'Downtown',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Nyarugenge',
    distance: 3.5,
    estimatedTime: 12,
    transportTypes: ['bus', 'taxi', 'moto'],
    coordinates: { origin: { lat: -1.9611, lng: 30.0397 }, destination: { lat: -1.9536, lng: 30.0607 } },
    status: 'ACTIVE',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r06',
    name: 'Kigali → Musanze',
    origin: 'Kigali',
    destination: 'Musanze',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Musanze',
    distance: 105.0,
    estimatedTime: 150,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -1.4994, lng: 29.6333 } },
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r07',
    name: 'Kigali → Huye',
    origin: 'Kigali',
    destination: 'Huye',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Huye',
    distance: 135.0,
    estimatedTime: 180,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -2.5933, lng: 29.5919 } },
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r08',
    name: 'Kigali → Rubavu (Gisenyi)',
    origin: 'Kigali',
    destination: 'Gisenyi',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Rubavu',
    distance: 165.0,
    estimatedTime: 210,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -1.7014, lng: 29.2264 } },
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r09',
    name: 'Kigali → Muhanga',
    origin: 'Kigali',
    destination: 'Muhanga',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Muhanga',
    distance: 60.0,
    estimatedTime: 90,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -2.0794, lng: 29.7567 } },
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r10',
    name: 'Kigali → Kayonza',
    origin: 'Kigali',
    destination: 'Kayonza',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Kayonza',
    distance: 85.0,
    estimatedTime: 120,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -1.8564, lng: 30.5625 } },
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r11',
    name: 'Gisenyi → Kibuye',
    origin: 'Gisenyi',
    destination: 'Kibuye',
    originDistrict: 'Rubavu',
    destinationDistrict: 'Karongi',
    distance: 90.0,
    estimatedTime: 120,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.7014, lng: 29.2264 }, destination: { lat: -2.0500, lng: 29.4333 } },
    status: 'ACTIVE',
    createdAt: '2025-02-15T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r12',
    name: 'Musanze → Gisenyi',
    origin: 'Musanze',
    destination: 'Gisenyi',
    originDistrict: 'Musanze',
    destinationDistrict: 'Rubavu',
    distance: 70.0,
    estimatedTime: 90,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.4994, lng: 29.6333 }, destination: { lat: -1.7014, lng: 29.2264 } },
    status: 'ACTIVE',
    createdAt: '2025-02-15T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r13',
    name: 'Huye → Nyanza',
    origin: 'Huye',
    destination: 'Nyanza',
    originDistrict: 'Huye',
    destinationDistrict: 'Nyanza',
    distance: 35.0,
    estimatedTime: 45,
    transportTypes: ['bus', 'minibus', 'taxi'],
    coordinates: { origin: { lat: -2.5933, lng: 29.5919 }, destination: { lat: -2.3525, lng: 29.7508 } },
    status: 'ACTIVE',
    createdAt: '2025-03-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r14',
    name: 'Kigali → Bugesera (Airport)',
    origin: 'Kigali',
    destination: 'Bugesera International Airport',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Bugesera',
    distance: 35.0,
    estimatedTime: 45,
    transportTypes: ['bus', 'taxi'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -2.3333, lng: 30.2000 } },
    status: 'ACTIVE',
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r15',
    name: 'Nyabugogo → Kimironko → Remera',
    origin: 'Nyabugogo',
    destination: 'Remera',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Gasabo',
    distance: 10.5,
    estimatedTime: 30,
    transportTypes: ['bus', 'taxi', 'minibus'],
    coordinates: { origin: { lat: -1.9458, lng: 30.0403 }, destination: { lat: -1.9350, lng: 30.0000 } },
    status: 'ACTIVE',
    createdAt: '2025-03-10T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r16',
    name: 'Kigali → Rwamagana',
    origin: 'Kigali',
    destination: 'Rwamagana',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Rwamagana',
    distance: 65.0,
    estimatedTime: 90,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -1.9486, lng: 30.4333 } },
    status: 'ACTIVE',
    createdAt: '2025-03-10T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r17',
    name: 'Kigali → Nyagatare',
    origin: 'Kigali',
    destination: 'Nyagatare',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Nyagatare',
    distance: 155.0,
    estimatedTime: 195,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -1.2953, lng: 30.3278 } },
    status: 'ACTIVE',
    createdAt: '2025-04-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r18',
    name: 'Musanze → Gakenke',
    origin: 'Musanze',
    destination: 'Gakenke',
    originDistrict: 'Musanze',
    destinationDistrict: 'Gakenke',
    distance: 40.0,
    estimatedTime: 55,
    transportTypes: ['minibus', 'bus'],
    coordinates: { origin: { lat: -1.4994, lng: 29.6333 }, destination: { lat: -1.6822, lng: 29.7933 } },
    status: 'ACTIVE',
    createdAt: '2025-04-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r19',
    name: 'Kigali → Kamonyi',
    origin: 'Kigali',
    destination: 'Kamonyi',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Kamonyi',
    distance: 45.0,
    estimatedTime: 60,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -2.0167, lng: 29.8833 } },
    status: 'ACTIVE',
    createdAt: '2025-04-15T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r20',
    name: 'Rubavu → Nyamasheke',
    origin: 'Rubavu',
    destination: 'Nyamasheke',
    originDistrict: 'Rubavu',
    destinationDistrict: 'Nyamasheke',
    distance: 85.0,
    estimatedTime: 110,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.7014, lng: 29.2264 }, destination: { lat: -2.3167, lng: 29.1500 } },
    status: 'ACTIVE',
    createdAt: '2025-05-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r21',
    name: 'Kigali → Ngoma',
    origin: 'Kigali',
    destination: 'Ngoma',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Ngoma',
    distance: 100.0,
    estimatedTime: 135,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -2.1833, lng: 30.5167 } },
    status: 'ACTIVE',
    createdAt: '2025-05-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r22',
    name: 'Kigali → Kirehe',
    origin: 'Kigali',
    destination: 'Kirehe',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Kirehe',
    distance: 170.0,
    estimatedTime: 210,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -2.1917, lng: 30.7333 } },
    status: 'ACTIVE',
    createdAt: '2025-05-15T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r23',
    name: 'Kicukiro → Kimironko',
    origin: 'Kicukiro',
    destination: 'Kimironko',
    originDistrict: 'Kicukiro',
    destinationDistrict: 'Gasabo',
    distance: 5.8,
    estimatedTime: 16,
    transportTypes: ['bus', 'taxi', 'moto'],
    coordinates: { origin: { lat: -1.9686, lng: 30.0588 }, destination: { lat: -1.9217, lng: 30.0183 } },
    status: 'ACTIVE',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r24',
    name: 'Remera → Kicukiro',
    origin: 'Remera',
    destination: 'Kicukiro',
    originDistrict: 'Gasabo',
    destinationDistrict: 'Kicukiro',
    distance: 4.2,
    estimatedTime: 14,
    transportTypes: ['bus', 'taxi', 'moto'],
    coordinates: { origin: { lat: -1.9350, lng: 30.0000 }, destination: { lat: -1.9686, lng: 30.0588 } },
    status: 'ACTIVE',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'r25',
    name: 'Kigali → Rusizi',
    origin: 'Kigali',
    destination: 'Rusizi',
    originDistrict: 'Nyarugenge',
    destinationDistrict: 'Rusizi',
    distance: 220.0,
    estimatedTime: 270,
    transportTypes: ['bus', 'minibus'],
    coordinates: { origin: { lat: -1.9536, lng: 30.0607 }, destination: { lat: -2.4964, lng: 28.9078 } },
    status: 'ACTIVE',
    createdAt: '2025-06-15T08:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  },
];

// ─── Fares ────────────────────────────────────────────────────────────────────
export const mockFares = [
  // Kigali intra-city fares
  { id: 'f01', routeId: 'r01', routeName: 'Kimironko → Downtown', origin: 'Kimironko', destination: 'Downtown', transportType: 'bus', fare: 500, currency: 'RWF', district: 'Gasabo', sector: 'Kimironko', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Standard city bus fare', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f02', routeId: 'r01', routeName: 'Kimironko → Downtown', origin: 'Kimironko', destination: 'Downtown', transportType: 'taxi', fare: 2000, currency: 'RWF', district: 'Gasabo', sector: 'Kimironko', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Kigali Taxi Operators', sourceUrl: '', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Private taxi fare', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f03', routeId: 'r01', routeName: 'Kimironko → Downtown', origin: 'Kimironko', destination: 'Downtown', transportType: 'minibus', fare: 400, currency: 'RWF', district: 'Gasabo', sector: 'Kimironko', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Minibus shared fare', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f04', routeId: 'r01', routeName: 'Kimironko → Downtown', origin: 'Kimironko', destination: 'Downtown', transportType: 'moto', fare: 700, currency: 'RWF', district: 'Gasabo', sector: 'Kimironko', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Moto Operators Cooperative', sourceUrl: '', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Motorcycle taxi', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },

  { id: 'f05', routeId: 'r02', routeName: 'Nyabugogo → Kimironko', origin: 'Nyabugogo', destination: 'Kimironko', transportType: 'bus', fare: 400, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f06', routeId: 'r02', routeName: 'Nyabugogo → Kimironko', origin: 'Nyabugogo', destination: 'Kimironko', transportType: 'taxi', fare: 1500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Kigali Taxi Operators', sourceUrl: '', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },

  { id: 'f07', routeId: 'r03', routeName: 'Kicukiro → Downtown', origin: 'Kicukiro', destination: 'Downtown', transportType: 'bus', fare: 500, currency: 'RWF', district: 'Kicukiro', sector: 'Kicukiro', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f08', routeId: 'r03', routeName: 'Kicukiro → Downtown', origin: 'Kicukiro', destination: 'Downtown', transportType: 'moto', fare: 600, currency: 'RWF', district: 'Kicukiro', sector: 'Kicukiro', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Moto Operators Cooperative', sourceUrl: '', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },

  { id: 'f09', routeId: 'r04', routeName: 'Kimironko → Nyamirambo', origin: 'Kimironko', destination: 'Nyamirambo', transportType: 'bus', fare: 500, currency: 'RWF', district: 'Gasabo', sector: 'Kimironko', effectiveDate: '2025-11-01', expiryDate: '2026-04-30', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-10-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-10-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f10', routeId: 'r05', routeName: 'Nyamirambo → Downtown', origin: 'Nyamirambo', destination: 'Downtown', transportType: 'bus', fare: 300, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyamirambo', effectiveDate: '2025-11-01', expiryDate: '2026-04-30', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-10-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-10-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f11', routeId: 'r05', routeName: 'Nyamirambo → Downtown', origin: 'Nyamirambo', destination: 'Downtown', transportType: 'moto', fare: 500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyamirambo', effectiveDate: '2025-11-01', expiryDate: '2026-04-30', source: 'Moto Operators Cooperative', sourceUrl: '', sourceDate: '2025-10-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-10-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },

  // Inter-city fares
  { id: 'f12', routeId: 'r06', routeName: 'Kigali → Musanze', origin: 'Kigali', destination: 'Musanze', transportType: 'bus', fare: 3500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Express bus service', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f13', routeId: 'r06', routeName: 'Kigali → Musanze', origin: 'Kigali', destination: 'Musanze', transportType: 'minibus', fare: 3000, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Nyabugogo Cooperative', sourceUrl: '', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Shared minibus', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f14', routeId: 'r07', routeName: 'Kigali → Huye', origin: 'Kigali', destination: 'Huye', transportType: 'bus', fare: 4500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f15', routeId: 'r07', routeName: 'Kigali → Huye', origin: 'Kigali', destination: 'Huye', transportType: 'minibus', fare: 4000, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Nyabugogo Cooperative', sourceUrl: '', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f16', routeId: 'r08', routeName: 'Kigali → Rubavu (Gisenyi)', origin: 'Kigali', destination: 'Gisenyi', transportType: 'bus', fare: 5500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f17', routeId: 'r08', routeName: 'Kigali → Rubavu (Gisenyi)', origin: 'Kigali', destination: 'Gisenyi', transportType: 'minibus', fare: 5000, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Nyabugogo Cooperative', sourceUrl: '', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f18', routeId: 'r09', routeName: 'Kigali → Muhanga', origin: 'Kigali', destination: 'Muhanga', transportType: 'bus', fare: 2500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f19', routeId: 'r09', routeName: 'Kigali → Muhanga', origin: 'Kigali', destination: 'Muhanga', transportType: 'minibus', fare: 2000, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Nyabugogo Cooperative', sourceUrl: '', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f20', routeId: 'r10', routeName: 'Kigali → Kayonza', origin: 'Kigali', destination: 'Kayonza', transportType: 'bus', fare: 3000, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f21', routeId: 'r11', routeName: 'Gisenyi → Kibuye', origin: 'Gisenyi', destination: 'Kibuye', transportType: 'bus', fare: 3500, currency: 'RWF', district: 'Rubavu', sector: 'Gisenyi', effectiveDate: '2025-11-01', expiryDate: '2026-04-30', source: 'Western Province Transport', sourceUrl: '', sourceDate: '2025-10-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-10-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f22', routeId: 'r12', routeName: 'Musanze → Gisenyi', origin: 'Musanze', destination: 'Gisenyi', transportType: 'minibus', fare: 2500, currency: 'RWF', district: 'Musanze', sector: 'Musanze Town', effectiveDate: '2025-11-01', expiryDate: '2026-04-30', source: 'Northern Province Transport', sourceUrl: '', sourceDate: '2025-10-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-10-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f23', routeId: 'r13', routeName: 'Huye → Nyanza', origin: 'Huye', destination: 'Nyanza', transportType: 'minibus', fare: 1500, currency: 'RWF', district: 'Huye', sector: 'Huye Town', effectiveDate: '2025-11-01', expiryDate: '2026-04-30', source: 'Southern Province Transport', sourceUrl: '', sourceDate: '2025-10-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-10-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f24', routeId: 'r14', routeName: 'Kigali → Bugesera (Airport)', origin: 'Kigali', destination: 'Bugesera International Airport', transportType: 'bus', fare: 1500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Airport express', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f25', routeId: 'r14', routeName: 'Kigali → Bugesera (Airport)', origin: 'Kigali', destination: 'Bugesera International Airport', transportType: 'taxi', fare: 10000, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-10-01', expiryDate: '2026-03-31', source: 'Airport Taxi Association', sourceUrl: '', sourceDate: '2025-09-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Private airport taxi', createdAt: '2025-09-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },

  { id: 'f26', routeId: 'r15', routeName: 'Nyabugogo → Kimironko → Remera', origin: 'Nyabugogo', destination: 'Remera', transportType: 'bus', fare: 600, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-11-15', expiryDate: '2026-05-15', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-11-12', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Extended route through Kimironko', createdAt: '2025-11-12T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f27', routeId: 'r16', routeName: 'Kigali → Rwamagana', origin: 'Kigali', destination: 'Rwamagana', transportType: 'bus', fare: 2500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-11-01', expiryDate: '2026-04-30', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-10-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-10-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f28', routeId: 'r17', routeName: 'Kigali → Nyagatare', origin: 'Kigali', destination: 'Nyagatare', transportType: 'bus', fare: 5000, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-11-15', expiryDate: '2026-05-15', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-11-12', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-11-12T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f29', routeId: 'r18', routeName: 'Musanze → Gakenke', origin: 'Musanze', destination: 'Gakenke', transportType: 'minibus', fare: 1200, currency: 'RWF', district: 'Musanze', sector: 'Musanze Town', effectiveDate: '2025-12-01', expiryDate: '2026-05-31', source: 'Northern Province Transport', sourceUrl: '', sourceDate: '2025-11-28', verificationStatus: 'UNDER_REVIEW', status: 'PENDING_REVIEW', notes: 'New fare pending authority review', createdAt: '2025-11-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u03' },
  { id: 'f30', routeId: 'r19', routeName: 'Kigali → Kamonyi', origin: 'Kigali', destination: 'Kamonyi', transportType: 'minibus', fare: 1500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-12-01', expiryDate: '2026-05-31', source: 'Nyabugogo Cooperative', sourceUrl: '', sourceDate: '2025-11-28', verificationStatus: 'UNDER_REVIEW', status: 'PENDING_REVIEW', notes: '', createdAt: '2025-11-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u03' },
  { id: 'f31', routeId: 'r20', routeName: 'Rubavu → Nyamasheke', origin: 'Rubavu', destination: 'Nyamasheke', transportType: 'bus', fare: 3000, currency: 'RWF', district: 'Rubavu', sector: 'Gisenyi', effectiveDate: '2025-12-01', expiryDate: '2026-05-31', source: 'Western Province Transport', sourceUrl: '', sourceDate: '2025-11-28', verificationStatus: 'UNVERIFIED', status: 'DRAFT', notes: 'Awaiting verification', createdAt: '2025-11-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u03' },
  { id: 'f32', routeId: 'r23', routeName: 'Kicukiro → Kimironko', origin: 'Kicukiro', destination: 'Kimironko', transportType: 'moto', fare: 500, currency: 'RWF', district: 'Kicukiro', sector: 'Kicukiro', effectiveDate: '2025-12-01', expiryDate: '2026-05-31', source: 'Moto Operators Cooperative', sourceUrl: '', sourceDate: '2025-11-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: '', createdAt: '2025-11-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
  { id: 'f33', routeId: 'r25', routeName: 'Kigali → Rusizi', origin: 'Kigali', destination: 'Rusizi', transportType: 'bus', fare: 7500, currency: 'RWF', district: 'Nyarugenge', sector: 'Nyabugogo', effectiveDate: '2025-12-01', expiryDate: '2026-05-31', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', sourceDate: '2025-11-28', verificationStatus: 'VERIFIED', status: 'PUBLISHED', notes: 'Longest domestic route', createdAt: '2025-11-28T10:00:00Z', updatedAt: '2025-12-01T08:00:00Z', updatedBy: 'u01' },
];

// ─── Fuel Prices ──────────────────────────────────────────────────────────────
export const mockFuelPrices = [
  { id: 'fp01', fuelType: 'Petrol', price: 1350, currency: 'RWF', effectiveDate: '2025-12-01', source: 'Rwanda Utilities Regulatory Authority', sourceUrl: 'https://rura.gov.rw', status: 'ACTIVE', notes: 'December 2025 pump price', createdAt: '2025-11-30T12:00:00Z' },
  { id: 'fp02', fuelType: 'Diesel', price: 1250, currency: 'RWF', effectiveDate: '2025-12-01', source: 'Rwanda Utilities Regulatory Authority', sourceUrl: 'https://rura.gov.rw', status: 'ACTIVE', notes: 'December 2025 pump price', createdAt: '2025-11-30T12:00:00Z' },
  { id: 'fp03', fuelType: 'LPG', price: 850, currency: 'RWF', effectiveDate: '2025-12-01', source: 'Rwanda Utilities Regulatory Authority', sourceUrl: 'https://rura.gov.rw', status: 'ACTIVE', notes: 'December 2025 pump price', createdAt: '2025-11-30T12:00:00Z' },
  { id: 'fp04', fuelType: 'Petrol', price: 1320, currency: 'RWF', effectiveDate: '2025-11-01', source: 'Rwanda Utilities Regulatory Authority', sourceUrl: 'https://rura.gov.rw', status: 'INACTIVE', notes: 'November 2025 pump price', createdAt: '2025-10-31T12:00:00Z' },
  { id: 'fp05', fuelType: 'Diesel', price: 1220, currency: 'RWF', effectiveDate: '2025-11-01', source: 'Rwanda Utilities Regulatory Authority', sourceUrl: 'https://rura.gov.rw', status: 'INACTIVE', notes: 'November 2025 pump price', createdAt: '2025-10-31T12:00:00Z' },
];

// ─── Transport Updates ────────────────────────────────────────────────────────
export const mockTransportUpdates = [
  { id: 'tu01', title: 'Kigali Bus Network Expansion', category: 'ROUTE', description: 'Three new bus routes connecting Kigali suburbs to the city center will begin operations in January 2026. Routes include Kimironko-Gisozi, Kicukiro-Niboye, and Remera-Bugesera.', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', publicationDate: '2025-12-01', effectiveDate: '2026-01-15', expiryDate: '2026-06-30', status: 'PUBLISHED', createdAt: '2025-12-01T08:00:00Z' },
  { id: 'tu02', title: 'Fuel Price Adjustment - December 2025', category: 'FUEL', description: 'RURA has announced a fuel price increase effective December 1, 2025. Petrol rises from RWF 1,320 to RWF 1,350 per litre, and Diesel from RWF 1,220 to RWF 1,250 per litre.', source: 'RURA', sourceUrl: 'https://rura.gov.rw', publicationDate: '2025-11-28', effectiveDate: '2025-12-01', expiryDate: '2025-12-31', status: 'PUBLISHED', createdAt: '2025-11-28T14:00:00Z' },
  { id: 'tu03', title: 'Nyabugogo Terminal Upgrade', category: 'SERVICE_UPDATE', description: 'Nyabugogo Bus Terminal is undergoing renovation to improve passenger facilities. Temporary shelters have been set up during the 3-month construction period.', source: 'City of Kigali', sourceUrl: 'https://www.kigalicity.gov.rw', publicationDate: '2025-11-15', effectiveDate: '2025-11-15', expiryDate: '2026-02-15', status: 'PUBLISHED', createdAt: '2025-11-15T08:00:00Z' },
  { id: 'tu04', title: 'Kigali-Musanze Express Bus Launch', category: 'ROUTE', description: 'A new express bus service between Kigali and Musanze will launch with limited stops, reducing travel time from 3 hours to 2 hours 15 minutes.', source: 'Volcano Express', sourceUrl: 'https://volcanoexpress.rw', publicationDate: '2025-11-10', effectiveDate: '2026-01-01', expiryDate: '2026-12-31', status: 'PUBLISHED', createdAt: '2025-11-10T09:00:00Z' },
  { id: 'tu05', title: 'Holiday Fare Advisory', category: 'FARE', description: 'During the December holiday season, passengers are advised to check published fares before traveling. RTA will monitor and address any fare irregularities across all routes.', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', publicationDate: '2025-12-05', effectiveDate: '2025-12-15', expiryDate: '2026-01-10', status: 'PUBLISHED', createdAt: '2025-12-05T08:00:00Z' },
  { id: 'tu06', title: 'Digital Ticketing System Rollout', category: 'SERVICE_UPDATE', description: 'All Kigali city buses will accept digital payments via QR codes by Q1 2026. Passengers can use Mobile Money or bank cards.', source: 'Rwanda Transport Board', sourceUrl: 'https://rta.gov.rw', publicationDate: '2025-10-20', effectiveDate: '2026-01-01', expiryDate: '2026-12-31', status: 'PUBLISHED', createdAt: '2025-10-20T10:00:00Z' },
  { id: 'tu07', title: 'Moto Taxi Safety Regulations Update', category: 'ANNOUNCEMENT', description: 'New safety regulations for moto taxis require all passengers to wear helmets by March 2026. Cooperatives must ensure compliance across all districts.', source: 'Rwanda National Police', sourceUrl: 'https://police.gov.rw', publicationDate: '2025-11-25', effectiveDate: '2026-03-01', expiryDate: null, status: 'PUBLISHED', createdAt: '2025-11-25T11:00:00Z' },
  { id: 'tu08', title: 'Kigali-Gisenyi Route Frequency Increase', category: 'ROUTE', description: 'Bus departures on the Kigali-Gisenyi route will increase from 8 to 12 daily services starting January 2026 to meet growing demand.', source: 'Nyabugogo Cooperative', sourceUrl: '', publicationDate: '2025-12-02', effectiveDate: '2026-01-05', expiryDate: '2026-06-30', status: 'PUBLISHED', createdAt: '2025-12-02T09:00:00Z' },
  { id: 'tu09', title: 'Bugesera Airport Shuttle Service', category: 'ROUTE', description: 'A dedicated shuttle service will connect Kigali city center to Bugesera International Airport with 30-minute intervals during peak hours.', source: 'Bugesera Airport Authority', sourceUrl: 'https://bugeseraairport.com', publicationDate: '2025-11-20', effectiveDate: '2026-03-01', expiryDate: '2026-12-31', status: 'DRAFT', createdAt: '2025-11-20T08:00:00Z' },
  { id: 'tu10', title: 'Road Construction: Kigali-Huye Route Detour', category: 'ANNOUNCEMENT', description: 'Sections of the Kigali-Huye highway near Muhanga are under construction. A temporary detour adds approximately 20 minutes to travel time. Expected completion: April 2026.', source: 'Rwanda National Roads Authority', sourceUrl: 'https://www.rnra.rw', publicationDate: '2025-12-03', effectiveDate: '2025-12-10', expiryDate: '2026-04-30', status: 'PUBLISHED', createdAt: '2025-12-03T10:00:00Z' },
  { id: 'tu11', title: 'Western Province Ferry Service Resumes', category: 'SERVICE_UPDATE', description: 'The Lake Kivu ferry service between Rubavu and Karongi has resumed operations after seasonal maintenance. Services run twice daily.', source: 'Western Province Administration', sourceUrl: '', publicationDate: '2025-12-04', effectiveDate: '2025-12-05', expiryDate: null, status: 'PUBLISHED', createdAt: '2025-12-04T08:00:00Z' },
];

// ─── Sources ──────────────────────────────────────────────────────────────────
export const mockSources = [
  { id: 'src01', name: 'Rwanda Transport Board (RTA)', website: 'https://rta.gov.rw', type: 'OFFICIAL', description: 'Government body responsible for regulating and coordinating transport services in Rwanda.', country: 'Rwanda', category: 'GOVERNMENT', reliabilityLevel: 'high', lastChecked: '2025-12-05', status: 'ACTIVE', notes: 'Primary source for official fares', createdAt: '2025-01-15T08:00:00Z' },
  { id: 'src02', name: 'Rwanda Utilities Regulatory Authority (RURA)', website: 'https://rura.gov.rw', type: 'PUBLIC_INSTITUTION', description: 'Regulatory body for utilities including fuel pricing.', country: 'Rwanda', category: 'REGULATOR', reliabilityLevel: 'high', lastChecked: '2025-12-05', status: 'ACTIVE', notes: 'Official fuel price source', createdAt: '2025-01-15T08:00:00Z' },
  { id: 'src03', name: 'Nyabugogo Taxi Cooperative', website: '', type: 'OPERATOR', description: 'Major cooperative managing taxi and minibus operations at Nyabugogo terminal.', country: 'Rwanda', category: 'COOPERATIVE', reliabilityLevel: 'medium', lastChecked: '2025-12-04', status: 'ACTIVE', notes: 'Key source for terminal operations and local fares', createdAt: '2025-02-01T08:00:00Z' },
  { id: 'src04', name: 'The New Times Rwanda', website: 'https://www.newtimes.co.rw', type: 'NEWS', description: 'Leading English-language newspaper in Rwanda covering transport and policy news.', country: 'Rwanda', category: 'MEDIA', reliabilityLevel: 'medium', lastChecked: '2025-12-05', status: 'ACTIVE', notes: '', createdAt: '2025-02-15T08:00:00Z' },
  { id: 'src05', name: 'KT Press', website: 'https://www.ktpress.rw', type: 'NEWS', description: 'Kinyarwanda language news outlet with strong local transport coverage.', country: 'Rwanda', category: 'MEDIA', reliabilityLevel: 'medium', lastChecked: '2025-12-05', status: 'ACTIVE', notes: '', createdAt: '2025-02-15T08:00:00Z' },
  { id: 'src06', name: 'Volcano Express', website: 'https://volcanoexpress.rw', type: 'OPERATOR', description: 'Major long-distance bus operator connecting Kigali to provincial cities.', country: 'Rwanda', category: 'BUS_OPERATOR', reliabilityLevel: 'medium', lastChecked: '2025-12-03', status: 'ACTIVE', notes: 'Official website for fare info', createdAt: '2025-03-01T08:00:00Z' },
  { id: 'src07', name: 'City of Kigali', website: 'https://www.kigalicity.gov.rw', type: 'PUBLIC_INSTITUTION', description: 'Kigali city administration responsible for urban transport planning.', country: 'Rwanda', category: 'LOCAL_GOVERNMENT', reliabilityLevel: 'high', lastChecked: '2025-12-04', status: 'ACTIVE', notes: '', createdAt: '2025-03-01T08:00:00Z' },
  { id: 'src08', name: 'Moto Operators Cooperative - Kimironko', website: '', type: 'OPERATOR', description: 'Local motorcycle taxi cooperative operating in Kimironko sector.', country: 'Rwanda', category: 'COOPERATIVE', reliabilityLevel: 'low', lastChecked: '2025-11-28', status: 'PENDING_REVIEW', notes: 'Occasional fare discrepancies reported', createdAt: '2025-04-01T08:00:00Z' },
];

// ─── Research Items ───────────────────────────────────────────────────────────
export const mockResearchItems = [
  { id: 'ri01', sourceId: 'src04', sourceName: 'The New Times Rwanda', type: 'fare', title: 'Kigali city fares expected to rise 5%', oldFare: 475, newFare: 500, routeName: 'Kimironko → Downtown', transportType: 'bus', discoveryDate: '2025-11-20', status: 'PUBLISHED', adminNotes: 'Confirmed with RTA statement', verifiedBy: 'u01', verifiedAt: '2025-11-22T10:00:00Z', publishedAt: '2025-11-22T14:00:00Z', createdAt: '2025-11-20T08:00:00Z' },
  { id: 'ri02', sourceId: 'src03', sourceName: 'Nyabugogo Taxi Cooperative', type: 'fare', title: 'Inter-city minibus fares under review', oldFare: 2800, newFare: 3000, routeName: 'Kigali → Musanze', transportType: 'minibus', discoveryDate: '2025-11-15', status: 'APPROVED', adminNotes: 'Cooperative confirmed increase effective Dec 1', verifiedBy: 'u01', verifiedAt: '2025-11-16T09:00:00Z', publishedAt: '2025-11-18T12:00:00Z', createdAt: '2025-11-15T10:00:00Z' },
  { id: 'ri03', sourceId: 'src02', sourceName: 'RURA', type: 'fuel', title: 'Fuel price increase December 2025', oldFare: 1320, newFare: 1350, routeName: null, transportType: null, discoveryDate: '2025-11-28', status: 'PUBLISHED', adminNotes: 'Official RURA gazette notification', verifiedBy: 'u01', verifiedAt: '2025-11-28T12:00:00Z', publishedAt: '2025-11-28T14:00:00Z', createdAt: '2025-11-28T11:00:00Z' },
  { id: 'ri04', sourceId: 'src05', sourceName: 'KT Press', type: 'announcement', title: 'New moto taxi zones in Kicukiro', oldFare: null, newFare: null, routeName: 'Kicukiro sectors', transportType: 'moto', discoveryDate: '2025-12-01', status: 'APPROVED', adminNotes: 'Awaiting official RTA map publication', verifiedBy: 'u02', verifiedAt: '2025-12-02T10:00:00Z', publishedAt: null, createdAt: '2025-12-01T15:00:00Z' },
  { id: 'ri05', sourceId: 'src06', sourceName: 'Volcano Express', type: 'fare', title: 'Long-distance fares adjusted for holidays', oldFare: 5200, newFare: 5500, routeName: 'Kigali → Rubavu (Gisenyi)', transportType: 'bus', discoveryDate: '2025-12-03', status: 'PENDING_VERIFICATION', adminNotes: 'Need to verify with other operators', verifiedBy: null, verifiedAt: null, publishedAt: null, createdAt: '2025-12-03T09:00:00Z' },
  { id: 'ri06', sourceId: 'src01', sourceName: 'Rwanda Transport Board (RTA)', type: 'route', title: 'Two new express routes announced', oldFare: null, newFare: null, routeName: 'Kigali-Nyagatare & Kigali-Rusizi Express', transportType: 'bus', discoveryDate: '2025-12-04', status: 'NEW', adminNotes: 'RTA press conference Dec 4', verifiedBy: null, verifiedAt: null, publishedAt: null, createdAt: '2025-12-04T16:00:00Z' },
  { id: 'ri07', sourceId: 'src08', sourceName: 'Moto Operators Cooperative - Kimironko', type: 'fare', title: 'Moto fares possibly increased', oldFare: 650, newFare: 700, routeName: 'Kimironko → Downtown', transportType: 'moto', discoveryDate: '2025-11-25', status: 'REJECTED', adminNotes: 'Discrepancy with RTA published fares - investigating', verifiedBy: 'u01', verifiedAt: '2025-11-27T10:00:00Z', publishedAt: null, createdAt: '2025-11-25T11:00:00Z' },
  { id: 'ri08', sourceId: 'src03', sourceName: 'Nyabugogo Taxi Cooperative', type: 'fare', title: 'Airport taxi fare increase proposal', oldFare: 9000, newFare: 10000, routeName: 'Kigali → Bugesera (Airport)', transportType: 'taxi', discoveryDate: '2025-12-05', status: 'NEW', adminNotes: 'Propposed by cooperative, not yet approved by RTA', verifiedBy: null, verifiedAt: null, publishedAt: null, createdAt: '2025-12-05T08:00:00Z' },
  { id: 'ri09', sourceId: 'src04', sourceName: 'The New Times Rwanda', type: 'fuel', title: 'Diesel price stable for third month', oldFare: 1250, newFare: 1250, routeName: null, transportType: null, discoveryDate: '2025-12-05', status: 'PENDING_VERIFICATION', adminNotes: 'Article mentions stable diesel prices', verifiedBy: null, verifiedAt: null, publishedAt: null, createdAt: '2025-12-05T12:00:00Z' },
];

// ─── Complaints ───────────────────────────────────────────────────────────────
export const mockComplaints = [
  { id: 'cp01', userId: 'u05', userName: 'Jean Niyonzima', category: 'OVERCHARGING', description: 'Charged RWF 800 for moto from Kimironko to Downtown instead of published RWF 700. Driver refused to lower the fare.', route: 'Kimironko → Downtown', status: 'IN_PROGRESS', createdAt: '2025-12-01T09:30:00Z', updatedAt: '2025-12-02T14:00:00Z' },
  { id: 'cp02', userId: 'u05', userName: 'Alice Uwimana', category: 'DRIVER_BEHAVIOR', description: 'Bus driver on Kigali-Musanze route was using phone while driving and driving recklessly around bends.', route: 'Kigali → Musanze', status: 'OPEN', createdAt: '2025-12-02T15:20:00Z', updatedAt: '2025-12-02T15:20:00Z' },
  { id: 'cp03', userId: 'u05', userName: 'Patrick Habimana', category: 'VEHICLE_CONDITION', description: 'Minibus on Kigali-Huye route had broken seats and no seatbelts. Very uncomfortable journey.', route: 'Kigali → Huye', status: 'RESOLVED', createdAt: '2025-11-25T11:00:00Z', updatedAt: '2025-11-30T10:00:00Z' },
  { id: 'cp04', userId: 'u05', userName: 'Marie Claire Mukamana', category: 'REFUSAL_TO_CARRY', description: 'Taxi driver refused to carry passenger with luggage from Nyabugogo to Kimironko, claiming luggage took too much space.', route: 'Nyabugogo → Kimironko', status: 'OPEN', createdAt: '2025-12-03T08:45:00Z', updatedAt: '2025-12-03T08:45:00Z' },
  { id: 'cp05', userId: 'u05', userName: 'Emmanuel Ndayisaba', category: 'SAFETY', description: 'Moto taxi driver did not provide helmet for passenger on Kicukiro-Downtown route.', route: 'Kicukiro → Downtown', status: 'IN_PROGRESS', createdAt: '2025-12-02T17:10:00Z', updatedAt: '2025-12-03T09:00:00Z' },
  { id: 'cp06', userId: 'u05', userName: 'Grace Uwera', category: 'LATE_SERVICE', description: 'Bus from Kigali to Gisenyi departed 2 hours late without any announcement. Passengers had no information.', route: 'Kigali → Rubavu (Gisenyi)', status: 'CLOSED', createdAt: '2025-11-20T07:00:00Z', updatedAt: '2025-11-28T16:00:00Z' },
  { id: 'cp07', userId: 'u05', userName: 'Jean Bosco Mugisha', category: 'OVERCHARGING', description: 'Minibus charged RWF 4500 for Kigali-Huye instead of published RWF 4000. Claimed fuel price increase justified it.', route: 'Kigali → Huye', status: 'OPEN', createdAt: '2025-12-04T10:30:00Z', updatedAt: '2025-12-04T10:30:00Z' },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const mockAuditLogs = [
  { id: 'al01', userId: 'u01', userName: 'Super Admin', action: 'LOGIN', recordType: 'auth', recordId: 'u01', oldValue: null, newValue: null, ipAddress: '192.168.1.10', createdAt: '2025-12-05T08:00:00Z' },
  { id: 'al02', userId: 'u01', userName: 'Super Admin', action: 'UPDATE', recordType: 'fare', recordId: 'f01', oldValue: { fare: 475 }, newValue: { fare: 500 }, ipAddress: '192.168.1.10', createdAt: '2025-12-01T10:15:00Z' },
  { id: 'al03', userId: 'u01', userName: 'Super Admin', action: 'PUBLISH', recordType: 'fare', recordId: 'f28', oldValue: { status: 'VERIFIED' }, newValue: { status: 'PUBLISHED' }, ipAddress: '192.168.1.10', createdAt: '2025-12-01T09:30:00Z' },
  { id: 'al04', userId: 'u02', userName: 'Authority User', action: 'APPROVE', recordType: 'research', recordId: 'ri01', oldValue: { status: 'PENDING_VERIFICATION' }, newValue: { status: 'APPROVED' }, ipAddress: '192.168.1.20', createdAt: '2025-11-22T10:00:00Z' },
  { id: 'al05', userId: 'u03', userName: 'Coop Admin', action: 'CREATE', recordType: 'fare', recordId: 'f29', oldValue: null, newValue: { fare: 1200, route: 'Musanze → Gakenke' }, ipAddress: '192.168.1.30', createdAt: '2025-11-28T10:00:00Z' },
  { id: 'al06', userId: 'u01', userName: 'Super Admin', action: 'REJECT', recordType: 'research', recordId: 'ri07', oldValue: { status: 'PENDING_VERIFICATION' }, newValue: { status: 'REJECTED' }, ipAddress: '192.168.1.10', createdAt: '2025-11-27T10:00:00Z' },
  { id: 'al07', userId: 'u02', userName: 'Authority User', action: 'UPDATE', recordType: 'source', recordId: 'src08', oldValue: { status: 'ACTIVE' }, newValue: { status: 'PENDING_REVIEW' }, ipAddress: '192.168.1.20', createdAt: '2025-11-26T14:00:00Z' },
  { id: 'al08', userId: 'u01', userName: 'Super Admin', action: 'CREATE', recordType: 'route', recordId: 'r25', oldValue: null, newValue: { name: 'Kigali → Rusizi', distance: 220 }, ipAddress: '192.168.1.10', createdAt: '2025-12-01T08:00:00Z' },
  { id: 'al09', userId: 'u01', userName: 'Super Admin', action: 'UPDATE', recordType: 'fuel', recordId: 'fp01', oldValue: { price: 1320 }, newValue: { price: 1350 }, ipAddress: '192.168.1.10', createdAt: '2025-11-30T12:00:00Z' },
  { id: 'al10', userId: 'u03', userName: 'Coop Admin', action: 'CREATE', recordType: 'fare', recordId: 'f30', oldValue: null, newValue: { fare: 1500, route: 'Kigali → Kamonyi' }, ipAddress: '192.168.1.30', createdAt: '2025-11-28T10:30:00Z' },
  { id: 'al11', userId: 'u01', userName: 'Super Admin', action: 'LOGIN', recordType: 'auth', recordId: 'u01', oldValue: null, newValue: null, ipAddress: '192.168.1.10', createdAt: '2025-12-04T08:00:00Z' },
  { id: 'al12', userId: 'u02', userName: 'Authority User', action: 'UPDATE', recordType: 'complaint', recordId: 'cp01', oldValue: { status: 'OPEN' }, newValue: { status: 'IN_PROGRESS' }, ipAddress: '192.168.1.20', createdAt: '2025-12-02T14:00:00Z' },
];

// ─── Demo Users ───────────────────────────────────────────────────────────────
export const mockUsers = [
  { id: 'u01', email: 'admin@example.com', name: 'Super Admin', role: 'SUPER_ADMIN', avatar: null, phone: '+250788000001', district: 'Nyarugenge', sector: 'Downtown', isActive: true, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-12-01T00:00:00Z', lastLoginAt: '2025-12-05T08:00:00Z' },
  { id: 'u02', email: 'authority@example.com', name: 'Authority User', role: 'AUTHORITY', avatar: null, phone: '+250788000002', district: 'Nyarugenge', sector: 'Downtown', isActive: true, createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-12-01T00:00:00Z', lastLoginAt: '2025-12-05T07:30:00Z' },
  { id: 'u03', email: 'cooperative@example.com', name: 'Coop Admin', role: 'COOPERATIVE_ADMIN', avatar: null, phone: '+250788000003', district: 'Nyarugenge', sector: 'Nyabugogo', isActive: true, createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-12-01T00:00:00Z', lastLoginAt: '2025-12-04T09:00:00Z' },
  { id: 'u04', email: 'driver@example.com', name: 'Driver One', role: 'DRIVER', avatar: null, phone: '+250788000004', district: 'Gasabo', sector: 'Kimironko', isActive: true, createdAt: '2025-03-01T00:00:00Z', updatedAt: '2025-12-01T00:00:00Z', lastLoginAt: '2025-12-05T06:00:00Z' },
  { id: 'u05', email: 'passenger@example.com', name: 'Passenger One', role: 'PASSENGER', avatar: null, phone: '+250788000005', district: 'Kicukiro', sector: 'Kicukiro', isActive: true, createdAt: '2025-04-01T00:00:00Z', updatedAt: '2025-12-01T00:00:00Z', lastLoginAt: '2025-12-05T08:15:00Z' },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const mockNotifications = [
  { id: 'n01', type: 'FARE_UPDATED', title: 'Fare Updated', message: 'Kimironko → Downtown bus fare updated from RWF 475 to RWF 500.', isRead: false, link: '/fares/f01', createdAt: '2025-12-01T10:15:00Z' },
  { id: 'n02', type: 'TARIFF_APPROVED', title: 'Tariff Approved', message: 'Research item "Kigali city fares expected to rise 5%" has been approved.', isRead: true, link: '/research/ri01', createdAt: '2025-11-22T14:00:00Z' },
  { id: 'n03', type: 'FUEL_UPDATE', title: 'Fuel Price Changed', message: 'Petrol price updated from RWF 1,320 to RWF 1,350 effective Dec 1.', isRead: true, link: '/fuel', createdAt: '2025-11-30T12:00:00Z' },
  { id: 'n04', type: 'COMPLAINT_UPDATE', title: 'Complaint Filed', message: 'New overcharging complaint filed on Kimironko → Downtown route.', isRead: false, link: '/complaints/cp01', createdAt: '2025-12-01T09:30:00Z' },
  { id: 'n05', type: 'TARIFF_REJECTED', title: 'Research Rejected', message: 'Research item "Moto fares possibly increased" has been rejected.', isRead: true, link: '/research/ri07', createdAt: '2025-11-27T10:00:00Z' },
  { id: 'n06', type: 'TRANSPORT_ANNOUNCEMENT', title: 'Road Construction Alert', message: 'Kigali-Huye route detour near Muhanga starting Dec 10.', isRead: false, link: '/updates/tu10', createdAt: '2025-12-03T10:00:00Z' },
  { id: 'n07', type: 'ROUTE_ADDED', title: 'New Route Added', message: 'Kigali → Rusizi route added to the platform.', isRead: true, link: '/routes/r25', createdAt: '2025-12-01T08:00:00Z' },
  { id: 'n08', type: 'SYSTEM', title: 'System Maintenance', message: 'Scheduled maintenance window: Dec 8, 2:00 AM - 4:00 AM EAT.', isRead: false, link: null, createdAt: '2025-12-05T00:00:00Z' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL DEMO DATA — Role dashboards, cooperatives, proposals, vehicles, trips
// ALL DATA IS DEMO DATA FOR DEVELOPMENT PURPOSES ONLY
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Roles List (Admin) ───────────────────────────────────────────────────────
export const ROLES_LIST = [
  { id: 'role-passenger', name: 'Passenger', description: 'Search fares, view routes, track trips and report issues.', userCount: 1280, isBuiltIn: true, permissions: ['view_fares', 'search_routes', 'book_trips', 'submit_complaints', 'save_routes'] },
  { id: 'role-driver', name: 'Driver', description: 'Record trips, view earnings, manage vehicle and respond to complaints.', userCount: 342, isBuiltIn: true, permissions: ['view_fares', 'record_trips', 'view_earnings', 'manage_vehicle', 'view_notifications'] },
  { id: 'role-coop', name: 'Cooperative Admin', description: 'Manage members, drivers, vehicles, tariffs and submit fare proposals.', userCount: 18, isBuiltIn: true, permissions: ['manage_members', 'manage_vehicles', 'manage_tariffs', 'submit_proposals', 'view_reports'] },
  { id: 'role-authority', name: 'Authority', description: 'Review proposals, approve tariffs, monitor cooperatives and compliance.', userCount: 6, isBuiltIn: true, permissions: ['review_proposals', 'approve_tariffs', 'monitor_compliance', 'view_analytics', 'export_reports'] },
  { id: 'role-admin', name: 'Super Admin', description: 'Full platform control: users, roles, fares, research, sources and settings.', userCount: 2, isBuiltIn: true, permissions: ['manage_users', 'manage_roles', 'manage_fares', 'manage_research', 'manage_sources', 'manage_settings', 'view_audit_logs', 'view_analytics'] },
];

// ─── Districts Summary (Authority/Admin) ─────────────────────────────────────
export const DISTRICTS = mockDistricts.map((d) => {
  const districtFares = mockFares.filter((f) => f.district === d.name);
  const districtRoutes = mockRoutes.filter((r) => r.originDistrict === d.name || r.destinationDistrict === d.name);
  return {
    id: d.id,
    name: d.name,
    province: d.province,
    routes: districtRoutes.length || Math.max(2, Math.floor((d.lat * d.lng) % 12)),
    activeFares: districtFares.length || Math.max(1, Math.floor((d.lat * d.lng) % 8)),
  };
});

// ─── Transport Types (mockData flavour — value/label for Select) ─────────────
export const TRANSPORT_TYPES = [
  { value: 'bus', label: 'Bus' },
  { value: 'moto', label: 'Motorcycle' },
  { value: 'taxi', label: 'Taxi / Car' },
  { value: 'minibus', label: 'Minibus' },
  { value: 'truck', label: 'Truck' },
];

// ─── Trips ────────────────────────────────────────────────────────────────────
export const mockTrips = [
  { id: 't01', route: 'Kimironko → Downtown', routeName: 'Kimironko → Downtown', origin: 'Kimironko', destination: 'Downtown', date: '2025-12-05T08:10:00Z', transportType: 'bus', passengers: 24, fare: 500, earnings: 12000, status: 'COMPLETED' },
  { id: 't02', route: 'Nyabugogo → Kimironko', routeName: 'Nyabugogo → Kimironko', origin: 'Nyabugogo', destination: 'Kimironko', date: '2025-12-05T07:30:00Z', transportType: 'taxi', passengers: 3, fare: 1500, earnings: 4500, status: 'COMPLETED' },
  { id: 't03', route: 'Kicukiro → Downtown', routeName: 'Kicukiro → Downtown', origin: 'Kicukiro', destination: 'Downtown', date: '2025-12-05T09:00:00Z', transportType: 'bus', passengers: 30, fare: 500, earnings: 15000, status: 'ONGOING' },
  { id: 't04', route: 'Kigali → Muhanga', routeName: 'Kigali → Muhanga', origin: 'Kigali', destination: 'Muhanga', date: '2025-12-04T14:00:00Z', transportType: 'minibus', passengers: 12, fare: 2000, earnings: 24000, status: 'COMPLETED' },
  { id: 't05', route: 'Kimironko → Nyamirambo', routeName: 'Kimironko → Nyamirambo', origin: 'Kimironko', destination: 'Nyamirambo', date: '2025-12-04T11:45:00Z', transportType: 'moto', passengers: 1, fare: 700, earnings: 700, status: 'SCHEDULED' },
  { id: 't06', route: 'Kigali → Musanze', routeName: 'Kigali → Musanze', origin: 'Kigali', destination: 'Musanze', date: '2025-12-03T06:00:00Z', transportType: 'bus', passengers: 44, fare: 3500, earnings: 154000, status: 'COMPLETED' },
  { id: 't07', route: 'Nyamirambo → Downtown', routeName: 'Nyamirambo → Downtown', origin: 'Nyamirambo', destination: 'Downtown', date: '2025-12-03T17:20:00Z', transportType: 'moto', passengers: 1, fare: 500, earnings: 500, status: 'CANCELLED' },
  { id: 't08', route: 'Kigali → Huye', routeName: 'Kigali → Huye', origin: 'Kigali', destination: 'Huye', date: '2025-12-02T08:00:00Z', transportType: 'bus', passengers: 40, fare: 4500, earnings: 180000, status: 'COMPLETED' },
];

// ─── Vehicles ─────────────────────────────────────────────────────────────────
export const mockVehicles = [
  { id: 'v01', plateNumber: 'RAD 123A', make: 'Toyota', model: 'Hiace', year: 2021, type: 'bus', status: 'ACTIVE', registrationStatus: 'VERIFIED', driverId: 'u04', driverName: 'Driver One', insuranceExpiry: '2026-06-30', lastInspection: '2025-11-15', cooperativeId: 'coop1', capacity: 16 },
  { id: 'v02', plateNumber: 'RAC 456B', make: 'Kia', model: 'K2700', year: 2019, type: 'minibus', status: 'ACTIVE', registrationStatus: 'VERIFIED', driverId: null, driverName: 'Unassigned', insuranceExpiry: '2026-03-15', lastInspection: '2025-10-20', cooperativeId: 'coop1', capacity: 12 },
  { id: 'v03', plateNumber: 'RAE 789C', make: 'Isuzu', model: 'NPR', year: 2020, type: 'bus', status: 'MAINTENANCE', registrationStatus: 'PENDING_REVIEW', driverId: null, driverName: 'Unassigned', insuranceExpiry: '2026-02-28', lastInspection: '2025-09-10', cooperativeId: 'coop1', capacity: 30 },
  { id: 'v04', plateNumber: 'RAB 321D', make: 'Mitsubishi', model: 'L200', year: 2022, type: 'taxi', status: 'ACTIVE', registrationStatus: 'VERIFIED', driverId: 'u06', driverName: 'Driver Two', insuranceExpiry: '2026-08-20', lastInspection: '2025-12-01', cooperativeId: 'coop1', capacity: 4 },
];

// ─── Drivers (Cooperative) ────────────────────────────────────────────────────
export const mockDrivers = [
  { id: 'u04', name: 'Driver One', phone: '+250788000004', email: 'driver@example.com', licenseNumber: 'DL-2024-001', vehicle: 'RAD 123A', vehicleId: 'v01', rating: 4.8, trips: 126, status: 'ACTIVE' },
  { id: 'u06', name: 'Driver Two', phone: '+250788000006', email: 'driver2@example.com', licenseNumber: 'DL-2023-044', vehicle: 'RAB 321D', vehicleId: 'v04', rating: 4.6, trips: 98, status: 'ACTIVE' },
  { id: 'u07', name: 'Driver Three', phone: '+250788000007', email: 'driver3@example.com', licenseNumber: 'DL-2023-087', vehicle: 'Unassigned', vehicleId: null, rating: 4.2, trips: 64, status: 'INACTIVE' },
  { id: 'u08', name: 'Driver Four', phone: '+250788000008', email: 'driver4@example.com', licenseNumber: 'DL-2025-012', vehicle: 'Unassigned', vehicleId: null, rating: 4.9, trips: 14, status: 'ACTIVE' },
];

// ─── Proposals (Tariff) ───────────────────────────────────────────────────────
export const mockProposals = [
  { id: 'p01', cooperativeId: 'coop1', cooperativeName: 'Kigali Transport Cooperative', route: 'Kimironko → Downtown', transportType: 'bus', currentFare: 475, proposedFare: 500, submittedDate: '2025-11-20', status: 'PENDING', justification: 'Fuel price increase and maintenance costs.' },
  { id: 'p02', cooperativeId: 'coop1', cooperativeName: 'Kigali Transport Cooperative', route: 'Kigali → Musanze', transportType: 'minibus', currentFare: 2800, proposedFare: 3000, submittedDate: '2025-11-15', status: 'APPROVED', justification: 'Distance-based adjustment after RURA fuel review.' },
  { id: 'p03', cooperativeId: 'coop1', cooperativeName: 'Kigali Transport Cooperative', route: 'Kigali → Huye', transportType: 'bus', currentFare: 4200, proposedFare: 4500, submittedDate: '2025-12-01', status: 'PENDING', justification: 'Network expansion and improved service frequency.' },
  { id: 'p04', cooperativeId: 'coop1', cooperativeName: 'Kigali Transport Cooperative', route: 'Musanze → Gakenke', transportType: 'minibus', currentFare: 1000, proposedFare: 1200, submittedDate: '2025-11-28', status: 'REJECTED', justification: 'Requested fare exceeds distance-based guideline.' },
];

// ─── Cooperatives ─────────────────────────────────────────────────────────────
export const mockCooperatives = [
  { id: 'coop1', name: 'Kigali Transport Cooperative', district: 'Nyarugenge', joinDate: '2023-05-12', status: 'ACTIVE', members: 142, drivers: 88, routes: 16, activeTariffs: 32 },
  { id: 'coop2', name: 'Volcano Express Cooperative', district: 'Musanze', joinDate: '2022-11-03', status: 'ACTIVE', members: 96, drivers: 61, routes: 9, activeTariffs: 18 },
  { id: 'coop3', name: 'Western Province Transit', district: 'Rubavu', joinDate: '2024-02-20', status: 'PENDING_REVIEW', members: 54, drivers: 33, routes: 7, activeTariffs: 12 },
  { id: 'coop4', name: 'Southern Highlands Coop', district: 'Huye', joinDate: '2024-07-08', status: 'SUSPENDED', members: 38, drivers: 24, routes: 5, activeTariffs: 9 },
];

// ─── Members (Cooperative) ────────────────────────────────────────────────────
export const mockMembers = [
  { id: 'm01', name: 'Jean Bosco Mugisha', email: 'mugisha@coop.rw', role: 'Driver', joinDate: '2023-06-01', status: 'ACTIVE', trips: 214, phone: '+250788111001' },
  { id: 'm02', name: 'Aloys Niyonzima', email: 'niyonzima@coop.rw', role: 'Driver', joinDate: '2023-06-15', status: 'ACTIVE', trips: 198, phone: '+250788111002' },
  { id: 'm03', name: 'Claudine Mukamana', email: 'claudine@coop.rw', role: 'Operator', joinDate: '2024-01-10', status: 'ACTIVE', trips: 0, phone: '+250788111003' },
  { id: 'm04', name: 'Patrick Habimana', email: 'habimana@coop.rw', role: 'Driver', joinDate: '2024-03-22', status: 'PENDING_VERIFICATION', trips: 45, phone: '+250788111004' },
  { id: 'm05', name: 'Grace Uwera', email: 'uwera@coop.rw', role: 'Treasurer', joinDate: '2022-12-05', status: 'ACTIVE', trips: 0, phone: '+250788111005' },
];
