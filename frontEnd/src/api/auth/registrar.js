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
  const response= await axios.get(`/usuarios/verificar`)
  return response.data
}


export const actualizarUsuarioRequest= async(user)=>{
  const response= await axios.put(`/usuarios/editar`,user)
  return response.data
}

export const eliminarUsuarioRequest = async()=>{
  const response = await axios.delete(`/usuarios/eliminar`)
  return response.data
}

export const actualizarFotoReques= async(file)=>{
  const response = await axios.put(`/usuarios/editar/foto`,file)
  return response.data
}