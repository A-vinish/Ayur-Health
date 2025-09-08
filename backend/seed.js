import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import Doctor from './models/Doctor.js'
import Patient from './models/Patient.js'
import Recipe from './models/Recipe.js'
import Pharmacy from './models/Pharmacy.js'
import Hospital from './models/Hospital.js'
import { sumNutrition, aggregateAyurveda } from './lib/nutrition.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ayurhealth'
await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
console.log('Connected to MongoDB for seeding')

await Doctor.deleteMany({})
await Patient.deleteMany({})
await Recipe.deleteMany({})
await Pharmacy.deleteMany({})
await Hospital.deleteMany({})

const d1 = await Doctor.create({ name: 'Dr. Mehta', speciality: 'Ayurvedic Nutrition' })
const d2 = await Doctor.create({ name: 'Dr. Rao', speciality: 'General Physician' })

const p1 = await Patient.create({ name: 'Asha Verma', age: 32, prakriti: 'Pitta', doctorId: d1._id, healthConditions: ['General'], restrictions: [] })
const p2 = await Patient.create({ name: 'Ravi Kumar', age: 45, prakriti: 'Vata', doctorId: d2._id, healthConditions: ['Diabetes'], restrictions: ['Ghee'] })

const recipes = [
  {
    name: 'Moong Dal Khichdi',
    ingredients: [
      { name: 'Rice', quantity: 60, unit: 'g' },
      { name: 'Moong Dal', quantity: 40, unit: 'g' },
      { name: 'Ghee', quantity: 5, unit: 'g' },
      { name: 'Cumin', quantity: 2, unit: 'g' }
    ]
  },
  {
    name: 'Buttermilk',
    ingredients: [
      { name: 'Curd', quantity: 100, unit: 'g' },
      { name: 'Water', quantity: 200, unit: 'ml' },
      { name: 'Cumin', quantity: 2, unit: 'g' }
    ]
  }
]

for(const r of recipes){
  const nutritionSummary = sumNutrition(r.ingredients)
  const ayurvedicSummary = aggregateAyurveda(r.ingredients)
  await Recipe.create({ name: r.name, ingredients: r.ingredients, nutritionSummary, ayurvedicSummary })
}

await Pharmacy.create({ name: 'Herbal Life Pharmacy', address: 'Rohini, Delhi', tags: ['ayurvedic','herbal','diabetes','metformin','BP'] })
await Pharmacy.create({ name: 'MediCare Plus', address: 'Dwarka, Delhi', tags: ['general','blood pressure','amlodipine','cholesterol'] })
await Hospital.create({ name: 'City Hospital', address: 'Sector 5', doctorIds: [d1._id, d2._id] })

console.log('Seeding completed, closing connection')
await mongoose.disconnect()
process.exit(0)
