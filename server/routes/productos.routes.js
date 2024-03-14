import { Router } from "express";
import { obtenerCategorias,agregarProducto, obtenerPublicacionesUsuario,obtenerPublicacionesHome , obtenerDepartamentos, obtenerEstados,} from "../controllers/productos.controller.js";
import { autenticacionUsuario } from "../middlewares/auth.js";
import {productoParser} from '../middlewares/multer.js'


const router= Router();

//Obtener Categorias
router.get('/categorias', obtenerCategorias)

//Agregar Producto
router.post('/publicar',autenticacionUsuario,productoParser.array('imagenes', 6), agregarProducto)

//Obtener las publicaciones de un usuario
router.get('/publicaciones', autenticacionUsuario, obtenerPublicacionesUsuario)

//Obtener las publicaciones para la pagina de inicio
router.get('/publicacionesinicio', obtenerPublicacionesHome)

//Obtener departamentos
router.get('/departamentos',obtenerDepartamentos)


//Obtener Estados
router.get('/estados', obtenerEstados)


export default router