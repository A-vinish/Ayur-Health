import mongoose from 'mongoose'

const Schema = mongoose.Schema

const DietItemSchema = new Schema({
  recipeId: String,
  name: String,
  ingredients: [{ name: String, qty: String }],
  nutrition: { calories: Number, protein: Number, carbs: Number, fat: Number },
  ayurvedicProperties: Object,
  notes: String
}, { _id: false })

const DietChartSchema = new Schema({
  date: { type: String },
  meals: [{ mealType: String, items: [DietItemSchema] }],
  doctorNotes: String
}, { _id: false })

const PatientSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  doctorId: { type: mongoose.Types.ObjectId, ref: 'Doctor' },
  dietaryHabits: Object,
  bowelMovement: String,
  waterIntake: String,
  mealFrequency: String,
  healthConditions: [String],
  prakriti: String,
  restrictions: [String],
  latestDietChart: DietChartSchema
}, { timestamps: true })

export default mongoose.model('Patient', PatientSchema)
