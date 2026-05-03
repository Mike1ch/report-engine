import { useState } from 'react'
import Papa from 'papaparse'

function FileUpload({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')

  function handleFile(file) {
    if (!file) return

    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        onDataLoaded(results.data)
      },
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleClick() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = (e) => handleFile(e.target.files[0])
    input.click()
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        border: `2px dashed ${isDragging ? '#1D9E75' : '#ccc'}`,
        borderRadius: '12px',
        padding: '48px',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragging ? '#E1F5EE' : '#fff',
        transition: 'all 0.2s',
      }}
    >
      {fileName ? (
        <div>
          <p style={{ fontSize: '18px', color: '#1D9E75', fontWeight: '500' }}>
            ✓ {fileName}
          </p>
          <p style={{ color: '#666', marginTop: '8px' }}>
            Click to upload a different file
          </p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '18px', fontWeight: '500' }}>
            Drop your CSV file here
          </p>
          <p style={{ color: '#666', marginTop: '8px' }}>
            or click to browse
          </p>
        </div>
      )}
    </div>
  )
}

export default FileUpload