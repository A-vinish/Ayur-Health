import mongoose from 'mongoose'
const Schema = mongoose.Schema

const IngredientSchema = new Schema({
  name: String,
  quantity: Number,
  unit: String
}, { _id: false })

const RecipeSchema = new Schema({
  name: { type: String, required: true },
  ingredients: [IngredientSchema],
  nutritionSummary: { calories: Number, protein: Number, carbs: Number, fat: Number },
  ayurvedicSummary: Object
}, { timestamps: true })

export default mongoose.model('Recipe', RecipeSchema)
