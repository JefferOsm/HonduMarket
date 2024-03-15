import { createContext, useContext, useState } from "react";
import { obtenerCategoriasRequest, obtenerPublicacionesUsuario,obtenerPublicacionesHome, obtenerDepartamentosRequest,
        obtenerEstadosRequest, 
        agregarPublicacionReques,
        videoPublicacionRequest,
        obtenerDetallePublicacion,
        obtenerImagenesPublicacion,
        detalleUsuarioRequest} from "../api/productos";


export const ProductosContext= createContext();

//Usar Contexto
export const usarProductosContex= ()=>{
    const contexto = useContext(ProductosContext)
    if(!contexto){
        throw new Error('usarAutenticacion debe estar en un AutenticacionProvider')
    }
    return contexto
}

export const ProductosProvider = ({children})=>{
    const [categorias, setCategorias]= useState([]);
    const [publicacionesUser, setPublicacionesUser]= useState([]);
    const [publicacionesHome, setPublicacionesHome]= useState([]);
    const [departamentos, setDepartamentos]= useState([]);
    const [estados, setEstados] = useState([]);
    const [detailProduct, setDetailProduct]= useState([])
    const [imagenesProduct, setImagenesProduct]= useState([])
    const [videoProduct, setVideoProduct]= useState([])
    const [usuarioProduct, setUsuarioProduct]= useState([])

    const obtenerCategorias= async()=>{
        try {
            const response= await obtenerCategoriasRequest();
            setCategorias(response)
            // console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    //Publicaciones del usuario
    const obtenerPublicaciones = async()=>{
        try {
            const response= await obtenerPublicacionesUsuario();
            //console.log(response)
            setPublicacionesUser(response)
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerPublicacionesInicio = async()=>{
        try {
            const response= await obtenerPublicacionesHome();
            console.log(response)
            setPublicacionesHome(response)
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerDepartamentos = async()=>{
        try {
            const response = await obtenerDepartamentosRequest();
            setDepartamentos(response);
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerEstados = async()=>{
        try {
            const response= await obtenerEstadosRequest();
            setEstados(response);
        } catch (error) {
            console.log(error)
        }
    }

    // publicar algo
    const agregarPublicacion = async(values)=>{
        try {
            const response= await agregarPublicacionReques(values)
            //console.log(response)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    //subir el video de la publicacion
    const subirVideoPublicacion = async(id,values)=>{
        try {
            const response = await videoPublicacionRequest(id,values);
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }

    //obtener los detalles de un producto(publicacion)
    const obtenerDetalles = async(id)=>{
        try {
            const response = await obtenerDetallePublicacion(id);
            //console.log(response)
            setDetailProduct(response)
        } catch (error) {
            console.log(error)
        }
    }

    //obtener imagenes y videos de una publicacion
    const obtenerImagenes = async(id)=>{
        try {
            const response = await obtenerImagenesPublicacion(id)
            //console.log(response)
            const imagenes =response.filter(item => item.id_imagen != null)
            const video = response.filter(item => item.id_video != null)

            setImagenesProduct(imagenes)
            setVideoProduct(video)
        } catch (error) {
            console.log(error)
        }
    }

    //Obtener datos del usuario
    const obtenerUsuario = async(id)=>{
        try {
            const response = await detalleUsuarioRequest(id)
           // console.log(response)
            setUsuarioProduct(response)
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <ProductosContext.Provider value={{
          obtenerCategorias,
          categorias,
          obtenerPublicaciones,
          obtenerPublicacionesInicio,
          publicacionesUser,
          publicacionesHome,
          obtenerDepartamentos,
          obtenerEstados,
          estados,
          departamentos,
          agregarPublicacion,
          subirVideoPublicacion,
          obtenerDetalles,
          detailProduct,
          obtenerImagenes,
          imagenesProduct,
          videoProduct,
          usuarioProduct,
          obtenerUsuario,
        }}>
            {children}
        </ProductosContext.Provider>
    )
}