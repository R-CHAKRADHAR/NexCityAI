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

interface Asset {
  name: string;
  health_score: number;
  temperature: number;
  vibration: number;
  failure_probability: number;
}

interface Alert {
  type: string;
  message: string;
  asset?: string;
}

export default function PredictiveMaintenance() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [systemStatus, setSystemStatus] = useState("stable");

  const [healthHistory, setHealthHistory] = useState<
    Record<string, { time: string; value: number }[]>
  >({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/maintenance");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setAssets(data.assets);
      setAlerts(data.alerts || []);
      setSystemStatus(data.system_status || "stable");

      setHealthHistory((prev) => {
    const updated = { ...prev };

    data.assets.forEach((asset: Asset) => {
        if (!updated[asset.name]) {
        updated[asset.name] = [];
        }

        updated[asset.name] = [
        ...updated[asset.name].slice(-15),
        {
            time: new Date().toLocaleTimeString(),  // 🔥 ADD THIS
            value: asset.health_score,
        },
        ];
    });

    return updated;
    });
    };

    return () => ws.close();
  }, []);

  const getRiskColor = (risk: number) => {
    if (risk > 0.7) return "text-red-500";
    if (risk > 0.4) return "text-yellow-400";
    return "text-emerald-400";
  };

  const getCardBorder = (risk: number) => {
    if (risk > 0.7) return "border-red-500";
    if (risk > 0.4) return "border-yellow-400";
    return "border-white/10";
  };

  const getSystemStatusColor = () => {
    if (systemStatus === "warning") return "bg-yellow-500";
    if (systemStatus === "critical") return "bg-red-600";
    return "bg-emerald-600";
  };

  const calculateRUL = (health: number) => {
    return Math.floor((health / 100) * 30);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">
          Predictive Maintenance AI
        </h1>

        <div className={`px-4 py-2 rounded-full text-sm ${getSystemStatusColor()}`}>
          System Status: {systemStatus.toUpperCase()}
        </div>
      </div>

      {/* ALERT PANEL */}
      {alerts.length > 0 && (
        <div className="mb-8 bg-red-900/40 border border-red-500 p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">
            🚨 Active Alerts
          </h2>

          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-red-800/50 p-3 rounded-lg mb-2"
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* ASSET GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {assets.map((asset, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className={`bg-slate-900 p-6 rounded-2xl shadow-xl border ${getCardBorder(asset.failure_probability)}`}
          >

            <h2 className="text-xl font-bold mb-4">
              {asset.name}
            </h2>

            <p>Health: {asset.health_score}%</p>
            <p>Temperature: {asset.temperature}°C</p>
            <p>Vibration: {asset.vibration}</p>

            <p className={`mt-2 font-semibold ${getRiskColor(asset.failure_probability)}`}>
              Failure Risk: {asset.failure_probability.toFixed(2)}
            </p>

            <p className="mt-2 text-cyan-400">
              Remaining Useful Life: {calculateRUL(asset.health_score)} days
            </p>

            {/* MINI TREND CHART */}
            <div className="mt-4 h-40 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={healthHistory[asset.name] || []}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                />

                <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                />

                <Tooltip />

                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
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