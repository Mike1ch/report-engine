const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(BASE_URL + '/api/upload', {
    method: 'POST',
    body: formData,
  })
  return await response.json()
}

export async function checkHealth() {
  const response = await fetch(BASE_URL + '/api/health')
  return await response.json()
}

export async function exportPDF(metrics) {
  const response = await fetch(BASE_URL + '/api/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metrics }),
  })
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'report.pdf')
  document.body.appendChild(link)
  link.dispatchEvent(new MouseEvent('click'))
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export async function getInsights(metrics) {
  const response = await fetch(BASE_URL + '/api/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metrics }),
  })
  return await response.json()
}
