import type { Alert } from "../types";

interface Props {
  alerts: Alert[];
}

export default function Alerts({ alerts }: Props) {
  if (!alerts || alerts.length === 0) {
    return <p className="text-green-400">No active alerts</p>;
  }

  return (
    <div>
      <h2 className="text-xl mb-4 font-semibold">System Alerts</h2>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          let bgColor = "";
          let icon = "";

          if (alert.type === "critical") {
            bgColor = "bg-red-600";
            icon = "🚨";
          } else if (alert.type === "warning") {
            bgColor = "bg-amber-500";
            icon = "⚠️";
          } else if (alert.type === "anomaly") {
            bgColor = "bg-green-600";
            icon = "♻️";
          }

          return (
            <div
              key={index}
              className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg shadow-lg"
            >
              <div>
                {alert.type === "critical"
                  ? "🚨"
                  : alert.type === "warning"
                  ? "⚠️"
                  : "♻️"}
              </div>

              <div>
                <p className="font-semibold text-white">Bin {alert.bin_id}</p>
                <p className="text-sm text-gray-300">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}