import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'
import { processData } from './utils/dataProcessor'
import { exportPDF } from './utils/api'

function App() {
  const [metrics, setMetrics] = useState(null)
  const [fileName, setFileName] = useState('')
  const [exporting, setExporting] = useState(false)

  function handleDataLoaded(rows) {
    setFileName(rows.length + ' rows loaded')
    const result = processData(rows)
    setMetrics(result)
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

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>
            Report Automation Engine
          </h1>
          <p style={{ color: '#666' }}>
            Upload a CSV file to generate your dashboard instantly.
          </p>
        </div>
        {metrics && (
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              background: '#1D9E75',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: exporting ? 'not-allowed' : 'pointer',
              opacity: exporting ? 0.7 : 1,
            }}
          >
            {exporting ? 'Generating...' : 'Export PDF'}
          </button>
        )}
      </div>

      <FileUpload onDataLoaded={handleDataLoaded} />

      {fileName && (
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#1D9E75', fontWeight: '500' }}>
          Loaded {fileName}
        </p>
      )}

      <Dashboard metrics={metrics} />
    </div>
  )
}

export default App
