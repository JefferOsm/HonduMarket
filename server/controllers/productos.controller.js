import {pool} from '../db.js';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import helper from '../helpers/timeag.js'

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
        const resultados = await Promise.all(rows[0].map(async (producto) => {
            const [imagen] = await pool.query('SELECT url_imagen FROM tbl_imagenesProductos WHERE producto_id = ? LIMIT 1', [producto.id]);
            producto.imagen=imagen[0].url_imagen
        }));

        res.send(rows[0])

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error",
          });
    }
}

//Obtener Publicaciones para el Home
export const obtenerResultadosBusqueda = async (req, res) => {
    try {
      const searchTerm = req.query.searchTerm || '';
      const [rows] = await pool.query('CALL sp_todasPublicaciones(?)', [searchTerm]);
      res.send(rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Ha Ocurrido un Error',
      });
    }
  };
  

// Función para eliminar una imagen de un producto
export const eliminarImagenProducto = async (req, res) => {
    
    const { nombreImagen } = req.params;

    try {
        
        const [result] = await pool.query(
            'DELETE FROM tbl_imagenesProductos WHERE id_imagen = ?',
            [ nombreImagen]
        );

        // Verificar si se eliminó la imagen correctamente
        if (result.affectedRows === 1) {
            
            res.json({
                message: 'Imagen eliminada correctamente'
            });
        } else {
            // Si hubo error
            res.status(404).json({
                message: 'No se encontró la imagen para eliminar'
            });
        }
    } catch (error) {
        // pa cualquier error ocurrido durante el proceso
        console.error(error);
        res.status(500).json({
            message: 'Ha ocurrido un error al eliminar la imagen del producto'
        });
    }
};

export const obtenerDetallePublicacion = async(req,res)=>{
    try {
        const [rows] = await pool.query('CALL sp_detalleProductos(?)' , [req.params.id])
        //console.log(rows[0][0].usuario)
        const fecha= helper(rows[0][0].fecha_publicacion)
        rows[0][0].fecha=fecha

        res.send(rows[0][0])
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ha ocurrido un error al eliminar la imagen del producto'
        });
    }
}

export const obtenerImagenesPublicacion = async(req,res)=>{
    try {
        const [rows]= await pool.query('CALL sp_imagenesProductos(?)', [req.params.id])

        const[video]= await pool.query ('Select id_video, url_video FROM tbl_productos WHERE producto_id=?',[req.params.id])

        console.log(video[0])
        rows.imagenes=rows[0]
        rows.video=video[0]
        rows[0].push(video[0])

        res.send(rows[0])
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ha ocurrido un error'
        });
    }
}