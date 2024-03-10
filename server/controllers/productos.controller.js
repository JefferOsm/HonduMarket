import {pool} from '../db.js'


//Obtener Categorias
export const obtenerCategorias= async(req,res)=>{
    const [rows] = await pool.query('SELECT *FROM tbl_categorias')
    res.send(rows)
    console.log(rows)
}

//Agregar Producto
export const agregarProducto = async(req,res)=>{
    const {nombre,descripcion,precio,estado,categoria,departamento} = req.body

    try {
        const [rows] = await pool.query(
            'INSERT INTO tbl_productos(nombre_producto,descripcion_producto,precio_producto,estado_id,categoria_id,usuario_id,departamento_id) VALUES (?,?,?,?,?,?,?) ',
            [nombre,descripcion,precio,estado,categoria,req.user,departamento]);

        console.log(rows)

        res.json({
            message: 'Producto Publicado'
        })     

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error",
          });
    }
}

//Obtener Publicaciones del Usuario
export const obtenerPublicacionesUsuario = async(req,res)=>{
    try {
        
        const [rows]= await pool.query('CALL sp_productosUsuario(?)', [req.user]);


        res.send(rows[0])

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error",
          });
    }
}