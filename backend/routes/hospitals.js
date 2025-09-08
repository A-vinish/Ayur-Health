import express from 'express'
import Hospital from '../models/Hospital.js'
import Doctor from '../models/Doctor.js'
import Patient from '../models/Patient.js'
const router = express.Router()

router.get('/overview', async (req,res)=>{
  const hospitals = await Hospital.find().lean()
  const doctors = await Doctor.find().lean()
  const patients = await Patient.find().lean()

  const hospitalSummaries = await Promise.all(hospitals.map(async h=>{
    const docIds = (h.doctorIds || [])
    const docs = doctors.filter(d => docIds.find(id => id.toString() === (d._id||d._id).toString()))
    const pats = patients.filter(p=> docIds.find(id => id.toString() === (p.doctorId||'').toString()))
    return { name: h.name, doctorsCount: docs.length, patientsCount: pats.length }
  }))

  res.json({ hospitals: hospitals.length, doctors: doctors.length, patients: patients.length, hospitalSummaries })
})

export default router
