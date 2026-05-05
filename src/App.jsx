import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'
import InsightsPanel from './components/InsightsPanel'
import { processData } from './utils/dataProcessor'
import { exportPDF, getInsights } from './utils/api'

function App() {
  const [metrics, setMetrics] = useState(null)
  const [insights, setInsights] = useState([])
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [fileName, setFileName] = useState('')

  async function handleDataLoaded(rows) {
    setFileName(rows.length + ' rows')
    const result = processData(rows)
    setMetrics(result)
    setActiveTab('dashboard')
    setInsights([])
    setLoadingInsights(true)
    try {
      const data = await getInsights(result)
      setInsights(data.insights || [])
    } catch (err) {
      console.error('Insights failed:', err)
    }
    setLoadingInsights(false)
  }

  async function handleExport() {
    if (!metrics) return
    setExporting(true)
    try {
      await exportPDF(metrics)
    } catch (err) {
      alert('Export failed: ' + err.message)
    }
    setExporting(false)
  }

  const navItems = [
    { id: 'upload', label: 'Upload', icon: 'U' },
    { id: 'dashboard', label: 'Dashboard', icon: 'D' },
    { id: 'insights', label: 'AI Insights', icon: 'A' },
    { id: 'data', label: 'Raw Data', icon: 'R' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        width: '220px', background: '#0f1923',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e2d3d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', background: '#1D9E75',
              borderRadius: '8px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', color: 'white', fontWeight: '700'
            }}>R</div>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>Report Engine</span>
          </div>
        </div>

        {fileName && (
          <div style={{
            margin: '16px', padding: '10px 12px',
            background: '#1e2d3d', borderRadius: '8px', borderLeft: '3px solid #1D9E75',
          }}>
            <p style={{ fontSize: '10px', color: '#1D9E75', marginBottom: '2px', fontWeight: '600' }}>ACTIVE FILE</p>
            <p style={{ fontSize: '12px', color: '#a0aab4' }}>{fileName} loaded</p>
          </div>
        )}

        <nav style={{ padding: '8px 12px', flex: 1 }}>
          <p style={{
            fontSize: '10px', color: '#4a5568', fontWeight: '600',
            letterSpacing: '0.08em', padding: '8px 8px 4px', textTransform: 'uppercase'
          }}>Views</p>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '9px 10px',
              background: activeTab === item.id ? '#1e2d3d' : 'none',
              border: 'none', borderRadius: '6px',
              color: activeTab === item.id ? 'white' : '#6b7a8d',
              fontSize: '13px', fontWeight: activeTab === item.id ? '500' : '400',
              cursor: 'pointer', textAlign: 'left', marginBottom: '2px',
            }}>
              <span style={{
                width: '20px', height: '20px',
                background: activeTab === item.id ? '#1D9E75' : '#1e2d3d',
                borderRadius: '4px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '11px',
                color: activeTab === item.id ? 'white' : '#4a5568', flexShrink: 0,
              }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {metrics && (
          <div style={{ padding: '16px' }}>
            <button onClick={handleExport} disabled={exporting} style={{
              width: '100%', padding: '10px', background: '#1D9E75',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: '600',
              cursor: exporting ? 'not-allowed' : 'pointer',
              opacity: exporting ? 0.7 : 1,
            }}>
              {exporting ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          background: 'white', borderBottom: '1px solid #e5e9f0',
          padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#0f1923' }}>
              {activeTab === 'upload' && 'Upload Data'}
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'insights' && 'AI Insights'}
              {activeTab === 'data' && 'Raw Data'}
            </h1>
            <p style={{ fontSize: '12px', color: '#8a94a6', marginTop: '1px' }}>
              {metrics
                ? 'Analyzing ' + metrics.totalOrders + ' orders · Top region: ' + metrics.topRegion
                : 'Upload a CSV file to get started'}
            </p>
          </div>
          {metrics && (
            <span style={{
              fontSize: '12px', color: '#1D9E75', background: '#E1F5EE',
              padding: '4px 10px', borderRadius: '20px', fontWeight: '500'
            }}>{fileName} loaded</span>
          )}
        </div>

        <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {activeTab === 'upload' && (
            <div style={{ maxWidth: '600px' }}>
              <p style={{ fontSize: '14px', color: '#6b7a8d', marginBottom: '20px' }}>
                Upload a CSV file to instantly generate your analytics dashboard, AI insights, and PDF report.
              </p>
              <FileUpload onDataLoaded={handleDataLoaded} />
              {metrics && (
                <div style={{
                  marginTop: '16px', padding: '14px 16px',
                  background: '#E1F5EE', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  <span style={{ color: '#1D9E75', fontSize: '18px' }}>✓</span>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#0F6E56' }}>File processed successfully</p>
                    <p style={{ fontSize: '12px', color: '#1D9E75' }}>Click Dashboard in the sidebar to view your analytics</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (metrics ? <Dashboard metrics={metrics} /> : <EmptyState onUpload={() => setActiveTab('upload')} />)}
          {activeTab === 'insights' && (metrics ? <InsightsPanel insights={insights} loading={loadingInsights} /> : <EmptyState onUpload={() => setActiveTab('upload')} />)}
          {activeTab === 'data' && (metrics ? <DataTable metrics={metrics} /> : <EmptyState onUpload={() => setActiveTab('upload')} />)}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onUpload }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{
        width: '64px', height: '64px', background: '#E1F5EE',
        borderRadius: '16px', margin: '0 auto 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px'
      }}>📂</div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No data yet</h3>
      <p style={{ fontSize: '14px', color: '#8a94a6', marginBottom: '20px' }}>Upload a CSV file to see your analytics here</p>
      <button onClick={onUpload} style={{
        background: '#1D9E75', color: 'white', border: 'none',
        borderRadius: '8px', padding: '10px 20px',
        fontSize: '13px', fontWeight: '600', cursor: 'pointer'
      }}>Upload a file</button>
    </div>
  )
}

function DataTable({ metrics }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e9f0', overflow: 'hidden' }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #e5e9f0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Raw Data</h3>
        <span style={{ fontSize: '12px', background: '#f4f5f7', padding: '4px 10px', borderRadius: '20px', color: '#6b7a8d' }}>
          {metrics.rawRows.length} rows
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8f9fb' }}>
              {metrics.columns.map(col => (
                <th key={col} style={{
                  textAlign: 'left', padding: '10px 16px',
                  borderBottom: '1px solid #e5e9f0', color: '#6b7a8d',
                  fontWeight: '600', fontSize: '11px',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.rawRows.slice(0, 10).map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f2f5' }}>
                {metrics.columns.map(col => (
                  <td key={col} style={{ padding: '10px 16px', color: '#374151' }}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App