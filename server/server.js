const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { generateReport } = require('./pdfGenerator')
const { generateInsights } = require('./insightsGenerator')
require('dotenv').config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'uploads/') },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname) }
})
const upload = multer({ storage: storage })

app.get('/', (req, res) => {
  res.json({ message: 'Report Engine backend is running!' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  })
})

app.post('/api/export-pdf', (req, res) => {
  const { metrics } = req.body
  if (!metrics) return res.status(400).json({ error: 'No metrics provided' })
  generateReport(metrics, res)
})

app.post('/api/insights', async (req, res) => {
  const { metrics } = req.body
  if (!metrics) return res.status(400).json({ error: 'No metrics provided' })
  console.log('Insights request received')
  console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY)
  try {
    const insights = await generateInsights(metrics)
    console.log('Insights generated:', insights)
    res.json({ insights })
  } catch (err) {
    console.error('Insights error full:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log('Backend server running on http://localhost:' + PORT)
})
