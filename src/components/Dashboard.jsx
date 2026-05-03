import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#1D9E75', '#3266ad', '#BA7517', '#993C1D', '#6B5EA8', '#2A9D8F']

function formatN(num) {
  if (num >= 1000000) return 'N' + (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return 'N' + (num / 1000).toFixed(0) + 'K'
  return 'N' + num
}

function Dashboard({ metrics }) {
  if (!metrics) return null

  return (
    <div style={{ marginTop: '40px' }}>

      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
        Dashboard
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <MetricCard label="Total Revenue" value={formatN(metrics.totalRevenue)} />
        <MetricCard label="Total Orders" value={metrics.totalOrders} />
        <MetricCard label="Avg Order Value" value={formatN(metrics.avgOrderValue)} />
        <MetricCard label="Top Region" value={metrics.topRegion} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px'
      }}>

        <ChartCard title="Revenue by Region" subtitle="Sorted by highest revenue">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics.regionChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={formatN} tick={{ fontSize: 11 }} width={60} />
              <Tooltip formatter={(val) => formatN(val)} />
              <Bar dataKey="value" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Product" subtitle="Share of total revenue">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.categoryChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'}
                labelLine={false}
              >
                {metrics.categoryChartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatN(val)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      <ChartCard title="Orders by Status" subtitle="Count of orders per status">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={metrics.statusChartData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
            <Tooltip />
            <Bar dataKey="value" fill="#3266ad" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div style={{ marginTop: '16px' }}>
        <ChartCard title="Raw Data Preview" subtitle={'First 5 rows of ' + metrics.rawRows.length + ' total'}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {metrics.columns.map((col) => (
                    <th key={col} style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderBottom: '1px solid #e5e5e5',
                      color: '#999',
                      fontWeight: '500',
                      fontSize: '11px',
                      textTransform: 'uppercase'
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.rawRows.slice(0, 5).map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    {metrics.columns.map((col) => (
                      <td key={col} style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

    </div>
  )
}

function MetricCard({ label, value }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: '10px',
      padding: '20px',
    }}>
      <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '22px', fontWeight: '600', color: '#1a1a1a' }}>{value}</p>
    </div>
  )
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: '10px',
      padding: '20px',
    }}>
      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>{title}</p>
      <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>{subtitle}</p>
      {children}
    </div>
  )
}

export default Dashboard
