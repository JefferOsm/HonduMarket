import  jwt  from "jsonwebtoken";

//Validar el Token de Autenticacion
export const autenticacionUsuario = (req,res,next)=>{
    const {token} = req.cookies

    if(!token) return res.status(401).json({Message: 'Autorizacion Denegada'});

    jwt.verify(token,'key123',(err,user)=>{
        if(err) return req.status(403).json({message:'Usuario Invalido'});

        req.user= user.id
    })

    next();
}