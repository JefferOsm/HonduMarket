import {pool} from '../db.js'
import { compare,encrypt } from "../helpers/helper.js";
import {createToken} from '../helpers/jwt.js'
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';

//Obtener Usuarios
export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("Select *FROM tbl_usuarios");
    res.send(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};

//Obtener un Usuario para el perfil
export const getUser = async (req, res) => {
  try {
    const [rows] = await pool.query("Select *FROM tbl_usuarios where id= ?", [
      req.user
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({
        message: "No se encontro el usuarios",
      });
    }

    res.json({
      nombre: rows[0].nombre,
      username: rows[0].username,
      correo: rows[0].correo,
      telefono: rows[0].telefono,
      direccion: rows[0].direccion,
      url_imagen: rows[0].url_imagen
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};


//Obtener un Usuario para el perfil
export const obtenerUsuario = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL sp_obtenerUsuario(?)", [
      req.params.id
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({
        message: "No se encontro el usuarios",
      });
    }

    res.send(rows[0][0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};


//Agregar Calificacion de un usuario
export const agregarCalificacion = async (req, res) => {
  try {
    const { usuario_id, calificacion, comentario, autor } = req.body;

    await pool.query("INSERT INTO tbl_calificaciones (usuario_id, calificacion, comentario, autor) VALUES (?, ?, ?, ?)", [
      usuario_id, calificacion, comentario, autor
    ]);

    res.status(201).json({
      message: "Calificación agregada exitosamente",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}

// Editar comentario de un usuario
export const editarComentario = async (req, res) => {
  try {
    const { usuario_id, calificacion, comentario, autor } = req.body;

    await pool.query("UPDATE tbl_calificaciones SET calificacion = ?, comentario = ? WHERE usuario_id = ? AND autor = ?", [
      calificacion, comentario, usuario_id, autor
    ]);

    res.status(200).json({
      message: "Comentario actualizado exitosamente",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};


//Obtener promedio calificaciones de un usuario
export const obtenerCalificaciones = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL sp_obtenerCalificaciones(?)", [
      req.params.id
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({
        message: "No se encontro el usuarios",
      });
    }

    res.send(rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}


//Obtener calificaciones de un usuario
export const obtenerComentarios = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL sp_obtenerComentarios(?)", [
      req.params.id
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({
        message: "No se encontro el usuarios",
      });
    }

    res.send(rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}

// Crear Usuarios
export const createUser = async (req, res) => {

  const { nombre,username, correo, telefono, direccion, pass } = req.body;
  const password = await encrypt(pass);

  try {
    //Validar que correo y telefono no se repita
    const [validacionUsuario] = await pool.query('Select * from tbl_usuarios where correo=? or telefono=?' ,[correo,telefono]);
    if(validacionUsuario.length > 0) return res.status(400).json(['El Correo o Telefono Esta en Uso ']);

    //validar que el usuario no se repita
    const [validacionUserName] = await pool.query('Select * from tbl_usuarios where username= ?' ,[username]);
    if(validacionUserName.length > 0) return res.status(400).json(['El Nombre de Usuario Esta en Uso ']);

    const [rows] = await pool.query(
      "INSERT INTO tbl_usuarios(nombre,username,correo,telefono,direccion,pass) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre,username, correo, telefono, direccion, password]
    );

    const token= await createToken({id: rows.insertId});
    res.cookie('token', token,{
      sameSite:'none',
      secure:true,
    });
    res.json({
      id: rows.insertId,
      nombre,
      username,
      correo,
      telefono,
      direccion,
      password
    })

    // res.json(rows.insertId);
  } catch (error) {

    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }

};

//Loguearse
export const loginUser = async(req,res) => {

  const {correo, pass } = req.body;

  try {
    //Verificar existencia de usuario
    const [rows] = await pool.query('Select * from tbl_usuarios where correo=?' ,[correo]);
    if(rows.length <= 0) return res.status(400).json(["Usuario no Existente" ]);

    //comparar contraseñas
    const comparacionPassword = await compare(pass,rows[0].pass);
    if(!comparacionPassword) return res.status(400).json([ "Contraseña Incorrecta" ]);

    if(rows[0].inactivo === 1){
      return res.status(400).json([ "Tu cuenta ha sido bloqueada por incumplir las politicas del sistema" ]);
    }

    //Crear token de autenticacion
    const token= await createToken({id: rows[0].id});
    res.cookie('token', token,{
      sameSite: 'none',
      secure:true,
    });

    res.json({
      id: rows[0].id,
      nombre: rows[0].nombre,
      username: rows[0].username,
      correo: rows[0].correo,
      telefono: rows[0].telefono,
      direccion: rows[0].direccion,
      url_imagen: rows[0].url_imagen,
      password: pass
    })
    // res.json(rows.insertId);
  } catch (error) {

    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }

}

//Cerrar sesion
export const logoutUser = (req,res)=>{
  res.cookie('token', "", {
    expires: new Date(0),
  })

  return res.sendStatus(200);
}

//Actualizar Usuarios
export const updateUser = async (req, res) => {
  try {
    // console.log("Req Body:", req.body);
    const { nombre,username, correo, telefono, direccion } = req.body;
    let validacion= false

    //comprobar correos y telefono
    const[comp]= await pool.query('SELECT correo,telefono,username FROM tbl_usuarios WHERE id <> ?', [req.user]);

    comp.forEach(objeto => {
      if(objeto.correo === correo || objeto.telefono === telefono ){
        // console.log(objeto.correo)
        validacion=true
        return res.status(400).json(['El Correo o Telefono Esta en Uso ']);
      }
      if(objeto.username === username ){
        // console.log(objeto.correo)
        validacion=true
        return res.status(400).json(['El Nombre de Usuario esta en uso']);
      }
    });

    //Si no hay problemas, actualizar el usuario
    if(!validacion){
        // Actualiza el usuario en la base de datos
      const [rows] = await pool.query(
        "UPDATE tbl_usuarios SET nombre= ?,username=?, correo=?, telefono=?, direccion=? WHERE id=?",
        [nombre,username, correo, telefono, direccion, req.user]
      );

    // Error por si el usuario no existe
      if (rows.affectedRows <= 0) {
          return res.status(404).json({
            message: "El usuario a modificar no existe",
          });
        };

        //devolver foto si la tiene
        const [existingUser] = await pool.query("SELECT url_imagen FROM tbl_usuarios WHERE id=?", [req.user]);


      res.json({
        nombre,
        username,
        correo,
        telefono,
        direccion,
        url_imagen:existingUser[0].url_imagen,
      });
    }

   
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};


// Subir Foto de Perfil
export const  actualizarImagen = async(req,res)=>{

  try {
    // console.log("Req File:", req.file);

    // Obtén la URL de la imagen existente del usuario
    const [existingUser] = await pool.query("SELECT url_imagen FROM tbl_usuarios WHERE id=?", [req.user]);
    let imageUrl = existingUser[0].url_imagen;
    let id_imagen

    // Si se proporcionó un archivo, sube la imagen a Cloudinary y obtén la URL de la imagen
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      id_imagen= result.original_filename;
      console.log("Cloudinary Result:", result);
    }

    //Ejecutar consulta para subir imagen
    const [rows] = await pool.query(
      "CALL sp_actualizarFotoPerfil(?,?,?)",
      [id_imagen, imageUrl, req.user]
    );

    //Devolver datos del usuario
    const [user] = await pool.query("Select *FROM tbl_usuarios where id= ?", [
      req.user
    ]);
    
    res.json({
      id: user[0].id,
      nombre: user[0].nombre,
      username: user[0].username,
      correo: user[0].correo,
      telefono: user[0].telefono,
      direccion: user[0].direccion,
      url_imagen: user[0].url_imagen,
      password: user[0].pass
    })
  } catch (error) {
    console.log(error)
  }
}

export const actualizarPassword = async(req,res)=>{
  const {passActual, passNuevo} = req.body
  const newPass= await encrypt(passNuevo)
  try {
    //Verificar existencia de usuario
    const [rows] = await pool.query('Select * from tbl_usuarios where id=?' ,[req.user]);
    if(rows.length <= 0) return res.status(400).json(["Usuario no Existente" ]);

    //comparar contraseñas
    const comparacionPassword = await compare(passActual,rows[0].pass);
    if(!comparacionPassword) return res.status(400).json([ "La Contraseña Actual no coincide " ]);


    await pool.query('UPDATE tbl_usuarios SET pass=? WHERE id=?',[newPass,req.user]);
    return res.status(200).json(['Actualizacion Correcta']);

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}



//Eliminar Usuario
export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query("CALL sp_eliminarCuenta(?)", [
      req.user,
    ]);

    if (result.affectedRows <= 0) {
      return res.status(404).json({
        message: "El usuario a eliminar no existe",
      });
    };

    res.cookie('token', "", {
      expires: new Date(0)
    });

    res.sendStatus(204);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};


//VERIFICAR TOKEN
export const verificarToken= async(req,res)=>{
  const {token} = req.cookies

  jwt.verify(token,'key123',async (err,user)=>{
    if (err) return res.status(401).json({
      message: "No estas Autorizado",
    });
  
    const [rows] = await pool.query("Select *FROM tbl_usuarios where id= ?", [
      user.id
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({
        message: "No estas Autorizado",
      });
    }

    

    res.json({
      id: rows[0].id,
      nombre: rows[0].nombre,
      username: rows[0].username,
      correo: rows[0].correo,
      telefono: rows[0].telefono,
      direccion: rows[0].direccion,
      pass: rows[0].pass,
      url_imagen: rows[0].url_imagen
    });
  })
};

export const obtenertiposDenuncias= async(req,res)=>{
  try {
      const [rows] = await pool.query('CALL sp_tiposdenuncia')
      res.send(rows[0])
  } catch (error) {
      console.log(error)
      return res.status(500).json({
          message: "Ha Ocurrido un Error",
        });
  }
}

export const reportarUsuario= async(req,res)=>{
  const {denuncia,usuario}= req.body
  try {
    await pool.query("INSERT INTO tbl_denuncia_usuario (tipoDenuncia, usuario,reportador) VALUES (?, ?,? )", [
      denuncia, usuario, req.user
    ]);

    res.status(201).json({
      message: "Reporte realizado exitosamente",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        message: "Ha Ocurrido un Error al enviar tu reporte",
      });
  }
}


export const obtenerCantidadReportadores= async(req,res)=>{
  try {
    const [rows]= await pool.query('CALL sp_cantidad_reportadores(?)',[req.params.id])

    res.send(rows[0])
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Ha ocurrido un error al obtener los reportadores",
    });
  }
}


export const obtenerDetalleReportes= async(req,res)=>{
  try {
    const [rows]= await pool.query('CALL sp_detalle_reportes(?)',[req.params.id])

    res.send(rows[0])
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Ha ocurrido un error al obtener el detalle de los reportes",
    });
  }
}


export const usuariosDenunciados= async(req,res)=>{
  try {
    const [rows] = await pool.query('CALL sp_usuarios_denunciados')
    res.send(rows[0])
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message: "Ha ocurrido un error al obtener los usuarios con denuncias",
      });
}
}

export const inhabilitarCuenta= async(req,res)=>{
  try {
    await pool.query("CALL sp_inhabilitarCuenta(?)", [
      req.params.id
    ]);

    res.status(200).json({
      message: "Cuenta inhabilitada exitosamente",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        message: "Ha Ocurrido un Error al inhabilitar la cuenta",
      });
  }
}

//conteo de los productos creados los ultimos 12 meses
export const conteoproductos = async (req,res) =>{
  try{
    const [rows] = await pool.query("CALL sp_ContarProductosCreados()");
    res.send(rows[0])
  }catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}


//conteo de las calificaciones de los usuarios 
export const conteoCalificacionUsuarios = async (req,res) =>{
  try{
    const [rows] = await pool.query("CALL sp_ContarCalificacionUsuarios()");
    res.send(rows[0])
  }catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
}