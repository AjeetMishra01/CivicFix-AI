import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const extractLocationName = (address, displayName) => {
  if (!address) return displayName?.split(',')[0] || '';
  return address.road || address.neighbourhood || address.suburb || address.village || address.town || address.city || address.state || displayName?.split(',')[0] || '';
};

const reverseGeocode = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Reverse geocode failed');
  const data = await response.json();
  return {
    address: data.display_name || '',
    location: extractLocationName(data.address, data.display_name)
  };
};

export const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Geocode failed');
  const data = await response.json();
  if (!data.length) throw new Error('Address not found');
  const place = data[0];
  return {
    lat: Number(place.lat),
    lng: Number(place.lon),
    address: place.display_name,
    location: extractLocationName(place.address, place.display_name)
  };
};

const SetViewOnChange = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [map, position]);
  return null;
};

const MapEvents = ({ onSelect }) => {
  useMapEvents({
    click: (e) => onSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
  });
  return null;
};

const MapPicker = ({ value, onChange }) => {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const position = value?.lat != null && value?.lng != null ? [value.lat, value.lng] : [20.5937, 78.9629];

  const updatePosition = async ({ lat, lng }) => {
    setStatus('Resolving address...');
    setError('');
    try {
      const locationData = await reverseGeocode(lat, lng);
      onChange({ lat, lng, address: locationData.address, location: locationData.location });
    } catch (err) {
      setError('Unable to fetch address');
      onChange({ lat, lng });
    } finally {
      setStatus('');
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setStatus('Fetching current location...');
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updatePosition({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setError('Location permission denied');
        setStatus('');
      }
    );
  };

  const handleMarkerDrag = async (e) => {
    const latlng = e.target.getLatLng();
    updatePosition({ lat: latlng.lat, lng: latlng.lng });
  };

  return (
    <div className="rounded-xl border p-3">
      <div className="flex flex-col gap-2 mb-3">
        <button type="button" className="rounded-xl border px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={handleCurrentLocation}>
          Use Current Location
        </button>
        {status && <p className="text-xs text-slate-500">{status}</p>}
        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>
      <div className="h-56 w-full overflow-hidden rounded-xl">
        <MapContainer center={position} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <MapEvents onSelect={updatePosition} />
          <SetViewOnChange position={position} />
          {value?.lat != null && value?.lng != null && (
            <Marker position={[value.lat, value.lng]} icon={icon} draggable eventHandlers={{ dragend: handleMarkerDrag }} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPicker;
