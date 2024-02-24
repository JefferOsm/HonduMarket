import {Router} from 'express';
import {pool} from '../db.js'
 
const router = Router()

router.get('/', async(req,res)=>{
    const [rows] = await pool.query('SELECT *FROM tbl_categorias')
    res.send(rows)
    console.log(rows)
})
export default router;