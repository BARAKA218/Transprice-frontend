import { buildFareResult, searchSuggestions, getPopularRoutes, resolvePlace } from './src/services/searchService.js';
import { getPopularDestinations } from './src/services/searchService.js';
import { mockRoutes, mockFares } from './src/data/mockData.js';

const DATA = { routes: mockRoutes, fares: mockFares };

const cases = [
  ['Kigali', 'Muhanga', ''],
  ['kigali', 'huYe', ''],
  ['KIGALI', 'MUSANZE', 'bus'],
  ['Kigali', 'Gisenyi', ''],
  ['Rubavu', 'Kigali', ''],
  ['Kigali', 'Rusizi', ''],
  ['Kigali', 'Rwamagana', ''],
  ['Kigali', 'Nyagatare', ''],
  ['Kigali', 'Kayonza', ''],
  ['Kigali', 'Karongi', ''],
  ['Kimironko', 'Downtown', ''],
  ['Nyabugogo', 'Kimironko', ''],
  ['Gisenyi', 'Kibuye', ''],
  ['Musanze', 'Gisenyi', ''],
  ['Huye', 'Nyanza', ''],
  ['Butare', 'Kigali', ''],
  ['Ruhengeri', 'Kigali', ''],
  ['Kigali', 'Kirehe', ''],
  ['Kigali', 'Nyagatare', 'moto'],
  ['Kigali', 'Huye', 'taxi'],
  ['Kigali International Airport', 'Downtown', ''],
  ['Downtown', 'Kigali International Airport', ''],
  ['Gasabo', 'Huye', ''],
  ['Kimihurura', 'Remera', ''],
  ['Muhanga', 'Muhanga', ''],
  ['Totally Unknown Place', 'Kigali', ''],
];

let pass = 0;
let fail = 0;
for (const [o, d, t] of cases) {
  const r = buildFareResult({ origin: o, destination: d, transportType: t }, DATA);
  const flags = r.ok ? r.options.map((x) => (x.isOfficial ? 'OFF' : x.isEstimate ? 'EST' : 'NA') + `:${x.finalFare ?? '-'}`).join(' ') : 'NOT FOUND';
  const ok = r.ok && r.options.filter((x) => x.isAvailable).length > 0 ? 'PASS' : 'CHECK';
  if (ok === 'PASS') pass += 1; else fail += 1;
  console.log(`${ok} ${o} → ${d} [${t||'all'}] :: ${flags}`);
}

console.log('---');
console.log('aliases check:');
for (const q of ['gisenyi', 'Rubavu', 'butare', 'Huye Town', 'ruhengeri', 'Musanze Town', 'nyabugogo', 'kgl', 'kanombe', 'kibuye', 'cyangugu', 'kimihurura']) {
  const p = resolvePlace(q);
  console.log(`  '${q}' → ${p ? p.name + ' (id:' + p.id + ')' : 'NULL'}`);
}

console.log('---');
console.log('suggestions for "kigali muh":', searchSuggestions('kigali muh', { limit: 6 }).map((s) => `${s.kind}:${s.label}`).join(' | '));
console.log('suggestions for "mu":', searchSuggestions('mu', { limit: 6 }).map((s) => `${s.kind}:${s.label}`).join(' | '));
console.log('suggestions for "air":', searchSuggestions('air', { limit: 6 }).map((s) => `${s.kind}:${s.label}`).join(' | '));

const pops = getPopularRoutes(DATA);
console.log('---');
console.log('popular routes:');
for (const p of pops) console.log(`  ${p.from} → ${p.to}: ${p.fare} ${p.isOfficial ? 'OFFICIAL' : p.isEstimate ? 'EST' : 'NA'} (${p.transportType}, ${p.distanceKm}km)`);
console.log('popular destinations:', getPopularDestinations().map((d) => d.name).join(', '));

const motoLong = buildFareResult({ origin: 'Kigali', destination: 'Kirehe', transportType: 'moto' }, DATA);
console.log('Kigali→Kirehe moto:', motoLong.ok ? motoLong.options.map((o) => o.transportType + ':' + (o.isAvailable ? (o.finalFare ?? 'NA') : 'NA')).join(' ') : 'NOT FOUND');
const taxiLong = buildFareResult({ origin: 'Kigali', destination: 'Kirehe', transportType: 'taxi' }, DATA);
console.log('Kigali→Kirehe taxi:', taxiLong.ok ? taxiLong.options.map((o) => o.transportType + ':' + (o.isAvailable ? (o.finalFare ?? 'NA') : 'NA')).join(' ') : 'NOT FOUND');

console.log('---');
console.log(`RESULT: ${pass} passing, ${fail} needing review`);