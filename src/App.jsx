import { useState } from 'react'
import LandingPage from './components/LandingPage'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'
import InsightsPanel from './components/InsightsPanel'
import { DashboardSkeleton } from './components/SkeletonLoader'
import { processData } from './utils/dataProcessor'
import { exportPDF, getInsights } from './utils/api'

function App() {
  const [showApp, setShowApp] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [insights, setInsights] = useState([])
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [loadingDashboard, setLoadingDashboard] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')
  const [fileName, setFileName] = useState('')

  async function handleDataLoaded(rows) {
    setFileName(rows.length + ' rows')
    setLoadingDashboard(true)
    setActiveTab('dashboard')
    setInsights([])
    setTimeout(async () => {
      const result = processData(rows)
      setMetrics(result)
      setLoadingDashboard(false)
      setLoadingInsights(true)
      try {
        const data = await getInsights(result)
        setInsights(data.insights || [])
      } catch (err) {
        console.error('Insights failed:', err)
      }
      setLoadingInsights(false)
    }, 500)
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

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />
  }

  const navItems = [
    { id: 'upload', label: 'Upload', icon: '↑' },
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'insights', label: 'Insights', icon: '✦' },
    { id: 'data', label: 'Data', icon: '☰' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <div style={{
        background: '#0f1923', padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setShowApp(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', padding: 0,
          }}>
            <div style={{
              width: '28px', height: '28px', background: '#1D9E75',
              borderRadius: '6px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px'
            }}>R</div>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>Report Engine</span>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {fileName && (
            <span style={{
              fontSize: '11px', color: '#1D9E75', background: '#1e2d3d',
              padding: '4px 8px', borderRadius: '20px'
            }}>{fileName}</span>
          )}
          {metrics && (
            <button onClick={handleExport} disabled={exporting} style={{
              background: '#1D9E75', color: 'white', border: 'none',
              borderRadius: '6px', padding: '7px 14px',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer'
            }}>
              {exporting ? '...' : 'Export PDF'}
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, background: '#f4f5f7', paddingBottom: '70px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px 16px' }}>

          {activeTab === 'upload' && (
            <div>
              <p style={{ fontSize: '14px', color: '#6b7a8d', marginBottom: '16px' }}>
                Upload a CSV or Excel file to generate your dashboard, AI insights, and PDF report.
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
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#0F6E56' }}>File processed!</p>
                    <p style={{ fontSize: '12px', color: '#1D9E75' }}>Tap Dashboard below to view analytics</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            loadingDashboard
              ? <DashboardSkeleton />
              : metrics
                ? <Dashboard metrics={metrics} />
                : <EmptyState onUpload={() => setActiveTab('upload')} />
          )}

          {activeTab === 'insights' && (
            metrics
              ? <InsightsPanel insights={insights} loading={loadingInsights} />
              : <EmptyState onUpload={() => setActiveTab('upload')} />
          )}

          {activeTab === 'data' && (
            metrics ? <DataTable metrics={metrics} /> : <EmptyState onUpload={() => setActiveTab('upload')} />
          )}

        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#0f1923', borderTop: '1px solid #1e2d3d',
        display: 'flex', zIndex: 100,
      }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            flex: 1, padding: '10px 4px', background: 'none', border: 'none',
            color: activeTab === item.id ? '#1D9E75' : '#4a5568',
            cursor: 'pointer', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: '3px',
          }}>
            <span style={{ fontSize: '16px', opacity: activeTab === item.id ? 1 : 0.5 }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: activeTab === item.id ? '600' : '400' }}>{item.label}</span>
            {activeTab === item.id && (
              <div style={{ width: '20px', height: '2px', background: '#1D9E75', borderRadius: '1px' }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function EmptyState({ onUpload }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{
        width: '64px', height: '64px', background: '#E1F5EE',
        borderRadius: '16px', margin: '0 auto 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px'
      }}>📂</div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No data yet</h3>
      <p style={{ fontSize: '14px', color: '#8a94a6', marginBottom: '20px' }}>Upload a CSV or Excel file to get started</p>
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
        padding: '14px 16px', borderBottom: '1px solid #e5e9f0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Raw Data</h3>
        <span style={{ fontSize: '12px', background: '#f4f5f7', padding: '4px 10px', borderRadius: '20px', color: '#6b7a8d' }}>
          {metrics.rawRows.length} rows
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f8f9fb' }}>
              {metrics.columns.map(col => (
                <th key={col} style={{
                  textAlign: 'left', padding: '10px 12px',
                  borderBottom: '1px solid #e5e9f0', color: '#6b7a8d',
                  fontWeight: '600', fontSize: '10px',
                  textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.rawRows.slice(0, 10).map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f2f5' }}>
                {metrics.columns.map(col => (
                  <td key={col} style={{ padding: '10px 12px', color: '#374151', whiteSpace: 'nowrap' }}>{row[col]}</td>
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
