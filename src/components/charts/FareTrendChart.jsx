import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      <p className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function FareTrendChart({ data = [], title = 'Fare Trends', height = 300 }) {
  return (
    <div>
      {title && (
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-neutral-700" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="fares" name="Fares" stroke="#0f2645" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="avgFare" name="Avg Fare (RWF)" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
