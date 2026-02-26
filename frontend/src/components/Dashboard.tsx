import { useEffect, useState } from "react";
import type { SystemData } from "../types";

import LiveChart from "./LiveChart";
import Alerts from "./Alerts";
import RoutePanel from "./RoutePanel";
import MetricsCard from "./MetricsCard";
import SmartMap from "./SmartMap";

interface DashboardProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export default function Dashboard({ darkMode, toggleTheme }: DashboardProps) {
  const [data, setData] = useState<SystemData | null>(null);
  const [chartData, setChartData] = useState<
    { name: string; value: number }[]
  >([]);
  const [connected, setConnected] = useState(false);
  const [city, setCity] = useState("bengaluru");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("Connected");
      setConnected(true);
    };

    ws.onclose = () => {
      console.log("Disconnected");
      setConnected(false);
    };

    ws.onmessage = (event) => {
      const parsed: SystemData = JSON.parse(event.data);
      setData(parsed);

      const avgLevel =
        parsed.bins.reduce((sum, b) => sum + b.level, 0) /
        parsed.bins.length;

      setChartData((prev) => [
        ...prev.slice(-20),
        {
          name: new Date().toLocaleTimeString(),
          value: avgLevel,
        },
      ]);
    };

    return () => {
      ws.close();
    };
  }, [city]); 

  const changeCity = async (newCity: string) => {
    await fetch(`http://localhost:8000/set-city/${newCity}`, {
      method: "POST",
    });

    setChartData([]); // reset chart
    setCity(newCity);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 
                bg-black text-white 
                px-6 py-4 rounded-2xl shadow-lg">

      <h1 className="text-4xl font-bold tracking-wide">
        Smart Waste Routing 
      </h1>

      <div className="flex items-center gap-4">

        <label htmlFor="city-select" className="text-sm font-medium text-white">
          City:
        </label>

        <select
          id="city-select"
          value={city}
          onChange={(e) => changeCity(e.target.value)}
          className="bg-white/10 
                    text-white 
                    border border-white/20 
                    px-3 py-2 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="bengaluru" className="text-black">Bengaluru</option>
          <option value="delhi" className="text-black">Delhi</option>
          <option value="hyderabad" className="text-black">Hyderabad</option>
        </select>

        <button
          onClick={toggleTheme}
          className="bg-white/10 
                    hover:bg-white/20 
                    text-white 
                    px-4 py-2 rounded-lg 
                    text-sm transition"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>

        <div
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            connected ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {connected ? "Live" : "Disconnected"}
        </div>

      </div>
    </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl transition-colors duration-300">
          <h2 className="text-xl mb-4 font-semibold">
            Real-Time Waste Level
          </h2>
          <LiveChart data={chartData} />
        </div>

        {/* Sustainability */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl transition-colors duration-300">
          {data && <MetricsCard metrics={data.sustainability} />}
        </div>

        {/* Map */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl transition-colors duration-300">
          {data && (
            <>
              <h2 className="text-xl mb-4 font-semibold">
                Smart City Map
              </h2>
              <SmartMap
                bins={data.bins}
                route={data.optimized_route}
                anomalies={data.anomalies}
                depot={data.depot}
              />
            </>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl transition-colors duration-300">
          {data && <Alerts alerts={data.alerts} />}
        </div>

        {/* Route */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl transition-colors duration-300">
          {data && <RoutePanel route={data.optimized_route} />}
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl transition-colors duration-300">
          {data && (
            <>
              <h2 className="text-xl mb-4 font-semibold">Route Metrics</h2>
              <p>Distance: {data.route_distance.toFixed(4)} km</p>
              <p>
                Estimated Fuel Used: {(data.route_distance * 0.2).toFixed(2)} L
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}