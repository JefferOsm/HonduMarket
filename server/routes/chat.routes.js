import { Router } from "express";
import { autenticacionUsuario } from "../middlewares/auth.js";
import { obtenerChat, obtenerConversacionesGenerales, obtenerConversacionesProductos, obtenerUsuariosChat } from "../controllers/chat.controller.js";
const router= Router();

//obtener conversaciones
router.get('/conversacion', autenticacionUsuario, obtenerChat );

//obtener usuarios disponibles para chatear
router.get('/usuarios',autenticacionUsuario,obtenerUsuariosChat);

//obtener las conversaciones para preguntar por productos
router.get('/conversaciones-producto',autenticacionUsuario,obtenerConversacionesProductos);

//obtener las conversaciones generales entre usuarios
router.get('/conversaciones-general', autenticacionUsuario, obtenerConversacionesGenerales)


export default router