import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ShapWaterfall({ baseValue, shapValues }) {

  // Take top 8 features for readability
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
    <div className="mt-8">
      <h3 className="text-accent font-semibold mb-4">
        SHAP Contribution Breakdown
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">

          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="feature"
            width={150}
          />

          <Tooltip />

          <Bar
            dataKey="value"
            isAnimationActive
          >
            {data.map((entry, index) => (
              <cell
                key={`cell-${index}`}
                fill={entry.value > 0 ? "#ef4444" : "#22c55e"}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}