import axios from '../axios'


export const registroRequest= async (user)=> {
    const response = await axios.post(`/usuarios/crear`, user);
    return response.data; // Devuelve los datos de respuesta del servidor
}

export const loginRequest= async (user)=>{
  const response= await axios.post(`/usuarios/login`, user);
  return response.data
}

export const verificarTokenRequest= async()=>{
  try {
    const response = await axios.get(`/usuarios/verificar`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


export const actualizarUsuarioRequest= async(user)=>{
  try {
    const response= await axios.put(`/usuarios/editar`,user)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const eliminarUsuarioRequest = async()=>{
  try {
    const response = await axios.delete(`/usuarios/eliminar`)
    return response.data 
  } catch (error) {
    console.log(error)
  }
}

export const actualizarFotoReques= async(file)=>{
  try {
    const response = await axios.put(`/usuarios/editar/foto`,file)
    return response.data
  } catch (error) {
    console.log(error)
  }

}