import type { Bin } from "../types";

interface Props {
  route: Bin[];
}

export default function RoutePanel({ route }: Props) {
  return (
    <div>
      <h2 className="text-xl mb-4">Optimized Route</h2>

      {route.length === 0 ? (
        <p className="text-gray-400">No bins require collection</p>
      ) : (
        route.map((bin, index) => (
          <p key={bin.bin_id} className="text-cyan-400">
            {index + 1}. Bin {bin.bin_id}
          </p>
        ))
      )}
    </div>
  );
}