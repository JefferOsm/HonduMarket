import {pool} from '../db.js'
import { compare,encrypt } from "../helpers/helper.js";

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

//Obtener un Usuario
export const getUser = async (req, res) => {
  try {
    const [rows] = await pool.query("Select *FROM tbl_usuarios where id= ?", [
      req.params.id,
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
    res.send({ rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }

};

//Actualizar Usuarios
export const updateUser = (req, res) => {
  res.send("creando Tareas");
};

//Eliminar Usuario
export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM tbl_usuarios WHERE id= ?", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0) {
      return res.status(404).json({
        message: "El usuario a eliminar no existe",
      });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};
