import {pool} from '../db.js';

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