// Very small nutrient DB (kcal, protein g, carbs g, fat g) per 100g or 100ml
export const FOOD_NUTRIENTS = {
  'Rice':      { calories: 130, protein: 2.4, carbs: 28, fat: 0.3 },
  'Moong Dal': { calories: 116, protein: 8.0, carbs: 20, fat: 0.4 },
  'Ghee':      { calories: 900, protein: 0, carbs: 0, fat: 100 },
  'Cumin':     { calories: 375, protein: 18, carbs: 44, fat: 22 },
  'Curd':      { calories: 98, protein: 11, carbs: 3.4, fat: 5 },
  'Water':     { calories: 0, protein: 0, carbs: 0, fat: 0 },
}

// Minimal ayurvedic mapping (extend)
export const AYURVEDA_MAP = {
  'Rice': { rasa:['Sweet'], virya:'Cooling', guna:['Light'], vipaka:'Sweet', dosha:'Balances Vata/Pitta; ↑Kapha' },
  'Moong Dal': { rasa:['Sweet','Astringent'], virya:'Cooling', guna:['Light'], vipaka:'Sweet', dosha:'Balances Vata & Pitta' },
  'Ghee': { rasa:['Sweet'], virya:'Cooling', guna:['Heavy','Oily'], vipaka:'Sweet', dosha:'Balances Vata & Pitta; ↑Kapha' },
  'Cumin': { rasa:['Pungent'], virya:'Heating', guna:['Light'], vipaka:'Pungent', dosha:'Balances Kapha' },
  'Curd': { rasa:['Sour'], virya:'Cooling', guna:['Heavy'], vipaka:'Sour', dosha:'↑Kapha; ↑Pitta' },
  'Water': { rasa:['Neutral'], virya:'Cooling', guna:['Light'], vipaka:'—', dosha:'Balancing' },
}

export function sumNutrition(ingredients){
  const total = { calories:0, protein:0, carbs:0, fat:0 }
  for(const ing of ingredients){
    const base = FOOD_NUTRIENTS[ing.name] || {calories:0, protein:0, carbs:0, fat:0}
    const factor = (ing.quantity || 0) / 100
    total.calories += (base.calories || 0) * factor
    total.protein  += (base.protein || 0) * factor
    total.carbs    += (base.carbs || 0) * factor
    total.fat      += (base.fat || 0) * factor
  }
  // Round
  for(const k of Object.keys(total)) total[k] = Math.round(total[k]||0)
  return total
}

export function aggregateAyurveda(ingredients){
  const props = { rasa: {}, virya: {}, guna: {}, vipaka: {}, dosha: {} }
  const inc = (obj, key)=> { if(!key) return; obj[key] = (obj[key]||0)+1 }
  for(const ing of ingredients){
    const A = AYURVEDA_MAP[ing.name]
    if(!A) continue
    (A.rasa||[]).forEach(r=>inc(props.rasa, r))
    inc(props.virya, A.virya)
    (A.guna||[]).forEach(g=>inc(props.guna, g))
    inc(props.vipaka, A.vipaka)
    inc(props.dosha, A.dosha)
  }
  const top = (m)=> Object.entries(m).sort((a,b)=>b[1]-a[1]).map(x=>x[0])
  return {
    rasa: top(props.rasa),
    virya: top(props.virya)[0] || '—',
    guna: top(props.guna),
    vipaka: top(props.vipaka)[0] || '—',
    doshaEffect: top(props.dosha)[0] || '—'
  }
}
