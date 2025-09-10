import express from 'express'
import Patient from '../models/Patient.js'
const router = express.Router()

// GET all
router.get('/', async (req,res)=>{
  const patients = await Patient.find().lean().limit(500)
  res.json(patients)
})

// POST create
router.post('/', async (req,res)=>{
  const payload = req.body
  const p = new Patient(payload)
  await p.save()
  res.json(p)
})

// GET by id
router.get('/:id', async (req,res)=>{
  const p = await Patient.findById(req.params.id).lean()
  res.json(p || {})
})

// update (partial)
router.patch('/:id', async (req,res)=>{
  const p = await Patient.findByIdAndUpdate(req.params.id, req.body, { new:true })
  res.json(p)
})

export default router
