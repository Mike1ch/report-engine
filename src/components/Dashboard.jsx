import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#1D9E75', '#3266ad', '#BA7517', '#993C1D', '#6B5EA8', '#2A9D8F']

function formatN(num) {
  if (num >= 1000000) return 'N' + (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return 'N' + (num / 1000).toFixed(0) + 'K'
  return 'N' + num
}

function Dashboard({ metrics }) {
  if (!metrics) return null

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
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {metricCards.map((card, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e9f0',
            borderTop: '3px solid ' + card.color,
          }}>
            <p style={{ fontSize: '12px', color: '#8a94a6', marginBottom: '8px', fontWeight: '500' }}>
              {card.label}
            </p>
            <p style={{ fontSize: '26px', fontWeight: '700', color: '#0f1923', marginBottom: '4px' }}>
              {card.value}
            </p>
            <p style={{ fontSize: '11px', color: '#b0bac9' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Revenue by Region" sub="Sorted by highest revenue">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics.regionChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8a94a6' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatN} tick={{ fontSize: 11, fill: '#8a94a6' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip
                formatter={(val) => formatN(val)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e9f0', fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#1D9E75" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Product" sub="Share of total revenue">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.categoryChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'}
                labelLine={false}
              >
                {metrics.categoryChartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => formatN(val)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e9f0', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Orders by Status" sub="Count of orders per status">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={metrics.statusChartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: '#8a94a6' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#8a94a6' }} axisLine={false} tickLine={false} width={80} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e9f0', fontSize: '12px' }}
            />
            <Bar dataKey="value" fill="#3266ad" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, sub, children }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e9f0',
    }}>
      <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f1923', marginBottom: '2px' }}>{title}</p>
      <p style={{ fontSize: '12px', color: '#8a94a6', marginBottom: '16px' }}>{sub}</p>
      {children}
    </div>
  )
}

export default Dashboard
