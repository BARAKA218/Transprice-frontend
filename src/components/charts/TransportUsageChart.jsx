import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#0f2645', '#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{payload[0].name}</p>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">{payload[0].value}% usage</p>
    </div>
  )
}

const renderLabel = ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`

export default function TransportUsageChart({ data = [], title = 'Transport Usage', height = 300 }) {
  return (
    <div>
      {title && (
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={renderLabel}
            labelLine={{ stroke: '#9ca3af' }}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color || COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
