import express from 'express'
import Recipe from '../models/Recipe.js'
import { sumNutrition, aggregateAyurveda } from '../lib/nutrition.js'
const router = express.Router()

router.get('/', async (req,res)=>{
  const list = await Recipe.find().lean()
  res.json(list)
})

router.post('/', async (req,res)=>{
  const { name, ingredients = [] } = req.body
  const nutritionSummary = sumNutrition(ingredients)
  const ayurvedicSummary = aggregateAyurveda(ingredients)
  const r = new Recipe({ name, ingredients, nutritionSummary, ayurvedicSummary })
  await r.save()
  res.json(r)
})

export default router
