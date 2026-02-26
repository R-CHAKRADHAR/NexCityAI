import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

 interface HomeProps {
  darkMode: boolean;
  toggleTheme: () => void;
}
export default function Home({ darkMode, toggleTheme }: HomeProps) {
  const [previewData, setPreviewData] = useState<
    { value: number; name: string }[]
  >([]);

  const [showBenchmark, setShowBenchmark] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewData((prev) => [
        ...prev.slice(-15),
        {
          name: new Date().toLocaleTimeString(),
          value: Math.floor(Math.random() * 60) + 40,
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  return (
    <div className="bg-white dark:bg-slate-950 text-black dark:text-white relative overflow-hidden transition-colors duration-300">

      {/* Particle Background */}
      <Particles
        id="tsparticles"
        particlesInit={particlesInit}
        options={{
          background: { color: "transparent" },
          particles: {
            number: { value: 50 },
            size: { value: 2 },
            move: { enable: true, speed: 0.6 },
            opacity: { value: 0.3 },
          },
        }}
        className="absolute inset-0 -z-10"
      />

      {/* Glass Navbar */}
      <nav className="fixed top-0 w-full 
                    bg-black/90 backdrop-blur-lg 
                    border-b border-white/10 
                    text-white 
                    z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold tracking-wide">
          NexCity AI
        </h1>

        <button
          onClick={toggleTheme}
          className="bg-white/10 
                    hover:bg-white/20 
                    text-white 
                    px-4 py-2 
                    rounded-lg 
                    text-sm 
                    transition"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>

      </div>
    </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url("/src/assets/smartcity.jpg")`,
        }}
      >
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>

        {/* Neural Network SVG Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
        >
          <line x1="100" y1="100" x2="400" y2="200" stroke="#00ffff" strokeWidth="1">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="400" y1="200" x2="700" y2="150" stroke="#00ffff" strokeWidth="1">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="5s" repeatCount="indefinite" />
          </line>
          <circle cx="100" cy="100" r="4" fill="#00ffff">
            <animate attributeName="r" values="3;6;3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="200" r="4" fill="#00ffff">
            <animate attributeName="r" values="3;6;3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="700" cy="150" r="4" fill="#00ffff">
            <animate attributeName="r" values="3;6;3" dur="5s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Content */}
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            NexCity AI
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10">
            AI-Powered Urban Intelligence Platform for Predictive Routing,
            Infrastructure Monitoring & Sustainable City Optimization.
          </p>
        </div>
      </section>

      {/* Live Preview Section */}
      <section className="py-24 px-6 bg-gray-100 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h3 className="text-3xl font-bold mb-6">
              Real-Time Waste Intelligence
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <Metric value={35} suffix="%" color="text-emerald-400" label="Fuel Reduction" />
              <Metric value={28} suffix="%" color="text-cyan-400" label="CO₂ Reduction" />
              <Metric value={42} suffix="%" color="text-yellow-400" label="Faster Routing" />
              <Metric value={100} suffix="%" color="text-purple-400" label="Real-Time Visibility" />
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-slate-900 rounded-2xl p-6 shadow-xl transition-colors duration-300">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={previewData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00ffff"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </section>

      {/* Performance Section */}
      <section className="py-24 px-6 bg-gray-100 dark:bg-slate-900 transition-colors duration-300 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-12"
        >
          High-Performance AI Infrastructure
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Metric value={500} suffix="+" color="text-emerald-400" label="Predictions / sec" />
          <Metric value={20} prefix="<" suffix="ms" color="text-cyan-400" label="Route Optimization Speed" />
          <Metric value={8} suffix=" Cores" color="text-yellow-400" label="Multi-Core Processing" />
          <Metric value={100} suffix="%" color="text-purple-400" label="Real-Time Visibility" />
        </div>

        <div className="mt-16">
          <button
            onClick={() => setShowBenchmark(true)}
            className="bg-cyan-600 hover:bg-cyan-500 px-8 py-3 rounded-xl shadow-lg transition"
          >
            Run Benchmark Mode
          </button>
        </div>
      </section>

      {/* Benchmark Modal */}
      {showBenchmark && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 p-10 rounded-2xl shadow-xl max-w-lg text-center relative"
          >
            <button
              onClick={() => setShowBenchmark(false)}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Benchmark Results
            </h2>

            <p className="text-slate-400 mb-4">
              AI Computation Speed: <span className="text-emerald-400">18ms</span>
            </p>

            <p className="text-slate-400 mb-4">
              Prediction Throughput: <span className="text-cyan-400">520/sec</span>
            </p>

            <p className="text-slate-400 mb-4">
              Multi-Core Parallel Processing Enabled
            </p>

            <div className="mt-6 text-red-400 font-semibold">
              Powered by AMD Ryzen™ 5000 Series & Radeon™ Graphics
            </div>
          </motion.div>
        </div>
      )}
      <section className="py-24 px-6 bg-gray-100 dark:bg-slate-950 transition-colors duration-300">
        <h2 className="text-4xl font-bold text-center mb-16">
          Smart City AI Modules
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">

          {/* Waste Routing */}
          <Link to="/dashboard"
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl 
                      hover:scale-105 transition transform">
            <h3 className="text-xl font-semibold mb-4">
              Smart Waste Routing
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              AI-powered route optimization and overflow prediction.
            </p>
          </Link>

          {/* Predictive Maintenance */}
          <Link to="/maintenance"
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl 
                      hover:scale-105 transition transform">
            <h3 className="text-xl font-semibold mb-4">
              Predictive Maintenance
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Real-time infrastructure health monitoring & failure detection.
            </p>
          </Link>

          {/* Traffic Intelligence */}
          <Link to="/traffic"
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl 
                      hover:scale-105 transition transform">
            <h3 className="text-xl font-semibold mb-4">
              Footfall & Traffic Intelligence
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              AI-based congestion detection and crowd analytics.
            </p>
          </Link>

          {/* Energy AI */}
          <Link to="/energy"
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl 
                      hover:scale-105 transition transform">
            <h3 className="text-xl font-semibold mb-4">
              Water & Energy Usage AI
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Smart resource consumption monitoring and anomaly detection.
            </p>
          </Link>

        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center bg-gradient-to-r from-emerald-600/20 to-cyan-600/20">
        <h2 className="text-4xl font-bold mb-6">
          Build Sustainable Cities with AI
        </h2>

        <Link
          to="/command-center"
          className="bg-emerald-600 hover:bg-emerald-500 px-10 py-4 rounded-xl text-lg shadow-lg transition"
        >
          Explore Live System
        </Link>
      </section>

    </div>
  );
}

/* Reusable Metric Component */
function Metric({
  value,
  suffix = "",
  prefix = "",
  color,
  label,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  color: string;
  label: string;
}) {
  return (
    <div className="bg-gray-100 dark:bg-slate-900 rounded-2xl p-6 shadow-xl transition-colors duration-300">
      <div className={`text-3xl font-bold ${color}`}>
        {prefix}
        <CountUp end={value} duration={2} />
        {suffix}
      </div>
      <p className="text-slate-400 mt-2">{label}</p>
    </div>
  );
}