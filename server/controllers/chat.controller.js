import {pool} from '../db.js';

export const obtenerChat = async(req,res)=>{
    const {emisor,receptor}= req.query;
    try {
        const [conversacion] = await pool.query('CALL sp_obtenerConversacion(?,?)',[emisor,receptor]);
        res.send(conversacion[0]) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Ha Ocurrido un Error",
          });
    }
};