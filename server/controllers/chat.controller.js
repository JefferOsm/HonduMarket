import {pool} from '../db.js';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

export const obtenerChat = async(req,res)=>{
    const {emisor,receptor,producto}= req.query;
    try {
        const [conversacion] = await pool.query('CALL sp_obtenerConversacion_producto(?,?,?)',[emisor,receptor,producto]);
        res.send(conversacion[0]) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error al obtener los datos de chat para el modal",
          });
    }
};

export const obtenerUsuariosChat = async(req,res)=>{
    try {
        const [usuarios]= await pool.query('CALL sp_usuariosChat(?)',[req.user])
        res.send(usuarios[0])
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error al obtener los usuarios del chat",
          });
    }
}

export const obtenerConversacionesProductos= async(req,res)=>{
    try {
        const [conversaciones]= await pool.query('CALL sp_conversacionesProductos(?)',[req.user]);
        await Promise.all(conversaciones[0].map(async (producto) => {
            const [imagen] = await pool.query('SELECT url_imagen FROM tbl_imagenesProductos WHERE producto_id = ? LIMIT 1', [producto.producto_id]);
            if(imagen[0]){
            //console.log(imagen[0])
            producto.imagen=imagen[0].url_imagen}
        }));
        res.send(conversaciones[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error al obtener las conversaciones de los productos"
          });
    }
}

export const obtenerConversacionesGenerales= async(req,res)=>{
    try {
        const [conversaciones]= await pool.query('CALL sp_conversacionesUsers(?)',[req.user]);
        res.send(conversaciones[0])
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error al obtener las conversaciones generales"
          });
    }
};

export const obtenerMensajesGeneral = async(req,res)=>{
    const {emisor,receptor}= req.query;
    try {
        const [conversacion] = await pool.query('CALL sp_obtenerConversacion_general(?,?)',[emisor,receptor]);
        res.send(conversacion[0]) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error al obtener los mensajes de la conversacion general",
          });
    }
};

// CANALES
export const crearCanal = async(req,res)=>{
    const {nombre,descripcion}= req.body;
    try {
        let imageUrl
        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
            //console.log("Cloudinary Result:", result);
          }

        const [rows] = await pool.query('INSERT INTO tbl_canales(nombre,descripcion,imagen,administrador) VALUES(?,?,?,?)',
        [nombre,descripcion,imageUrl,req.user]);
        res.json({mensaje:'Canal creado correctamente'}) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error al crear el canal",
          });
    }
};

export const obtenerCanales = async(req,res)=>{
    try {
        const [rows] = await pool.query('CALL sp_obtenerCanales(?)',
        [req.user]);

        res.send(rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error al obtener los canales del usuario",
          });
    }
}

export const obtenerTodosCanales = async(req,res)=>{
    try {
        const [rows] = await pool.query('CALL sp_obtenerTodosCanales(?)',
        [req.user]);

        res.send(rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error al obtener los canales del usuario",
          });
    }
}


export const seguirCanal= async(req,res)=>{
    try {
      let validacion
      const [rows] = await pool.query('INSERT INTO tbl_canales_seguidores(canal,seguidor) VALUES(?,?)', [req.params.id, req.user]);
      const [validate] = await pool.query('CALL sp_validarSeguimiento(?,?)', [req.user, req.params.id]);
      if(validate[0].length>0){
        validacion=true
      }else{
        validacion=false
      }
      res.json({suscripcion:true, validacion});
    } catch (error) {
      let validacion
      if (error.code === 'ER_DUP_ENTRY') {
        await pool.query('CALL sp_AnularSeguimiento(?,?)', [req.user, req.params.id]);
        const [validate] = await pool.query('CALL sp_validarSeguimiento(?,?)', [req.user, req.params.id]);
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


  export const borrarCanal = async(req,res)=>{
    try {
        const [rows] = await pool.query('CALL sp_borrarCanal(?)',
        [req.params.id]);

        res.json({mensaje:'Se elimino el canal correctamente'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error al borrar el canal",
          });
    }
}


export const obtenerMensajesCanal = async(req,res)=>{
  try {
      const [rows] = await pool.query('CALL sp_obtenerMensajesCanal(?)',
      [req.params.id]);

      res.send(rows[0]);
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          message: "Ha Ocurrido un Error al borrar el canal",
        });
  }
}

export const insertarMensajesProd= async(req,res)=>{
  const {mensaje,receptor,producto}= req.body
  try {
    const[validacion]=await pool.query('CALL sp_validarConversacionProducto(?,?,?)',
    [req.user,receptor,producto])

    if(validacion[0].length>0){
      res.json({mensaje: false})
    }else{
      const [rows] = await pool.query('INSERT INTO tbl_mensajes(emisor_id,receptor_id,mensaje,producto_id) VALUES(?,?,?,?)',
      [req.user,receptor,mensaje,producto])

      res.json({mensaje: true})
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Ha Ocurrido un Error al Enviar el mensaje",
      });
  }
}