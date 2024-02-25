import {pool} from '../db.js'
import { compare,encrypt } from "../helpers/helper.js";
import {createToken} from '../helpers/jwt.js'

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


//Agregar Usuarios
export const createUser = async (req, res) => {

  const { nombre, correo, telefono, direccion, pass } = req.body;
  const password = await encrypt(pass);

  try {

    const [rows] = await pool.query(
      "INSERT INTO tbl_usuarios(nombre,correo,telefono,direccion,pass) VALUES (?, ?, ?, ?, ?)",
      [nombre, correo, telefono, direccion, password]
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
export const updateUser = async(req, res) => {

  const { nombre, correo, telefono, direccion, pass } = req.body;
  const password = await encrypt(pass);

  try {

    const [rows] = await pool.query(
      "UPDATE tbl_usuarios SET nombre= ? ,correo=? ,telefono=? ,direccion=? ,pass=? WHERE id=?",
      [nombre, correo, telefono, direccion, password,req.user]
    );

    res.json({
      message: 'Usuario Actualizado Exitosamente'
    })
    // res.json(rows.insertId);
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
