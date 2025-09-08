import express from 'express'
import Consultation from '../models/Consultation.js'
const router = express.Router()

router.get('/', async (req,res)=>{
  const list = await Consultation.find().sort({ createdAt: -1 }).lean()
  res.json(list)
})

router.post('/', async (req,res)=>{
  const { patientId, doctorId, notes } = req.body
  const item = new Consultation({ patientId, doctorId, notes, date: new Date().toISOString().slice(0,10) })
  await item.save()
  res.json(item)
})

export default router
