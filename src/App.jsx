import { useState } from 'react'
import FileUpload from './components/FileUpload'
import { processData } from './utils/dataProcessor'

function App() {
  const [csvData, setCsvData] = useState([])
  const [metrics, setMetrics] = useState(null)

  function handleDataLoaded(rows) {
    setCsvData(rows)
    const result = processData(rows)
    setMetrics(result)
  }

  function formatCurrency(num) {
    return 'N' + num.toLocaleString('en-NG', { maximumFractionDigits: 0 })
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
        Report Automation Engine
      </h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Upload a CSV file to get started.
      </p>

      <FileUpload onDataLoaded={handleDataLoaded} />

      {metrics && (
        <div style={{ marginTop: '40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <MetricCard label="Total Revenue" value={formatCurrency(metrics.totalRevenue)} />
            <MetricCard label="Total Orders" value={metrics.totalOrders} />
            <MetricCard label="Avg Order Value" value={formatCurrency(metrics.avgOrderValue)} />
            <MetricCard label="Top Region" value={metrics.topRegion} />
          </div>

          <Section title="Revenue by Region">
            {metrics.regionChartData.map((item) => (
              <BarRow
                key={item.name}
                label={item.name}
                value={formatCurrency(item.value)}
                percent={item.value / metrics.totalRevenue}
              />
            ))}
          </Section>

          <Section title="Revenue by Product">
            {metrics.categoryChartData.map((item) => (
              <BarRow
                key={item.name}
                label={item.name}
                value={formatCurrency(item.value)}
                percent={item.value / metrics.totalRevenue}
              />
            ))}
          </Section>

          <Section title="Orders by Status">
            {metrics.statusChartData.map((item) => (
              <BarRow
                key={item.name}
                label={item.name}
                value={item.value + ' orders'}
                percent={item.value / metrics.totalOrders}
              />
            ))}
          </Section>
        </div>
      )}
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

function Section({ title, children }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '16px'
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
  )
}

function BarRow({ label, value, percent }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', color: '#333' }}>{label}</span>
        <span style={{ fontSize: '13px', color: '#666' }}>{value}</span>
      </div>
      <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '6px' }}>
        <div style={{
          background: '#1D9E75',
          width: (Math.round(percent * 100)) + '%',
          height: '6px',
          borderRadius: '4px',
          transition: 'width 0.4s ease'
        }} />
      </div>
    </div>
  )
}

export default App
