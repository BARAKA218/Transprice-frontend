import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      <p className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-xs" style={{ color: entry.fill || entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export default function DistrictActivityChart({ data = [], title = 'District Activity', height = 300 }) {
  return (
    <div>
      {title && (
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="district" tick={{ fontSize: 11, fill: '#9ca3af' }} angle={-30} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="routes" name="Routes" fill="#0f2645" radius={[4, 4, 0, 0]} />
          <Bar dataKey="fares" name="Fares" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
