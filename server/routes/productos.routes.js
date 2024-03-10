import { Router } from "express";
import { obtenerCategorias,agregarProducto, obtenerPublicacionesUsuario } from "../controllers/productos.controller.js";
import { autenticacionUsuario } from "../middlewares/auth.js";


const router= Router();

//Obtener Categorias
router.get('/categorias', obtenerCategorias)

//Agregar Producto
router.post('/publicar',autenticacionUsuario, agregarProducto)

//Obtener las publicaciones de un usuario
router.get('/publicaciones', autenticacionUsuario, obtenerPublicacionesUsuario )



export default router