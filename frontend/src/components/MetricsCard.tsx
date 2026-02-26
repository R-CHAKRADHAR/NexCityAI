import type { Sustainability } from "../types";

interface Props {
  metrics: Sustainability;
}

export default function MetricsCard({ metrics }: Props) {
  return (
    <div>
      <h2 className="text-xl mb-4">Sustainability Impact</h2>
      <div className="space-y-3">
        <p>Fuel Saved: <span className="text-cyan-400">{metrics.fuel_saved_liters} L</span></p>
        <p>CO₂ Reduced: <span className="text-green-400">{metrics.co2_saved_kg} kg</span></p>
        <p>Cost Saved: <span className="text-yellow-400">₹{metrics.cost_saved_rs}</span></p>
      </div>
    </div>
  );
}