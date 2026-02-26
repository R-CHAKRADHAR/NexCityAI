export interface Bin {
  bin_id: number;
  level: number;
  location: [number, number];
}

export interface Sustainability {
  fuel_saved_liters: number;
  co2_saved_kg: number;
  cost_saved_rs: number;
}

export interface Alert {
  bin_id: number;
  type: "critical" | "warning" | "anomaly";
  message: string;
}

export interface SystemData {
  bins: Bin[];
  predictions: Record<number, number>;
  anomalies: Record<number, boolean>;
  optimized_route: Bin[];
  route_distance: number;
  depot: [number, number];
  alerts: Alert[];

  sustainability: Sustainability;
}