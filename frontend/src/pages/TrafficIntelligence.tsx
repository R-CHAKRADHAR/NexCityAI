import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Zone {
  zone_name: string;
  traffic_density: number;
  footfall: number;
  avg_speed: number;
  peak_hour: boolean;
}

interface Alert {
  type: string;
  message: string;
}

export default function Traffic() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [systemStatus, setSystemStatus] = useState("smooth");

  const [densityHistory, setDensityHistory] = useState<
    Record<string, { time: string; value: number }[]>
  >({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/traffic");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setZones(data.zones);
      setAlerts(data.alerts || []);
      setSystemStatus(data.system_status || "smooth");

      setDensityHistory((prev) => {
        const updated = { ...prev };

        data.zones.forEach((zone: Zone) => {
          if (!updated[zone.zone_name]) {
            updated[zone.zone_name] = [];
          }

          updated[zone.zone_name] = [
            ...updated[zone.zone_name].slice(-15),
            { time: new Date().toLocaleTimeString(),
        value: zone.traffic_density, },
          ];
        });

        return updated;
      });
    };

    return () => ws.close();
  }, []);

  const getTrafficColor = (density: number) => {
    if (density > 0.8) return "border-red-500";
    if (density > 0.6) return "border-yellow-400";
    return "border-white/10";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="flex justify-between mb-10">
        <h1 className="text-4xl font-bold">
          Footfall & Traffic Intelligence
        </h1>

        <div className="px-4 py-2 bg-cyan-600 rounded-full text-sm">
          Status: {systemStatus.toUpperCase()}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-8 bg-red-900/40 border border-red-500 p-4 rounded-xl">
          <h2 className="font-semibold mb-3">🚨 Traffic Alerts</h2>
          {alerts.map((alert, i) => (
            <div key={i} className="bg-red-800/50 p-3 rounded mb-2">
              {alert.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {zones.map((zone, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className={`bg-slate-900 p-6 rounded-2xl border ${getTrafficColor(zone.traffic_density)}`}
          >

            <h2 className="text-xl font-bold mb-4">
              {zone.zone_name}
            </h2>

            <p>Traffic Density: {(zone.traffic_density * 100).toFixed(0)}%</p>
            <p>Footfall: {zone.footfall}</p>
            <p>Avg Speed: {zone.avg_speed} km/h</p>

            {zone.peak_hour && (
              <div className="mt-2 text-yellow-400 font-semibold">
                🔥 Peak Hour Active
              </div>
            )}

            {/* Mini Trend Chart */}
            <div className="mt-4 h-40 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={densityHistory[zone.zone_name] || []}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                />

                <YAxis
                    domain={[0, 1]} // traffic density
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                />

                <Tooltip />

                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#facc15"
                    strokeWidth={2}
                    dot={false}
                />
                </LineChart>
            </ResponsiveContainer>
            </div>

          </motion.div>
        ))}

      </div>
    </div>
  );
}