import express from 'express'
import Doctor from '../models/Doctor.js'
import Patient from '../models/Patient.js'
const router = express.Router()

router.get('/', async (req,res)=>{
  const docs = await Doctor.find().lean()
  res.json(docs)
})

// Create doctor (admin)
router.post('/', async (req,res)=>{
  const doc = new Doctor(req.body)
  await doc.save()
  res.json(doc)
})

// patients linked to doctor
router.get('/:id/patients', async (req,res)=>{
  const docId = req.params.id
  const patients = await Patient.find({ doctorId: docId }).lean()
  res.json(patients)
})

export default router
