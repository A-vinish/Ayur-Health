import express from 'express'
import Pharmacy from '../models pharmacy.js'
const router = express.Router()

function jaccard(a, b){
  const A = new Set(a.toLowerCase().split(/\W+/).filter(Boolean))
  const B = new Set(b.toLowerCase().split(/\W+/).filter(Boolean))
  const inter = [...A].filter(x=>B.has(x)).length
  const uni = new Set([...A, ...B]).size
  return uni ? inter/uni : 0
}

router.get('/search', async (req,res)=>{
  const q = req.query.q || ''
  const items = await Pharmacy.find().lean()
  const results = items.map(p=> ({
    ...p,
    score: 0.7*jaccard(q, p.tags.join(' ')) + 0.3*jaccard(q, p.name + ' ' + p.address)
  })).sort((a,b)=> b.score - a.score).slice(0, 20)
  res.json(results)
})

export default router
