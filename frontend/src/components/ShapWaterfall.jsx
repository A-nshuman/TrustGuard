import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";


/* ---------------- Custom Tooltip ---------------- */

function CustomTooltip({ active, payload, label }) {

  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="
      bg-gray-900 border border-accent/40
      rounded-lg px-3 py-2
      shadow-xl
      text-sm
      "
    >
      <p className="text-accent font-semibold mb-1">
        {label}
      </p>

      <p className="text-gray-300">
        Contribution:{" "}
        <span className="font-semibold">
          {payload[0].value.toFixed(4)}
        </span>
      </p>
    </div>
  );
}


/* ---------------- Main Component ---------------- */

export default function ShapWaterfall({ baseValue, shapValues }) {

  const topFeatures = shapValues.slice(0, 8);

  let cumulative = baseValue;

  const data = topFeatures.map(([feature, value]) => {
    const start = cumulative;
    cumulative += value;

    return {
      feature,
      value,
      start,
      end: cumulative,
    };
  });


  return (
    <div className="mt-10">

      <h3 className="text-accent font-semibold mb-4">
        SHAP Contribution Breakdown
      </h3>


      <ResponsiveContainer width="100%" height={300}>

        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 10, right: 30 }}
        >

          {/* X Axis (Hidden but Styled) */}
          <XAxis
            type="number"
            hide
            stroke="#65B156"
          />

          {/* Y Axis */}
          <YAxis
            type="category"
            dataKey="feature"
            width={160}
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />

          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "rgba(101, 177, 86, 0.08)"
            }}
          />


          {/* Bars */}
          <Bar
            dataKey="value"
            radius={[6, 6, 6, 6]}
            isAnimationActive
          >

            {data.map((entry, index) => (

              <Cell
                key={`cell-${index}`}
                fill={
                  entry.value > 0
                    ? "url(#redGradient)"
                    : "url(#greenGradient)"
                }
              />

            ))}

          </Bar>


          {/* Gradients */}
          <defs>

            <linearGradient
              id="redGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            <linearGradient
              id="greenGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#14532d" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>

          </defs>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}