import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";

interface Props {
  darkMode: boolean;
  toggleTheme: () => void;
}

export default function CommandCenter({ darkMode, toggleTheme }: Props) {
  const [cityScore, setCityScore] = useState(85);

  useEffect(() => {
    const interval = setInterval(() => {
      setCityScore(Math.floor(Math.random() * 10) + 80);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const modules = [
    {
      name: "Smart Waste Routing",
      route: "/dashboard",
      status: "Operational",
      color: "bg-emerald-600",
    },
    {
      name: "Predictive Maintenance",
      route: "/maintenance",
      status: "Stable",
      color: "bg-cyan-600",
    },
    {
      name: "Footfall & Traffic Intelligence",
      route: "/traffic",
      status: "Moderate",
      color: "bg-yellow-600",
    },
    {
      name: "Water & Energy AI",
      route: "/energy",
      status: "Efficient",
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-slate-950 text-black dark:text-white">

      {/* HEADER (Always Black as you requested) */}
      <header className="bg-black text-white px-8 py-5 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">
          Smart City Command Center
        </h1>

        <button
          onClick={toggleTheme}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </header>

      {/* CITY SCORE */}
      <section className="py-16 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-6"
        >
          City Operational Health Index
        </motion.h2>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mx-auto w-64 h-64 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl"
        >
          <div className="text-6xl font-bold text-white">
            <CountUp end={cityScore} duration={1.5} />%
          </div>
        </motion.div>

        <p className="mt-6 text-gray-600 dark:text-slate-400">
          Overall Smart Infrastructure Stability
        </p>

      </section>

      {/* MODULE GRID */}
      <section className="px-8 pb-20">

        <h3 className="text-3xl font-semibold mb-10 text-center">
          Live AI Modules
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

          {modules.map((module, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl shadow-xl border transition bg-gray-100 dark:bg-slate-900 border-gray-300 dark:border-white/10"
            >
              <h4 className="text-xl font-bold mb-4">
                {module.name}
              </h4>

              <div
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${module.color}`}
              >
                {module.status}
              </div>

              <Link
                to={module.route}
                className="block text-center bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg transition"
              >
                Open Module →
              </Link>
            </motion.div>
          ))}

        </div>

      </section>

    </div>
  );
}
