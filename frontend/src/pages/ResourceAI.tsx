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

interface Ward {
  ward_name: string;
  water_usage: number;
  energy_usage: number;
  sustainability_index: number;
  carbon_emission: number;
}

interface Alert {
  type: string;
  message: string;
}

export default function ResourceAI() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cityStatus, setCityStatus] = useState("efficient");

  const [sustainHistory, setSustainHistory] = useState<
    Record<string, { time: string , value: number }[]>
  >({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/resource");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setWards(data.wards);
      setAlerts(data.alerts || []);
      setCityStatus(data.city_status || "efficient");

      setSustainHistory((prev) => {
        const updated = { ...prev };

        data.wards.forEach((ward: Ward) => {
          if (!updated[ward.ward_name]) {
            updated[ward.ward_name] = [];
          }

          updated[ward.ward_name] = [
            ...updated[ward.ward_name].slice(-15),
            { time: new Date().toLocaleTimeString(),value: ward.sustainability_index },
          ];
        });

        return updated;
      });
    };

    return () => ws.close();
  }, []);

  const getRiskBorder = (index: number) => {
    if (index < 40) return "border-red-500";
    if (index < 60) return "border-yellow-400";
    return "border-white/10";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="flex justify-between mb-10">
        <h1 className="text-4xl font-bold">
          Water & Energy AI
        </h1>

        <div className="px-4 py-2 bg-purple-600 rounded-full text-sm">
          Status: {cityStatus.toUpperCase()}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-8 bg-red-900/40 border border-red-500 p-4 rounded-xl">
          <h2 className="font-semibold mb-3">🚨 Sustainability Alerts</h2>
          {alerts.map((alert, i) => (
            <div key={i} className="bg-red-800/50 p-3 rounded mb-2">
              {alert.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {wards.map((ward, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className={`bg-slate-900 p-6 rounded-2xl border ${getRiskBorder(ward.sustainability_index)}`}
          >

            <h2 className="text-xl font-bold mb-4">
              {ward.ward_name}
            </h2>

            <p>Water Usage: {ward.water_usage} KL</p>
            <p>Energy Usage: {ward.energy_usage} kWh</p>
            <p>Carbon Emission: {ward.carbon_emission?.toFixed(2)} tons</p>
            <p>Sustainability Index: {ward.sustainability_index?.toFixed(0)}%</p>

            {/* Sustainability Trend */}
            <div className="mt-4 h-40 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={sustainHistory[ward.ward_name] || []}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                />

                <YAxis
                    domain={[0, 100]} // sustainability %
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                />

                <Tooltip />

                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
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