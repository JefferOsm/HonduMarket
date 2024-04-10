import { Router } from "express";
import { obtenerCategorias,agregarProducto, obtenerPublicacionesUsuario, obtenerDepartamentos, obtenerEstados, 
    agregarVideo, obtenerDetallePublicacion, obtenerImagenesPublicacion,obtenerPublicacionesHome, obtenerPublicacionesBusqueda,
    obtenerResultadosBusqueda, obtenerPublicacionesHomeAuth, agregarListaDeseos, obtenerListaDeseos, validarListaDeseo, eliminarPublicacion,
    editarProducto,
    eliminarImagenProducto,cambiarEstadoPublicacion, agregarCalificacionProducto, obtenerCalificacionesProducto, obtenerComentariosProducto, editarComentarioProducto} from "../controllers/productos.controller.js";
import { autenticacionUsuario } from "../middlewares/auth.js";
import {productoParser, videoParser} from '../middlewares/multer.js'


const router= Router();

//Obtener Categorias
router.get('/categorias', obtenerCategorias)

//Obtener departamentos
router.get('/departamentos',obtenerDepartamentos)

//Obtener las publicaciones para la pagina de inicio
router.get('/publicacionesinicio', obtenerPublicacionesHome)

//Obtener las publicaciones para la pagina de inicio
router.get('/publicacionesinicioAuth', autenticacionUsuario, obtenerPublicacionesHomeAuth)

//obtener todas las publicaciones para la busqueda
router.get('/publicaciones/busqueda', obtenerPublicacionesBusqueda)

//Obtener las publicaciones en la busqueda
router.get('/buscar', obtenerResultadosBusqueda)

//Obtener Estados
router.get('/estados', obtenerEstados)

//Agregar Producto
router.post('/publicar',autenticacionUsuario ,productoParser.array('imagenes', 6), agregarProducto)

//Subir Video
router.put('/video/:id',autenticacionUsuario,videoParser.single('video'),agregarVideo)

//Obtener las publicaciones de un usuario
router.get('/publicaciones', autenticacionUsuario, obtenerPublicacionesUsuario )

//Obtener el detalle de un producto
router.get('/publicaciones/detalle/:id', obtenerDetallePublicacion);

//obtener imagenes del producto
router.get('/publicaciones/detalle/imagenes/:id', obtenerImagenesPublicacion);

//eliminar publicacion
router.delete('/publicacion/eliminar/:id', autenticacionUsuario, eliminarPublicacion);


//AGREGAR A LISTA DE DESEOS
router.post('/lista_deseos/insertar/:id', autenticacionUsuario, agregarListaDeseos);

//Obtener lista de deseos
router.get('/lista_deseos',autenticacionUsuario, obtenerListaDeseos)

//Validar Lista de Deseo
router.get('/lista_deseo/validar/:id', autenticacionUsuario, validarListaDeseo)

// Editar Producto
router.put('/publicacion/editar/:id', autenticacionUsuario,productoParser.array('imagenes', 6), editarProducto);

//eliminar una imagen
router.delete('/publicacion/imagen/delete/:id', autenticacionUsuario, eliminarImagenProducto)
//cambiar estado de publicacion
router.put('/publicacion/estado/:id', autenticacionUsuario, cambiarEstadoPublicacion);

// Agregar calificacion de un producto
router.post('/calificacionProducto', autenticacionUsuario,productoParser.array('imagenes', 4), agregarCalificacionProducto);

// Obtener promedio calificaciones de un producto
router.get('/calificaciones-producto/:id', obtenerCalificacionesProducto);

// Obtener calificaciones de un producto
router.get('/comentarios/:id', obtenerComentariosProducto);

// Editar calificacion de un producto
router.put('/editarComentarioProducto', editarComentarioProducto);

export default router