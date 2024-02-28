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


// Agregar Usuarios
export const createUser = async (req, res) => {

  const { nombre,username, correo, telefono, direccion, pass } = req.body;
  const password = await encrypt(pass);

  try {
    const [validacionUsuario] = await pool.query('Select * from tbl_usuarios where correo=? or telefono=?' ,[correo,telefono]);
    if(validacionUsuario.length > 0) return res.status(400).json(['El Correo o Telefono Esta en Uso ']);

    const [rows] = await pool.query(
      "INSERT INTO tbl_usuarios(nombre,username,correo,telefono,direccion,pass) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre,username, correo, telefono, direccion, password]
    );

    const token= await createToken({id: rows.insertId});
    res.cookie('token', token,{
      SameSite:'None',
      Secure:true
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
    const [rows] = await pool.query('Select * from tbl_usuarios where correo=?' ,[correo]);

    if(rows.length <= 0) return res.status(400).json(["Correo no encontrado" ]);

    const comparacionPassword = await compare(pass,rows[0].pass);

    if(!comparacionPassword) return res.status(400).json([ "Contraseña Incorrecta" ]);

    const token= await createToken({id: rows[0].id});
    res.cookie('token', token,{
      SameSite: 'None',
      secure:true
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
    SameSite: 'None',
    Secure:true
  })

  return res.sendStatus(200);
}

//Actualizar Usuarios
export const updateUser = async (req, res) => {
  try {
    // console.log("Req Body:", req.body);
    const { nombre,username, correo, telefono, direccion, pass } = req.body;
    const password = await encrypt(pass);
    let validacion= false

    //comprobar correos y telefono
    const[comp]= await pool.query('SELECT correo,telefono FROM tbl_usuarios WHERE id <> ?', [req.user])
    // console.log(comp);

    comp.forEach(objeto => {
      if(objeto.correo === correo || objeto.telefono === telefono ){
        // console.log(objeto.correo)
        validacion=true
        return res.status(400).json(['El Correo o Telefono Esta en Uso ']);
      }
    });

    if(!validacion){
        // Actualiza el usuario en la base de datos
      const [rows] = await pool.query(
        "UPDATE tbl_usuarios SET nombre= ?,username=?, correo=?, telefono=?, direccion=?, pass=?  WHERE id=?",
        [nombre,username, correo, telefono, direccion, password, req.user]
      );

      if (rows.affectedRows <= 0) {
          return res.status(404).json({
            message: "El usuario a eliminar no existe",
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
        password
      });
    }

   
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ha Ocurrido un Error",
    });
  }
};

export const  actualizarImagen = async(req,res)=>{
  try {
    // console.log("Req File:", req.file);

    // Obtén la URL de la imagen existente del usuario
    const [existingUser] = await pool.query("SELECT url_imagen FROM tbl_usuarios WHERE id=?", [req.user]);
    let imageUrl = existingUser[0].url_imagen;

    // Si se proporcionó un archivo, sube la imagen a Cloudinary y obtén la URL de la imagen
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      console.log("Cloudinary Result:", result);
    }

    const [rows] = await pool.query(
      "UPDATE tbl_usuarios SET url_imagen=? WHERE id=?",
      [imageUrl, req.user]
    );

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
}