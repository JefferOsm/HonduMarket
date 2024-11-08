import { pool } from '../db.js';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import helper from '../helpers/timeag.js'


//Obtener Categorias
export const obtenerCategorias = async (req, res) => {
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

export const obtenerDepartamentos = async (req, res) => {
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

export const obtenerEstados = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_estados');
    res.send(rows[0])
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}

//Agregar Producto
export const agregarProducto = async (req, res) => {
  const { nombre, descripcion, precio, estado, categoria, departamento, fechaSubida } = req.body
  const imagenes = req.files;
  const fechaProgramada = new Date(fechaSubida)
  let productoId

  try {

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se subieron imágenes' });
    }
    if (fechaSubida) {
      console.log(fechaSubida)
      const [rows] = await pool.query(
        'INSERT INTO tbl_productos(nombre_producto,descripcion_producto,precio_producto,estado_id,categoria_id,usuario_id,departamento_id,fecha_programada) VALUES (?,?,?,?,?,?,?,?) ',
        [nombre, descripcion, precio, estado, categoria, req.user, departamento, fechaProgramada]);

      productoId = rows.insertId;
      await pool.query('UPDATE tbl_productos SET fecha_publicacion=? WHERE producto_id=?', [fechaProgramada, productoId])
    } else {
      const [rows] = await pool.query(
        'INSERT INTO tbl_productos(nombre_producto,descripcion_producto,precio_producto,estado_id,categoria_id,usuario_id,departamento_id) VALUES (?,?,?,?,?,?,?) ',
        [nombre, descripcion, precio, estado, categoria, req.user, departamento]);
      productoId = rows.insertId;
    }


    //variables para subir imagenes

    let imageUrl;
    let id_imagen;

    imagenes.map(async (imagen) => {
      const result = await cloudinary.uploader.upload(imagen.path);
      imageUrl = result.secure_url;
      id_imagen = result.original_filename;
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
export const agregarVideo = async (req, res) => {
  let url_video
  let id_video
  try {
    console.log(req.file)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "video", folder: "Videos_Publicaciones" });
      url_video = result.secure_url;
      id_video = result.original_filename;
      console.log("Cloudinary Result:", result);
    }


    const [rows] = await pool.query('CALL sp_subirVideoPublicacion(?,?,?)', [id_video, url_video, req.params.id])
    console.log(rows)

    res.json({ message: 'Video Subido' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}

//Obtener Publicaciones del Usuario
export const obtenerPublicacionesUsuario = async (req, res) => {
  try {

    const [rows] = await pool.query('CALL sp_productosUsuario(?)', [req.user]);
    console.log(req.user)
    //console.log(rows[0])
    const resultados = await Promise.all(rows[0].map(async (producto) => {
      const [imagen] = await pool.query('SELECT url_imagen FROM tbl_imagenesProductos WHERE producto_id = ? LIMIT 1', [producto.id]);
      if (imagen[0]) {
        //console.log(imagen[0])
        producto.imagen = imagen[0].url_imagen
      }
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
export const obtenerPublicacionesHome = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_todasPublicaciones');
    const resultados = await Promise.all(rows[0].map(async (producto) => {
      const [imagen] = await pool.query('SELECT url_imagen FROM tbl_imagenesProductos WHERE producto_id = ? LIMIT 1', [producto.id]);
      console.log(imagen[0].url_imagen)
      producto.imagen = imagen[0].url_imagen
    }));
    res.send(rows[0])
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}

//Obtener Publicaciones para el Home del usuario logeado
export const obtenerPublicacionesHomeAuth = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_todasPublicacionesAuth(?)', [req.user]);
    const resultados = await Promise.all(rows[0].map(async (producto) => {
      const [imagen] = await pool.query('SELECT url_imagen FROM tbl_imagenesProductos WHERE producto_id = ? LIMIT 1', [producto.id]);
      producto.imagen = imagen[0].url_imagen
    }));
    res.send(rows[0])
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}

//Obtener Publicaciones para sugerir en la busqueda
export const obtenerPublicacionesBusqueda = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_nombrePublicaciones');
    res.send(rows[0])
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}


//Obtener Publicaciones segun la busqueda
export const obtenerResultadosBusqueda = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const [rows] = await pool.query('CALL sp_todasPublicacionesSearch(?)', [searchTerm]);
    const resultados = await Promise.all(rows[0].map(async (producto) => {
      const [imagen] = await pool.query('SELECT url_imagen FROM tbl_imagenesProductos WHERE producto_id = ? LIMIT 1', [producto.id]);
      producto.url_imagen = imagen[0].url_imagen
    }));
    res.send(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Ha Ocurrido un Error',
    });
  }
};


export const obtenerDetallePublicacion = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_detalleProductos(?)', [req.params.id])
    //console.log(rows[0][0].usuario)
    const fecha = helper(rows[0][0].fecha_publicacion)
    rows[0][0].fecha = fecha

    res.send(rows[0][0])
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ha ocurrido un error al obtener el producto'
    });
  }
}

export const obtenerImagenesPublicacion = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_imagenesProductos(?)', [req.params.id])

    const [video] = await pool.query('Select id_video, url_video FROM tbl_productos WHERE producto_id=?', [req.params.id])

    //console.log(video[0])
    rows.imagenes = rows[0]
    rows.video = video[0]
    rows[0].push(video[0])

    res.send(rows[0])
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ha ocurrido un error'
    });
  }
}
//Elminar Publicacion

export const eliminarPublicacion = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_borrarPublicacion(?)', [req.params.id])
    res.send(rows)
    console.log(rows)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ha ocurrido un error'
    });
  }
}




// Lista de deseos
//agreagar a la lista

export const agregarListaDeseos = async (req, res) => {
  try {
    const [rows] = await pool.query('INSERT INTO tbl_listaDeseos(producto_id,usuario_id) VALUES(?,?)', [req.params.id, req.user]);
    //console.log(rows);
    res.json(['Agregado a Favoritos']);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      await pool.query('CALL sp_borrarDeseo(?,?)', [req.user, req.params.id]);
      res.status(200).json(['Borrado de Favoritos'])
    } else {
      res.status(500).json({
        message: 'Ha ocurrido un error al agregar a lista de productos'
      });
      console.log(error);
    }
  }
}

export const obtenerListaDeseos = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_listaDeseosUsuario(?)', [req.user]);
    const resultados = await Promise.all(rows[0].map(async (producto) => {
      const [imagen] = await pool.query('SELECT url_imagen FROM tbl_imagenesProductos WHERE producto_id = ? LIMIT 1', [producto.id]);
      producto.imagen = imagen[0].url_imagen
    }));
    res.send(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Ha ocurrido un error al agregar a lista de productos'
    });
    console.log(error);
  }
}

//validar para color de boton de lista de deseos
export const validarListaDeseo = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_listaValidacion(?,?)', [req.user, req.params.id]);
    res.send(rows[0])
  } catch (error) {

    res.status(500).json({
      message: 'Ha ocurrido un error al agregar a lista de productos'
    });
    console.log(error);
  }
}
// Editar Producto
// Editar Producto
export const editarProducto = async (req, res) => {
  const { nombre, descripcion, precio, estado, categoria, departamento } = req.body;
  const imagenes = req.files;
  const productoId = req.params.id; // Asegúrate de que estás pasando el ID del producto en la URL

  try {

    // Actualizar el producto
    await pool.query(
      'UPDATE tbl_productos SET nombre_producto=?, descripcion_producto=?, precio_producto=?, estado_id=?, categoria_id=?, departamento_id=? WHERE producto_id=?',
      [nombre, descripcion, precio, estado, categoria, departamento, productoId]
    );

    // Agregar las nuevas imágenes
    let imageUrl;
    let id_imagen;

    if (imagenes) {
      imagenes.map(async (imagen) => {
        const result = await cloudinary.uploader.upload(imagen.path);
        imageUrl = result.secure_url;
        id_imagen = result.original_filename;

        await pool.query(
          'INSERT INTO tbl_imagenesProductos(id_imagen, url_imagen, producto_id) VALUES (?,?,?)',
          [id_imagen, imageUrl, productoId]
        );
      });
    }


    res.json({ message: 'Producto actualizado con éxito' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};


// Función para eliminar una imagen de un producto
export const eliminarImagenProducto = async (req, res) => {
  try {

    const [result] = await pool.query(
      'DELETE FROM tbl_imagenesProductos WHERE id_imagenesProd = ?',
      [req.params.id]
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
//Cambiar estado de la publicacion
export const cambiarEstadoPublicacion = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_cambiarEstado(?,0)', [req.params.id])
    res.send(rows)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}


// Agregar Calificacion de un producto
export const agregarCalificacionProducto = async (req, res) => {
  const { producto_id, calificacion, comentario, autor } = req.body;
  const imagenes = req.files;

  try {
    // Insertar la calificación del producto
    const [rows] = await pool.query(
      'INSERT INTO tbl_calificaciones_producto(producto_id, calificacion, comentario, autor) VALUES (?,?,?,?)',
      [producto_id, calificacion, comentario, autor]
    );

    const calificacionId = rows.insertId;

    // Si se proporcionan imágenes, insertarlas
    if (imagenes && imagenes.length > 0) {
      await Promise.all(imagenes.map(async (imagen) => {
        const result = await cloudinary.uploader.upload(imagen.path);
        const imageUrl = result.secure_url;
        const id_imagen = result.original_filename;

        await pool.query(
          'INSERT INTO tbl_imagenes_calificaciones(calificacion_id, imagen_url, id_imagen) VALUES (?,?,?)',
          [calificacionId, imageUrl, id_imagen]
        );
      }));
    }

    res.json(calificacionId);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};

// Editar comentario y calificación de un producto, y también las imágenes relacionadas
export const editarCalificacionProducto = async (req, res) => {
  const { id, producto_id, calificacion, comentario, autor } = req.body;
  const imagenes = req.files;

  try {
    // Actualizar la calificación y el comentario
    await pool.query(
      'UPDATE tbl_calificaciones_producto SET calificacion = ?, comentario = ?, fecha_comentario = NOW() WHERE id = ? AND producto_id = ? AND autor = ?',
      [calificacion, comentario, id, producto_id, autor]
    );

    // Eliminar las imágenes antiguas
    await pool.query(
      'DELETE FROM tbl_imagenes_calificaciones WHERE calificacion_id = ?',
      [id]
    );

    console.log(imagenes);
    // Si se proporcionan nuevas imágenes, eliminar las antiguas y subir las nuevas
    if (imagenes && imagenes.length > 0) {
      // Subir las nuevas imágenes y guardar las URLs en la base de datos
      await Promise.all(imagenes.map(async (imagen, index) => {
        const result = await cloudinary.uploader.upload(imagen.path, { public_id: `Imagenes_Productos/${imagen.originalname}_${Date.now()}_${index}` });
        const imageUrl = result.secure_url;
        const id_imagen = imagen.originalname;

        await pool.query(
          'INSERT INTO tbl_imagenes_calificaciones(calificacion_id, imagen_url, id_imagen) VALUES (?,?,?)',
          [id, imageUrl, id_imagen]
        );
      }));
    }

    res.json({ message: 'Calificación actualizada con éxito' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};


// Obtener promedio calificaciones de un producto
export const obtenerCalificacionesProducto = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL sp_obtenerCalificacionesProducto(?)", [
      req.params.id
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({
        message: "No se encontro el producto",
      });
    }

    res.send(rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}

// Obtener calificaciones de un producto
export const obtenerComentariosProducto = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL sp_obtenerComentariosProducto(?)", [
      req.params.id
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({
        message: "No se encontro el producto",
      });
    }

    res.send(rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}

//Eliminar video de la publicacion
// Actualizar producto al eliminar video
export const eliminarVideo = async (req, res) => {
  try {
    // Actualizar el producto en la base de datos para eliminar el id_video y url_video
    const [rows] = await pool.query('CALL sp_subirVideoPublicacion(?,?,?)', [null, null, req.params.id]);

    res.json({ message: 'Video Eliminado' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};

// ----- SUSCRIPCION A CATEGORIAS
export const obtenerProductosCategoria = async (req, res) => {
  try {
    // traer los productos que pertenecen a una categoria dada
    const [rows] = await pool.query('CALL sp_productosCategoria(?)', [req.params.id]);
    await Promise.all(rows[0].map(async (producto) => {
      const [imagen] = await pool.query('SELECT url_imagen FROM tbl_imagenesProductos WHERE producto_id = ? LIMIT 1', [producto.id]);
      if (imagen[0]) {
        //console.log(imagen[0])
        producto.imagen = imagen[0].url_imagen
      }
    }));

    res.send(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ha ocurrido un error al traer los productos de la categoria",
    });
  }
};


export const suscribirseCategoria= async(req,res)=>{
  try {
    let validacion
    const [rows] = await pool.query('INSERT INTO tbl_suscipciones_categorias(categoria,usuario) VALUES(?,?)', [req.params.id, req.user]);
    const [validate] = await pool.query('CALL sp_validarSuscripcion(?,?)', [req.user, req.params.id]);
    if(validate[0].length>0){
      validacion=true
    }else{
      validacion=false
    }
    res.json({suscripcion:true, validacion});
  } catch (error) {
    let validacion
    if (error.code === 'ER_DUP_ENTRY') {
      await pool.query('CALL sp_AnularSuscripcion(?,?)', [req.user, req.params.id]);
      const [validate] = await pool.query('CALL sp_validarSuscripcion(?,?)', [req.user, req.params.id]);
      if(validate[0].length>0){
        validacion=true
      }else{
        validacion=false
      }
      res.json({suscripcion:false, validacion})
    } else {
      res.status(500).json({
        message: 'Ha ocurrido un error al suscribirse'
      });
      console.log(error);
    }
  }
}

export const validacionSuscripcion=async(req,res)=>{
  try {
    const [rows] = await pool.query('CALL sp_validarSuscripcion(?,?)', [req.user, req.params.id]);
    if(rows[0].length>0){
      res.send(true)
    }else{
      res.send(false)
    }

  } catch (error) {

    res.status(500).json({
      message: 'Ha ocurrido un error al agregar a lista de productos'
    });
    console.log(error);
  }
}


//Productos que tienen 5 estrellas ultimamente
export const Productos_Carrusel_Home_1 = async (req,res) =>{
  try{
    const [rows] = await pool.query("CALL sp_ProductosDeCincoEstrella(?)", [req.body.values_1]);
    res.send(rows[0])
  }catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}

//Productos que tienen 5 estrellas ultimamente
export const inactividadProductos = async (req,res) =>{
  const{cantidadDias}= req.body
  try{
    const [rows] = await pool.query("CALL sp_cambioDiasInactivar(?)", [cantidadDias]);
    console.log(rows.affectedRows)
    if(rows.affectedRows>0){
      res.json({mensaje:'Se actualizo el limite correctamente'})
    }else{
      res.json({mensaje:'Ocurrio un fallo al realizar la actualización'})
    }
    
  }catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error al configurar los dias del producto",
    });
  }
}

export const obtenerDiasInactividad = async (req,res) =>{
  try{
    const [rows] = await pool.query("CALL sp_obtenerDiasLimite()");
    res.send(rows[0])
  }catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error al configurar los dias del producto",
    });
  }
}

export const marcarProdVendido = async (req,res) =>{
  try{
    const [rows] = await pool.query("CALL sp_marcarVendido(?)",[req.params.id]);
    if(rows.affectedRows>0){
      res.json({mensaje:'El producto ahora esta inactivo'})
    }else{
      res.json({mensaje:'Ocurrio un fallo al marcar como vendido el producto'})
    }
  }catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error al vender el producto",
    });
  }
}