import mongoose from 'mongoose'
const Schema = mongoose.Schema

const HospitalSchema = new Schema({
  name: String,
  address: String,
  doctorIds: [{ type: mongoose.Types.ObjectId, ref: 'Doctor' }]
}, { timestamps: true })

export default mongoose.model('Hospital', HospitalSchema)
