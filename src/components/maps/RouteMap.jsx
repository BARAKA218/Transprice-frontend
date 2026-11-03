import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertTriangle } from 'lucide-react';

const DEFAULT_CENTER = [-1.94, 29.87];
const DEFAULT_ZOOM = 8;

const defaultIcon = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;background:#16a34a;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -16],
});

const destinationIcon = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;background:#0f2645;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -16],
});

function createFallbackLine(origin, destination) {
  if (!origin || !destination) return [];
  return [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng],
  ];
}

export default function RouteMap({
  origin = '',
  destination = '',
  originCoords,
  destinationCoords,
  routePoints = [],
}) {
  const [mapError, setMapError] = useState(false);

  const positions = useMemo(() => {
    if (routePoints && routePoints.length >= 2) {
      return routePoints.map((p) => [p.lat, p.lng]);
    }
    return createFallbackLine(originCoords, destinationCoords);
  }, [routePoints, originCoords, destinationCoords]);

  const center = useMemo(() => {
    if (originCoords?.lat && originCoords?.lng) {
      return [originCoords.lat, originCoords.lng];
    }
    return DEFAULT_CENTER;
  }, [originCoords]);

  const hasCoords = originCoords?.lat && originCoords?.lng;

  const renderMap = () => {
    if (mapError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle size={32} className="text-amber-500 mb-3" />
          <p className="text-sm font-medium text-neutral-700">Map could not load</p>
          <p className="text-xs text-neutral-400 mt-1">
            Check your internet connection and try again.
          </p>
        </div>
      );
    }

    if (!hasCoords) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MapPin size={32} className="text-neutral-300 mb-3" />
          <p className="text-sm font-medium text-neutral-500">
            {origin || 'Origin'} → {destination || 'Destination'}
          </p>
          <p className="text-xs text-neutral-400 mt-1">Map preview not available for this route.</p>
        </div>
      );
    }

    return (
      <MapContainer
        center={center}
        zoom={originCoords && destinationCoords ? 8 : DEFAULT_ZOOM}
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        zoomControl={false}
        attributionControl={true}
        style={{ height: '300px', width: '100%' }}
        className="readonly-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{ tileerror: () => setMapError(true) }}
        />
        {originCoords && (
          <Marker
            position={[originCoords.lat, originCoords.lng]}
            icon={defaultIcon}
          >
            <Popup>{origin || 'Origin'}</Popup>
          </Marker>
        )}
        {destinationCoords && (
          <Marker
            position={[destinationCoords.lat, destinationCoords.lng]}
            icon={destinationIcon}
          >
            <Popup>{destination || 'Destination'}</Popup>
          </Marker>
        )}
        {positions.length >= 2 && (
          <Polyline
            positions={positions}
            pathOptions={{ color: '#16a34a', weight: 4, opacity: 0.8, dashArray: '8, 6' }}
          />
        )}
      </MapContainer>
    );
  };

  return (
    <div className="w-full bg-white overflow-hidden">
      {renderMap()}
      <style>{`
        .readonly-map { cursor: default; }
        .readonly-map .leaflet-control-zoom { display: none; }
        .readonly-map .leaflet-popup-content-wrapper {
          border-radius: 8px;
          font-weight: 500;
          color: #0f2645;
        }
      `}</style>
    </div>
  );
}