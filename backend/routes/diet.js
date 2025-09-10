import express from 'express'
import Recipe from '../models/Recipe.js'
import Patient from '../models/Patient.js'
const router = express.Router()

// Very simple rule-based generator demo
router.post('/generate', async (req,res)=>{
  const { patient } = req.body
  // Find all recipes
  const recipes = await Recipe.find().lean()
  // Filter by restrictions
  const restricted = new Set((patient.restrictions || []).map(x=>x.toLowerCase()))
  const suitable = recipes.filter(r=>{
    const ingNames = (r.ingredients || []).map(i=>i.name.toLowerCase())
    // exclude if any ingredient in restrictions
    for(const n of ingNames) if(restricted.has(n)) return false
    // apply simple dosha rules
    if(patient.prakriti === 'Pitta') return (r.ayurvedicSummary?.virya || '').toLowerCase().includes('cool')
    if(patient.prakriti === 'Vata') return (r.ayurvedicSummary?.guna || []).map(g=>g.toLowerCase()).includes('light')
    if(patient.prakriti === 'Kapha') return !( (r.ayurvedicSummary?.doshaEffect||'').includes('↑Kapha') )
    return true
  })

  if(suitable.length === 0) {
    // fallback to all
    suitable.push(...recipes)
  }

  const pick = (n)=> suitable[n % suitable.length] || suitable[0]
  const items = [
    { mealType: 'Breakfast', items: [ pick(0) ] },
    { mealType: 'Lunch', items: [ pick(1) ] },
    { mealType: 'Dinner', items: [ pick(0) ] },
    { mealType: 'Snack', items: [ pick(1) ] }
  ].map(m=> ({
    mealType: m.mealType,
    items: m.items.map(r=> ({
      recipeId: r._id,
      name: r.name,
      ingredients: r.ingredients.map(i=> ({ name: i.name, qty: (i.quantity||'') + (i.unit||'g') })),
      nutrition: r.nutritionSummary || {},
      ayurvedicProperties: r.ayurvedicSummary || {},
      notes: 'Auto-generated'
    }))
  }))

  const chart = {
    patientId: patient._id,
    date: new Date().toISOString().slice(0,10),
    meals: items,
    doctorNotes: 'Auto-generated — modify as needed'
  }

  // Optionally update patient's latest diet chart
  if(patient._id){
    await Patient.findByIdAndUpdate(patient._id, { latestDietChart: chart }, { new:true }).catch(()=>{})
  }

  res.json(chart)
})

export default router
