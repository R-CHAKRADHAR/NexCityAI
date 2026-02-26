import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

export default function LiveChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name">
          <Label value="Time" position="insideBottom" offset={-5} />
        </XAxis>

        <YAxis domain={[0, 120]}>
          <Label
            value="Waste Level (%)"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>

        <Tooltip />

        <Line
          type="monotone"
          dataKey="value"
          stroke="#00ffff"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}