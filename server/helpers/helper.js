//MODULO PARA HASHEAR Y COMPARAR CONTRASEÑAS 
import bcrypt from "bcrypt";

//Encriptar Passwors
export const encrypt= async(password) =>{
    const hash= await bcrypt.hash(password,10)
    return hash
}

//Comparar Passwors
export const compare= async(password, savePassword) =>{
    try {
        return await bcrypt.compare(password, savePassword)
    } catch (e) {
        console.log(e)
    }
}