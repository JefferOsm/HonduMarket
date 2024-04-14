import {Router} from 'express'
import {getUsers,getUser,createUser,deleteUser,updateUser,loginUser,logoutUser,
        verificarToken,actualizarImagen,actualizarPassword, obtenerUsuario,agregarCalificacion, obtenerCalificaciones, obtenerComentarios,editarComentario, obtenertiposDenuncias,
        reportarUsuario} from '../controllers/user.controllers.js'
import {autenticacionUsuario} from '../middlewares/auth.js'
import {parserUsuarios} from '../middlewares/multer.js';


const router= Router();

//Obtener Usuarios
router.get("/", getUsers);

//Ver perfil
router.get("/perfil", autenticacionUsuario, getUser);

//Ver usuario
router.get("/detalle/:id", obtenerUsuario);

//Registrarse
router.post("/crear", createUser);

//Actualizar Usuario
router.put("/editar", autenticacionUsuario,  updateUser);

//Actualizar Foto
router.put('/editar/foto', autenticacionUsuario,parserUsuarios.single('image'), actualizarImagen)

//Actualizar Contraseña
router.put('/editarPassword', autenticacionUsuario,actualizarPassword )

//Borrar Cuenta
router.delete("/eliminar", autenticacionUsuario, deleteUser);

//Iniciar Sesion
router.post('/login', loginUser)

//Cerrar Sesion
router.post('/logout', logoutUser)


//Verificar token de autenticacion
router.get('/verificar', verificarToken)

// Agregar calificacion de un usuario
router.post('/calificacion',autenticacionUsuario, agregarCalificacion);

// Obtener promedio calificaciones de un usuario
router.get('/promedio-calificaciones/:id', obtenerCalificaciones);

//obtener calificaciones de un usuario
router.get('/comentarios/:id', obtenerComentarios);

//Editar calificacion de un usuario
router.put('/editarComentario',editarComentario);

//Obtener tipos de enuncia
router.get('/denuncias/tipos',autenticacionUsuario, obtenertiposDenuncias);

//Reportar o denunciar un usuario
router.post('/denuncias/reporte', autenticacionUsuario, reportarUsuario)

export default router;