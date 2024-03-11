import axios from "./axios";

export const obtenerCategoriasRequest = async()=>{
    const response = await axios.get(`/productos/categorias`)
    return response.data
}

export const obtenerPublicacionesUsuario = async()=>{
    const response= await axios.get(`/productos/publicaciones`);
    return response.data;
}

export const obtenerDepartamentosRequest = async()=>{
    const response = await axios.get(`/productos/departamentos`);
    return response.data;
}

export const obtenerEstadosRequest = async()=>{
    const response = await axios.get(`/productos/estados`);
    return response.data;
}

export const agregarPublicacionReques = async(values)=>{
    const response = await axios.post(`/productos/publicar`, values);
    return response.data;
}