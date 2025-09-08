import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PharmacySchema = new Schema({
  name: String,
  address: String,
  tags: [String]
}, { timestamps: true })

export default mongoose.model('Pharmacy', PharmacySchema)
