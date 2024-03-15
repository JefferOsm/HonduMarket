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

export const videoPublicacionRequest = async(id,values)=>{
    const response= await axios.put(`/productos/video/${id}`,values)
    return response.data;
}

export const obtenerDetallePublicacion = async(id)=>{
    const response = await axios.get(`/productos/publicaciones/detalle/${id}`)
    return response.data
}

export const obtenerImagenesPublicacion = async(id)=>{
    const response= await axios.get(`/productos/publicaciones/detalle/imagenes/${id}`)
    return response.data
}