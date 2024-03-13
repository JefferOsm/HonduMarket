import {pool} from '../db.js';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

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

        //variables para subir imagenes
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

        res.json(productoId);     

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error",
          });
    }
}

//Actualizar producto al subir video
export const agregarVideo = async(req,res)=>{
    let url_video
    let id_video
    try {
        console.log(req.file)
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path,{resource_type: "video", folder: "Videos_Publicaciones"});
            url_video = result.secure_url;
            id_video= result.original_filename;
            console.log("Cloudinary Result:", result);
          }


        const [rows]= await pool.query('CALL sp_subirVideoPublicacion(?,?,?)',[id_video,url_video,req.params.id])
        console.log(rows)

        res.json({message:'Video Subido'})
    } catch (error) {
        console.log(error)
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