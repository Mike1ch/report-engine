const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Report Engine backend is running!' })
})

// Upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  })
})

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log('Backend server running on http://localhost:' + PORT)
})
