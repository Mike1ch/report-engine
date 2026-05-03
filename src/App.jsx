import { useState } from 'react'
import FileUpload from './components/FileUpload'

function App() {
  const [csvData, setCsvData] = useState([])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
        Report Automation Engine
      </h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Upload a CSV file to get started.
      </p>

      <FileUpload onDataLoaded={setCsvData} />

      {csvData.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <p style={{ color: '#1D9E75', fontWeight: '500', marginBottom: '16px' }}>
            ✓ Loaded {csvData.length} rows
          </p>
          <pre style={{
            background: '#1a1a1a',
            color: '#f0f0f0',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            {JSON.stringify(csvData.slice(0, 3), null, 2)}
          </pre>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
            Showing first 3 rows of {csvData.length}
          </p>
        </div>
      )}
    </div>
  )
}

export default App