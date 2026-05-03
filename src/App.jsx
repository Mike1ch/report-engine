import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'
import { processData } from './utils/dataProcessor'

function App() {
  const [metrics, setMetrics] = useState(null)
  const [fileName, setFileName] = useState('')

  function handleDataLoaded(rows) {
    setFileName(rows.length + ' rows loaded')
    const result = processData(rows)
    setMetrics(result)
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>
          Report Automation Engine
        </h1>
        <p style={{ color: '#666' }}>
          Upload a CSV file to generate your dashboard instantly.
        </p>
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
