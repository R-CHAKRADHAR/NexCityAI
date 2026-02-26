import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { Bin } from "../types";

interface Props {
  bins: Bin[];
  route: Bin[];
  anomalies: Record<number, boolean>;
  depot: [number, number];
}

const normalIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const overflowIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/564/564619.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const depotIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

function RecenterMap({
  bins,
  depot,
}: {
  bins: Bin[];
  depot: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (bins.length > 0) {
      const points = [
        L.latLng(depot[0], depot[1]),
        ...bins.map((b) =>
          L.latLng(b.location[0], b.location[1])
        ),
      ];

      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bins, depot, map]);

  return null;
}

export default function SmartMap({
  bins,
  route,
  anomalies,
  depot,
}: Props) {
  const routePositions = [
    depot,
    ...route.map((b) => b.location),
    depot,
  ];

  return (
    <MapContainer
      center={depot}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      className="rounded-xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Auto Fit Bounds */}
      <RecenterMap bins={bins} depot={depot} />

      {/* Depot Marker */}
      <Marker position={depot} icon={depotIcon}>
        <Popup>
          <strong>City Depot</strong>
        </Popup>
      </Marker>

      {/* Bin Markers */}
      {bins.map((bin) => (
        <Marker
          key={bin.bin_id}
          position={bin.location}
          icon={
            anomalies[bin.bin_id]
              ? overflowIcon
              : normalIcon
          }
        >
          <Popup>
            <strong>Bin {bin.bin_id}</strong>
            <br />
            Level: {bin.level}
          </Popup>
        </Marker>
      ))}

      {/* Optimized Route */}
      {route.length > 0 && (
        <Polyline
          positions={routePositions}
          pathOptions={{
            color: "cyan",
            weight: 5,
          }}
        />
      )}
    </MapContainer>
  );
}