const express = require('express')
const cors = require('cors')
const multer = require('multer')
const pdfGenerator = require('./pdfGenerator')
const insightsGenerator = require('./insightsGenerator')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:5173', 'https://report-engine-pied.vercel.app'],
  credentials: true
}))
app.use(express.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

app.get('/', function(req, res) {
  res.json({ message: 'Report Engine backend is running!' })
})

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/upload', upload.single('file'), function(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  })
})

app.post('/api/export-pdf', function(req, res) {
  const metrics = req.body.metrics
  if (!metrics) return res.status(400).json({ error: 'No metrics provided' })
  pdfGenerator.generateReport(metrics, res)
})

app.post('/api/insights', async function(req, res) {
  const metrics = req.body.metrics
  if (!metrics) return res.status(400).json({ error: 'No metrics provided' })
  try {
    const insights = await insightsGenerator.generateInsights(metrics)
    res.json({ insights })
  } catch (err) {
    console.error('Insights error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, function() {
  console.log('Backend server running on http://localhost:' + PORT)
})
