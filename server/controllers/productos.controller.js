import {pool} from '../db.js';
import cloudinary from 'cloudinary';


//Obtener Categorias
export const obtenerCategorias= async(req,res)=>{
    try {
        const [rows] = await pool.query('CALL sp_categorias')
        res.send(rows[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Ha Ocurrido un Error",
          });
    }
}

export const obtenerDepartamentos = async(req,res)=>{
    try {
        const [rows] = await pool.query('CALL sp_departamentos')    
        res.send(rows[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Ha Ocurrido un Error",
          });
    }
}

export const obtenerEstados = async(req,res)=>{
    try {
        const [rows]= await pool.query('CALL sp_estados');
        res.send(rows[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Ha Ocurrido un Error",
          });
    }
}

//Agregar Producto
export const agregarProducto = async(req,res)=>{
    const {nombre,descripcion,precio,estado,categoria,departamento} = req.body
    const imagenes= req.files;

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se subieron imágenes' });
          }

        const [rows] = await pool.query(
            'INSERT INTO tbl_productos(nombre_producto,descripcion_producto,precio_producto,estado_id,categoria_id,usuario_id,departamento_id) VALUES (?,?,?,?,?,?,?) ',
            [nombre,descripcion,precio,estado,categoria,req.user,departamento]);

        const productoId= rows.insertId;
        let imageUrl;
        let id_imagen;

        imagenes.map(async (imagen) =>{
            const result = await cloudinary.uploader.upload(imagen.path);
            imageUrl = result.secure_url;
            id_imagen= result.original_filename;
            //console.log("Cloudinary Result:", result);

            const [rImg] = await pool.query(
                'INSERT INTO tbl_imagenesProductos(id_imagen,url_imagen,producto_id) VALUES (?,?,?)',
                [id_imagen, imageUrl, productoId]
            );

        })

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