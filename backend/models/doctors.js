import mongoose from 'mongoose'
const Schema = mongoose.Schema

const DoctorSchema = new Schema({
  name: String,
  speciality: String,
  email: String,
  hospitalId: { type: mongoose.Types.ObjectId, ref: 'Hospital' }
}, { timestamps: true })

export default mongoose.model('Doctor', DoctorSchema)
