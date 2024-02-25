import  jwt  from "jsonwebtoken";

//Generar Token de Autenticacion
export function createToken(payload){
    return new Promise((resolve,reject)=>{
        jwt.sign(
            payload,
            'key123',
            {
              expiresIn: '1d',
            },
            (err,token) =>{
              if (err) reject(err);
              resolve(token)
            }
          );
    });
}
