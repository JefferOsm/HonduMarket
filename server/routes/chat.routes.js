import { Router } from "express";
import { autenticacionUsuario } from "../middlewares/auth.js";
import { obtenerChat, obtenerConversacionesGenerales, obtenerConversacionesProductos,
     obtenerMensajesGeneral, obtenerUsuariosChat, crearCanal, 
     obtenerCanales,
     obtenerTodosCanales,
     seguirCanal,
     borrarCanal,
     obtenerMensajesCanal,
     insertarMensajesProd} from "../controllers/chat.controller.js";
import {parserUsuarios} from '../middlewares/multer.js';
const router= Router();

//obtener conversaciones
router.get('/conversacion', autenticacionUsuario, obtenerChat );

//obtener conversacion general
router.get('/mensajes-general', autenticacionUsuario, obtenerMensajesGeneral)

//enviar mensajes
router.post('/mensaje', autenticacionUsuario, insertarMensajesProd)

//obtener usuarios disponibles para chatear
router.get('/usuarios',autenticacionUsuario,obtenerUsuariosChat);

//obtener las conversaciones para preguntar por productos
router.get('/conversaciones-producto',autenticacionUsuario,obtenerConversacionesProductos);

//obtener las conversaciones generales entre usuarios
router.get('/conversaciones-general', autenticacionUsuario, obtenerConversacionesGenerales);

//canales
//crear canal
router.post('/canal-create', autenticacionUsuario, parserUsuarios.single('image'), crearCanal);

//obtener los canales
router.get('/canales-user', autenticacionUsuario, obtenerCanales);

//obtener todos los canales para busqueda
router.get('/canales', autenticacionUsuario, obtenerTodosCanales);

//obtener todos los canales para busqueda
router.get('/canales/seguir/:id', autenticacionUsuario, seguirCanal);

//borrar un canal
router.delete('/canales/:id', autenticacionUsuario, borrarCanal);

//obtener mensajes de un canal
router.get('/canales/mensajes/:id', autenticacionUsuario, obtenerMensajesCanal);

export default router