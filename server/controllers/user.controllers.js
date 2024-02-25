import {pool} from '../db.js'
import { compare,encrypt } from "../helpers/helper.js";
import {createToken} from '../helpers/jwt.js'
import cloudinary from 'cloudinary';

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
      correo: rows[0].correo,
      telefono: rows[0].telefono,
      direccion: rows[0].direccion
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};


// Agregar Usuarios
export const createUser = async (req, res) => {

  const { nombre, correo, telefono, direccion, pass, url_imagen } = req.body;
  const password = await encrypt(pass);

  try {

    const [rows] = await pool.query(
      "INSERT INTO tbl_usuarios(nombre,correo,telefono,direccion,pass,url_imagen) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, correo, telefono, direccion, password, url_imagen]
    );

    const token= await createToken({id: rows.insertId});
    res.cookie('token', token);
    res.json({
      message: 'Usuario Registrado Exitosamente'
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
    const [rows] = await pool.query('Select * from tbl_usuarios where correo=?' ,[correo]);

    if(rows.length <= 0) return res.status(400).json({ message: "Usuario no encontrado" });

    const comparacionPassword = await compare(pass,rows[0].pass);

    if(!comparacionPassword) return res.status(400).json({ message: "Contraseña Incorrecta" });

    const token= await createToken({id: rows[0].id});
    res.cookie('token', token);
    res.json({
      message: 'Usuario Logueado Exitosamente'
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
    expires: new Date(0)
  })

  return res.sendStatus(200);
}

//Actualizar Usuarios
export const updateUser = async (req, res) => {
  try {
    console.log("Req Body:", req.body);
    console.log("Req File:", req.file);
    const { nombre, correo, telefono, direccion, pass } = req.body;
    const password = await encrypt(pass);

    // Obtén la URL de la imagen existente del usuario
    const [existingUser] = await pool.query("SELECT url_imagen FROM tbl_usuarios WHERE id=?", [req.user]);
    let imageUrl = existingUser[0].url_imagen;

    // Si se proporcionó un archivo, sube la imagen a Cloudinary y obtén la URL de la imagen
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      console.log("Cloudinary Result:", result);
    }

    // Actualiza el usuario en la base de datos
    const [rows] = await pool.query(
      "UPDATE tbl_usuarios SET nombre= ?, correo=?, telefono=?, direccion=?, pass=?, url_imagen=? WHERE id=?",
      [nombre, correo, telefono, direccion, password, imageUrl, req.user]
    );
    
    console.log("DB Update Result:", rows);

    res.json({
      message: 'Usuario Actualizado Exitosamente'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};



//Eliminar Usuario
export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM tbl_usuarios WHERE id= ?", [
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
