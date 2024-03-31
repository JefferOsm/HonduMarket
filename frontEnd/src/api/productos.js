
import axios from "./axios";

export const obtenerCategoriasRequest = async () => {
  const response = await axios.get(`/productos/categorias`);
  return response.data;
};

export const obtenerPublicacionesUsuario = async () => {
  const response = await axios.get(`/productos/publicaciones`);
  return response.data;
};

export const obtenerPublicacionesHome = async () => {
  const response = await axios.get(`/productos/publicacionesinicio`);
  return response.data;
};

export const obtenerPublicacionesHomeAuth = async () => {
  const response = await axios.get(`/productos/publicacionesinicioAuth`);
  return response.data;
};

export const obtenerDepartamentosRequest = async () => {
  const response = await axios.get(`/productos/departamentos`);
  return response.data;
};

export const obtenerEstadosRequest = async () => {
  const response = await axios.get(`/productos/estados`);
  return response.data;
};

export const agregarPublicacionReques = async (values) => {
  const response = await axios.post(`/productos/publicar`, values);
  return response.data;
};

export const videoPublicacionRequest = async (id, values) => {
  const response = await axios.put(`/productos/video/${id}`, values);
  return response.data;
};

export const obtenerDetallePublicacion = async (id) => {
  const response = await axios.get(`/productos/publicaciones/detalle/${id}`);
  return response.data;
};

export const obtenerImagenesPublicacion = async (id) => {
  const response = await axios.get(
    `/productos/publicaciones/detalle/imagenes/${id}`
  );
  return response.data;
};

export const detalleUsuarioRequest = async (id) => {
  const response = await axios.get(`/usuarios/detalle/${id}`);
  return response.data;
};

export const agregarCalificacionRequest = async (values) => {
  const response = await axios.post(`/usuarios/calificacion/`, values);
  return response.data;
};

export const editarCalificacionRequest = async (values) => {
  const response = await axios.put(`/usuarios/editarComentario/`, values);
  return response.data;
}

export const obtenerCalificacionesRequest = async (id) => {
  const response = await axios.get(`/usuarios/promedio-calificaciones/${id}`);
  return response.data;
}

export const obtenerComentariosRequest = async (id) => {
  const response = await axios.get(`/usuarios/comentarios/${id}`);
  return response.data;
};

export const obtenerPublicacionesBusqueda = async () => {
  const response = await axios.get(`/productos/publicaciones/busqueda`);
  return response.data;
};

export const buscarProductos = async (searchTerm) => {
  const response = await axios.get(`/productos/buscar?searchTerm=${searchTerm}`);
  return response.data;
};

export const agregarListaDeseo = async(id)=>{
  const response = await axios.post(`/productos/lista_deseos/insertar/${id}`)
  return response.data
}

export const obtenerListaDeseosRequest= async()=>{
  const response= await axios.get('/productos/lista_deseos');
  return response.data
}

export const validarListaDeseoRequest= async(id)=>{
  const response= await axios.get(`/productos/lista_deseo/validar/${id}`);
  return response.data
}

export const eliminarPublicacionRequest = async(id)=>{
  const response= await axios.delete(`/productos/publicacion/eliminar/${id}`);
  return response.data
}

