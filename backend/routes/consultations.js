import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ConsultationSchema = new Schema({
  patientId: { type: mongoose.Types.ObjectId, ref: 'Patient' },
  doctorId: { type: mongoose.Types.ObjectId, ref: 'Doctor' },
  notes: String,
  date: { type: String } // YYYY-MM-DD
}, { timestamps: true })

export default mongoose.model('Consultation', ConsultationSchema)
