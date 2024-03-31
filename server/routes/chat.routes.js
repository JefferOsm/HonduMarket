import { Router } from "express";
import { autenticacionUsuario } from "../middlewares/auth.js";
import { obtenerChat } from "../controllers/chat.controller.js";
const router= Router();

//obtener conversaciones
router.get('/conversacion', autenticacionUsuario, obtenerChat );


export default router