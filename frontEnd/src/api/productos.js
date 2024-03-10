import axios from "./axios";

export const obtenerCategoriasRequest = async()=>{
    const response = await axios.get(`/productos/categorias`)
    return response.data
}

export const obtenerPublicacionesUsuario = async()=>{
    const response= await axios.get(`/productos/publicaciones`);
    return response.data;
}