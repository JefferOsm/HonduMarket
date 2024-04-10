import { createContext, useContext, useState, useEffect } from "react";
import { obtenerCategoriasRequest, obtenerPublicacionesUsuario,obtenerPublicacionesHome, obtenerDepartamentosRequest,
        obtenerEstadosRequest, 
        agregarPublicacionReques,
        videoPublicacionRequest,
        obtenerDetallePublicacion,
        obtenerImagenesPublicacion,
        detalleUsuarioRequest,
        obtenerPublicacionesBusqueda,
        buscarProductos,
        obtenerPublicacionesHomeAuth,
        agregarListaDeseo,
        obtenerListaDeseosRequest,
        validarListaDeseoRequest,
        eliminarPublicacionRequest,
        obtenerCalificacionesRequest,
        agregarCalificacionRequest,
        obtenerComentariosRequest,
        editarCalificacionRequest,
        editarPublicacionRequest,
        eliminarImagenProdReq,
        cambiarEstadoPublicacionRequest,
        agregarCalificacionProductoRequest,
        editarCalificacionProductoRequest,
        obtenerCalificacionesProductoRequest,
        obtenerComentariosProductoRequest,
    } from "../api/productos";


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


    //total de categorias
    const [categorias, setCategorias]= useState([]);
    //publicaciones del usuario logeado
    const [publicacionesUser, setPublicacionesUser]= useState([]);
    //publicaciones usadas para el carousel de Home
    const [publicacionesHome, setPublicacionesHome]= useState([]);
    //total de departamentos
    const [departamentos, setDepartamentos]= useState([]);
    //info de estados
    const [estados, setEstados] = useState([]);
    //detalles del producto
    const [detailProduct, setDetailProduct]= useState([]);
    //Agregar calificacion a un usuario
    const [calificacion, setCalificacion]= useState([]);
    //Editar calificacion de un usuario
    const [editarCalifi, setEditarCalificacion]= useState([]);
    //calificaciones promedio de un usuario
    const [calificaciones, setCalificaciones]= useState([]);
    //obtener comentarios de un usuario
    const [comentarios, setComentarios]= useState([]);
    //imagenes del producto
    const [imagenesProduct, setImagenesProduct]= useState([]);
    //video del producto(si hay)
    const [videoProduct, setVideoProduct]= useState([]);
    //informacion del usuario que subiio el producto
    const [usuarioProduct, setUsuarioProduct]= useState([]);
    //Productos totales para Sugerencia
    const [productosBusqueda, setProductosBusqueda]=useState([]);
    //Publicaciones encontradas
    const [publicacionesBusqueda, setPublicacionesBusqueda]= useState([]);
    //mensajes de lista de deseo
    const[mensajeDeseo,setMensajeDeseo]= useState([]);
    //validacion de lista de deseo
    const[validarLista,setValidarLista]= useState([]);
    //editar publicacion
    const [editPublicacion, setEditarPublicacion] = useState([]);
    //Cambiar estado de la publicacion
    const [cambiarEstado, setCambiarEstado] = useState([]);
    //calificacion de un producto
    const [calificacionProducto, setCalificacionProducto]= useState([]);
    //editar calificacion de un producto
    const [editarCalificacionProductos, setEditarCalificacionProducto]= useState([]);
    //calificaciones promedio de un producto
    const [calificacionesProducto, setCalificacionesProducto]= useState([]);
    //obtener comentarios de un producto
    const [comentariosProducto, setComentariosProducto]= useState([]);


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
            console.log(response)
            setPublicacionesUser(response)
        } catch (error) {
            console.log(error)
        }
    }
    //publicaciones de sugerencia en la pagina home
    const obtenerPublicacionesInicio = async()=>{
        try {
            const response= await obtenerPublicacionesHome();
            console.log(response)
            setPublicacionesHome(response)
        } catch (error) {
            console.log(error)
        }
    }
    //publicaciones de sugerencia en la pagina home distintas a mis publicaciones
    const obtenerPublicacionesInicioAuth = async()=>{
        try {
            const response= await obtenerPublicacionesHomeAuth();
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
    //Editar Publicacion
    const editarPublicacion = async (id, values) => {
        try {
          const response = await editarPublicacionRequest(id, values);
          setEditarPublicacion(response);
          console.log(response)
          return response;
        } catch (error) {
          console.log(error);
        }
      };

    //Eliminar Publicacion
    const eliminarPublicacion = async(id)=>{
        try {
            const response= await eliminarPublicacionRequest(id);
            console.log(response)
            window.location.href= '/perfil/publicaciones'
        } catch (error) {
            console.log(error)
        }
    }

    //subir el video de la publicacion
    const subirVideoPublicacion = async(id,values)=>{
        try {
            const response = await videoPublicacionRequest(id,values);
            //console.log(response);
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
           console.log(response)
            setUsuarioProduct(response)
        } catch (error) {
            console.log(error)
        }
    }

    //Agregar calificacion a un usuario
    const agregarCalificacion = async(values)=>{
        try {
            const response = await agregarCalificacionRequest(values);
            //console.log(response)
            setCalificacion(response)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    //editar calificacion de un usuario
    const editarCalificacion = async(values)=>{
        try {
            const response = await editarCalificacionRequest(values);
            //console.log(response)
            setEditarCalificacion(response)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    //Obtener califiaciones de un usuario
    const obtenerCalificaciones = async(id)=>{
        try {
            const response = await obtenerCalificacionesRequest(id);
            //console.log(response)
            setCalificaciones(response)

            return response
        } catch (error) {
            console.log(error)
        }

    }

    //Obtener comentarios de un usuario
    const obtenerComentarios = async(id)=>{
        try {
            const response = await obtenerComentariosRequest(id);
            //console.log(response)
            setComentarios(response)

            return response
        } catch (error) {
            console.log(error)
        }
    }



// Publicaciones para sugerencias
    const obtenerPublicacionesSearch= async()=>{
        try {
            const response= await obtenerPublicacionesBusqueda();
            //console.log(response)
            setProductosBusqueda(response);
        } catch (error) {
            console.log(error)
        }
    }

    //Publicaciones de la busqueda
    const obtenerPublicacionesResult = async()=>{
        try {
            const response= await buscarProductos();
            console.log(response)
            setPublicacionesBusqueda(response)
        } catch (error) {
            console.log(error)
        }
    }


    //Agregar a lista de deseos
    const agregarListaDeseos = async(id)=>{
        try {
            const response = await agregarListaDeseo(id);
            //console.log(response)
            setMensajeDeseo(response);
        } catch (error) {
            console.log(error)
        }
    }
    //traer las publicaciones de mi lista de deseos
    const obtenerListaDeseos= async()=>{
        try {
            const response= await obtenerListaDeseosRequest();
            setPublicacionesUser(response);
        } catch (error) {
            console.log(error)
            
        }
    }
    //validar mi lista de deseos
    const validarListaDeseo= async(id)=>{
        try {
            const response= await validarListaDeseoRequest(id);
            //console.log(response)
            setValidarLista(response)
        } catch (error) {
            console.log(error)
            
        }
    };

       //validar mi lista de deseos
       const eliminarImagenProd= async(id)=>{
        try {
            const response= await eliminarImagenProdReq(id);
            console.log(response)
        } catch (error) {
            console.log(error)
            
        }
    }

    //Cambiar estado de la publicacion
    const cambiarEstadoPublicacion = async(id,estado)=>{
        try {
            const response= await cambiarEstadoPublicacionRequest(id,estado);
            console.log(response)
            setCambiarEstado(response)
        } catch (error) {
            console.log(error)
        }
    }
    
    
        //Eliminar los mensajes despues de 3 segundos
        useEffect(()=>{
            if (mensajeDeseo.length > 0){
                const timer = setTimeout(() => {
                    setMensajeDeseo([])
                }, 3000);
    
                return () => clearTimeout(timer)
            }
        },[mensajeDeseo])
        
        
    
    // Agregar calificacion a un producto
    const agregarCalificacionProducto = async(values)=>{
        try {
            const response = await agregarCalificacionProductoRequest(values);
            setCalificacionProducto(response)
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    // Editar calificacion de un producto
    const editarCalificacionProducto = async(values)=>{
        try {
            const response = await editarCalificacionProductoRequest(values);
            setEditarCalificacionProducto(response)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    // Obtener califiaciones de un producto
    const obtenerCalificacionesProducto = async(id)=>{
        try {
            const response = await obtenerCalificacionesProductoRequest(id);
            setCalificacionesProducto(response)
            //console.log(response)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    // Obtener comentarios de un producto
    const obtenerComentariosProducto = async(id)=>{
        try {
            const response = await obtenerComentariosProductoRequest(id);
            setComentariosProducto(response)
            return response
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
          eliminarPublicacion,
          subirVideoPublicacion,
          obtenerPublicacionesInicioAuth,
          obtenerDetalles,
          detailProduct,
          obtenerImagenes,
          imagenesProduct,
          videoProduct,
          usuarioProduct,
          obtenerUsuario,
          obtenerPublicacionesSearch,
          productosBusqueda,
          obtenerPublicacionesResult,
          publicacionesBusqueda,
          agregarListaDeseos,
          mensajeDeseo,
          obtenerListaDeseos,
          validarListaDeseo,
          validarLista,
          obtenerCalificaciones,
          calificaciones,
          obtenerComentarios,
          comentarios,
          agregarCalificacion,
          calificacion,
          editarCalificacion,
          editarCalifi,
          editarPublicacion,
          editPublicacion,
          eliminarImagenProd,
          cambiarEstado,
          cambiarEstadoPublicacion,
            obtenerCalificacionesProducto,
            obtenerComentariosProducto,
            agregarCalificacionProducto,
            editarCalificacionProducto,
            calificacionProducto,
            calificacionesProducto,
            comentariosProducto,
            editarCalificacionProductos
        }}>
            {children}
        </ProductosContext.Provider>
    )
}