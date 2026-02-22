import { PieChart, Pie, Cell } from "recharts";

export default function RiskGauge({ score }) {

  const percentage = Math.min(score * 100, 100);

  const data = [
    { value: percentage },
    { value: 100 - percentage },
  ];


  const getColor = () => {
    if (percentage >= 95) return "#991b1b";   // Critical
    if (percentage > 80) return "#ef4444";   // High
    if (percentage > 60) return "#facc15";   // Medium
    return "#22c55e";                        // Low
  };


  return (
    <div className="relative flex justify-center items-center">

      {/* Chart */}
      <PieChart width={280} height={200}>

        {/* Background */}
        <Pie
          data={[{ value: 100 }]}
          startAngle={180}
          endAngle={0}
          innerRadius={78}
          outerRadius={96}
          dataKey="value"
          fill="#1f2937"
          stroke="none"
        />


        {/* Active Arc */}
        <Pie
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius={78}
          outerRadius={96}
          dataKey="value"
          stroke="gray"
        >

          <Cell fill={getColor()} />
          <Cell fill="transparent" />

        </Pie>

      </PieChart>


      {/* Center Overlay */}
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">

        <div className="text-3xl font-bold text-white">
          {percentage.toFixed(1)}%
        </div>

        <div className="text-xs text-gray-400 tracking-wide mt-1">
          Fraud Risk
        </div>

      </div>

    </div>
  );
}