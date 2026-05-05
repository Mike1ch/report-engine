import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts'

const COLORS = ['#1D9E75', '#3266ad', '#BA7517', '#993C1D', '#6B5EA8', '#2A9D8F']

function formatN(num) {
  if (num >= 1000000) return 'N' + (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return 'N' + (num / 1000).toFixed(0) + 'K'
  return 'N' + num
}

function getDateChartData(rows) {
  const dateKey = Object.keys(rows[0]).find(k =>
    ['date', 'day', 'month', 'time', 'created'].includes(k.toLowerCase())
  )
  const amountKey = Object.keys(rows[0]).find(k =>
    ['amount', 'revenue', 'sales', 'total', 'price'].includes(k.toLowerCase())
  )
  if (!dateKey || !amountKey) return null

  const grouped = {}
  rows.forEach(row => {
    const date = row[dateKey]
    const val = parseFloat(row[amountKey]) || 0
    grouped[date] = (grouped[date] || 0) + val
  })

  return Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .slice(0, 20)
}

function Dashboard({ metrics }) {
  if (!metrics) return null

  const dateData = getDateChartData(metrics.rawRows)

  const metricCards = [
    { label: 'Total Revenue', value: formatN(metrics.totalRevenue), sub: 'All orders combined', color: '#1D9E75' },
    { label: 'Total Orders', value: metrics.totalOrders, sub: 'Across all regions', color: '#3266ad' },
    { label: 'Avg Order Value', value: formatN(metrics.avgOrderValue), sub: 'Per transaction', color: '#BA7517' },
    { label: 'Top Region', value: metrics.topRegion, sub: 'Highest revenue', color: '#6B5EA8' },
  ]

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px', marginBottom: '16px'
      }}>
        {metricCards.map((card, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '12px', padding: '16px',
            border: '1px solid #e5e9f0', borderTop: '3px solid ' + card.color,
          }}>
            <p style={{ fontSize: '11px', color: '#8a94a6', marginBottom: '6px', fontWeight: '500' }}>{card.label}</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#0f1923', marginBottom: '2px' }}>{card.value}</p>
            <p style={{ fontSize: '10px', color: '#b0bac9' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {dateData && (
        <ChartCard title="Revenue Over Time" sub="Daily revenue trend">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dateData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8a94a6' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatN} tick={{ fontSize: 10, fill: '#8a94a6' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip formatter={(val) => formatN(val)} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e9f0', fontSize: '12px' }} />
              <Line type="monotone" dataKey="value" stroke="#1D9E75" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '12px 0' }}>
        <ChartCard title="By Region" sub="Revenue breakdown">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics.regionChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8a94a6' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatN} tick={{ fontSize: 10, fill: '#8a94a6' }} axisLine={false} tickLine={false} width={45} />
              <Tooltip formatter={(val) => formatN(val)} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e9f0', fontSize: '12px' }} />
              <Bar dataKey="value" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="By Product" sub="Revenue share">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={metrics.categoryChartData}
                dataKey="value" nameKey="name"
                cx="50%" cy="50%"
                outerRadius={70} innerRadius={35}
                label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'}
                labelLine={false}
              >
                {metrics.categoryChartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatN(val)} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e9f0', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Orders by Status" sub="Count per status">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={metrics.statusChartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: '#8a94a6' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#8a94a6' }} axisLine={false} tickLine={false} width={70} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e9f0', fontSize: '12px' }} />
            <Bar dataKey="value" fill="#3266ad" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, sub, children }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e9f0', marginBottom: '0' }}>
      <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f1923', marginBottom: '2px' }}>{title}</p>
      <p style={{ fontSize: '11px', color: '#8a94a6', marginBottom: '14px' }}>{sub}</p>
      {children}
    </div>
  )
}

export default Dashboard