import {Router} from 'express';




const router = Router();


router.get('/buscar', (req, res) => {
    const searchTerm = req.query.q;
    const query = `SELECT * FROM tbl_productos WHERE nombre_producto LIKE '%${searchTerm}%'`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al buscar productos:', err);
            res.status(500).json({ error: 'Error al buscar productos' });
            return;
        }
        res.json(results);
    });
});

export default router;