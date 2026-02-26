import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import PredictiveMaintenance from "./pages/PredictiveMaintenance";
import TrafficIntelligence from "./pages/TrafficIntelligence";
import ResourceAI from "./pages/ResourceAI";
import CommandCenter from "./pages/CommandCenter";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    
    setDarkMode(savedTheme !== "light");
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home darkMode={darkMode} toggleTheme={toggleTheme} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard darkMode={darkMode} toggleTheme={toggleTheme} />}
        />
        <Route path="/maintenance" element={<PredictiveMaintenance />} />
        <Route path="/traffic" element={<TrafficIntelligence />} />
        <Route path="/energy" element={<ResourceAI />} />
        <Route path="/command-center" element={<CommandCenter darkMode={darkMode} toggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;