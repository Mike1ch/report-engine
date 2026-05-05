import { useState } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { uploadFile } from '../utils/api'

function FileUpload({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    if (!file) return
    setError('')
    setUploading(true)
    setFileName(file.name)

    const extension = file.name.split('.').pop().toLowerCase()

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function(results) {
          if (results.data.length === 0) {
            setError('File appears to be empty. Please check your CSV.')
            setUploading(false)
            return
          }
          onDataLoaded(results.data)
          try { await uploadFile(file) } catch (e) {}
          setUploading(false)
        },
        error: function() {
          setError('Failed to parse CSV. Please check the file format.')
          setUploading(false)
        }
      })
    } else if (extension === 'xlsx' || extension === 'xls') {
      try {
        const reader = new FileReader()
        reader.onload = function(e) {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const rows = XLSX.utils.sheet_to_json(worksheet)
          if (rows.length === 0) {
            setError('Excel file appears to be empty.')
            setUploading(false)
            return
          }
          onDataLoaded(rows)
          setUploading(false)
        }
        reader.readAsArrayBuffer(file)
      } catch (err) {
        setError('Failed to read Excel file.')
        setUploading(false)
      }
    } else {
      setError('Please upload a CSV or Excel (.xlsx) file only.')
      setFileName('')
      setUploading(false)
    }
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
    input.accept = '.csv,.xlsx,.xls'
    input.onchange = (event) => handleFile(event.target.files[0])
    input.click()
  }

  return (
    <div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: '2px dashed ' + (isDragging ? '#1D9E75' : error ? '#993C1D' : '#ccc'),
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? '#E1F5EE' : error ? '#fff5f5' : '#fff',
          transition: 'all 0.2s',
        }}
      >
        {uploading ? (
          <div>
            <div style={{
              width: '40px', height: '40px', border: '3px solid #e5e5e5',
              borderTop: '3px solid #1D9E75', borderRadius: '50%',
              margin: '0 auto 12px', animation: 'spin 1s linear infinite'
            }} />
            <p style={{ fontSize: '14px', color: '#666' }}>Processing file...</p>
          </div>
        ) : fileName && !error ? (
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
            <p style={{ fontSize: '15px', color: '#1D9E75', fontWeight: '600' }}>{fileName}</p>
            <p style={{ color: '#666', marginTop: '6px', fontSize: '13px' }}>Click to upload a different file</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>
              Drop your file here
            </p>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
              or click to browse
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <span style={{
                fontSize: '11px', background: '#f0fdf8', color: '#1D9E75',
                padding: '3px 8px', borderRadius: '4px', fontWeight: '500'
              }}>CSV</span>
              <span style={{
                fontSize: '11px', background: '#eff6ff', color: '#3266ad',
                padding: '3px 8px', borderRadius: '4px', fontWeight: '500'
              }}>XLSX</span>
              <span style={{
                fontSize: '11px', background: '#eff6ff', color: '#3266ad',
                padding: '3px 8px', borderRadius: '4px', fontWeight: '500'
              }}>XLS</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: '12px', padding: '12px 16px',
          background: '#fff5f5', borderRadius: '8px',
          borderLeft: '3px solid #993C1D',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <p style={{ fontSize: '13px', color: '#993C1D' }}>{error}</p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default FileUpload