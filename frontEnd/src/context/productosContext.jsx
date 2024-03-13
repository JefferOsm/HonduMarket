import { createContext, useContext, useState } from "react";
import { obtenerCategoriasRequest, obtenerPublicacionesUsuario, obtenerDepartamentosRequest,
        obtenerEstadosRequest, 
        agregarPublicacionReques,
        videoPublicacionRequest} from "../api/productos";


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
    const [departamentos, setDepartamentos]= useState([]);
    const [estados, setEstados] = useState([]);


    const obtenerCategorias= async()=>{
        try {
            const response= await obtenerCategoriasRequest();
            setCategorias(response)
            // console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerPublicaciones = async()=>{
        try {
            const response= await obtenerPublicacionesUsuario();
            console.log(response)
            setPublicacionesUser(response)
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

    const agregarPublicacion = async(values)=>{
        try {
            const response= await agregarPublicacionReques(values)
            //console.log(response)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    const subirVideoPublicacion = async(id,values)=>{
        try {
            const response = await videoPublicacionRequest(id,values);
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <ProductosContext.Provider value={{
          obtenerCategorias,
          categorias,
          obtenerPublicaciones,
          publicacionesUser,
          obtenerDepartamentos,
          obtenerEstados,
          estados,
          departamentos,
          agregarPublicacion,
          subirVideoPublicacion,
        }}>
            {children}
        </ProductosContext.Provider>
    )
}