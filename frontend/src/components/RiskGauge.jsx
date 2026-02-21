import { PieChart, Pie, Cell } from "recharts";

export default function RiskGauge({ score }) {
  const percentage = score * 100;

  const data = [
    { value: percentage },
    { value: 100 - percentage },
  ];

  const getColor = () => {
    if (percentage >= 95) return "#991b1b";   // deep red for CRITICAL
if (percentage > 80) return "#ef4444";
if (percentage > 60) return "#facc15";
return "#22c55e";                      // green
  };

  return (
    <div className="flex flex-col items-center">
      <PieChart width={250} height={160}>
        <Pie
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius={70}
          outerRadius={90}
          dataKey="value"
        >
          <Cell fill={getColor()} />
          <Cell fill="#1f2937" />
        </Pie>
      </PieChart>

      <div className="text-center -mt-14">
        <div className="text-2xl font-bold text-white">
          {(score * 100).toFixed(1)}%
        </div>
        <div className="text-sm text-gray-400">
          Fraud Risk
        </div>
      </div>
    </div>
  );
}