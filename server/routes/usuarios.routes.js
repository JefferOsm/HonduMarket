import {Router} from 'express'
import {getUsers,getUser,createUser,deleteUser,updateUser,loginUser,logoutUser,verificarToken,actualizarImagen} from '../controllers/user.controllers.js'
import {autenticacionUsuario} from '../middlewares/auth.js'
import multer from '../middlewares/multer.js';


const router= Router();

//Obtener Usuarios
router.get("/", getUsers);

//Ver perfil
router.get("/perfil", autenticacionUsuario, getUser);

//Registrarse
router.post("/crear", createUser);

//Actualizar Usuario
router.put("/editar", autenticacionUsuario,  updateUser);

//Actualizar Foto
router.put('/editar/foto', autenticacionUsuario,multer.single('image'), actualizarImagen)

//Borrar Cuenta
router.delete("/eliminar", autenticacionUsuario, deleteUser);

//Iniciar Sesion
router.post('/login', loginUser)

//Cerrar Sesion
router.post('/logout', logoutUser)

router.get('/verificar', verificarToken)

export default router;