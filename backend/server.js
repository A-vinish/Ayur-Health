import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

// routes
import patientsRouter from './routes/patients.js'
import doctorsRouter from './routes/doctors.js'
import recipesRouter from './routes/recipes.js'
import dietRouter from './routes/diet.js'
import pharmacyRouter from './routes/pharmacy.js'
import consultRouter from './routes/consultations.js'
import hospitalRouter from './routes/hospitals.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())

// Database
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ayurhealth'
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1) })

// API routes
app.use('/api/patients', patientsRouter)
app.use('/api/doctors', doctorsRouter)
app.use('/api/recipes', recipesRouter)
app.use('/api/diet', dietRouter)
app.use('/api/pharmacy', pharmacyRouter)
app.use('/api/consultations', consultRouter)
app.use('/api/hospital', hospitalRouter)

// quick health check
app.get('/api/health', (req,res)=> res.json({ ok:true, time: new Date().toISOString() }))

// Start
const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> console.log(`Backend (Mongo) running on http://localhost:${PORT}`))
