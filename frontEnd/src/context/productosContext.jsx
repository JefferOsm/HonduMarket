import { createContext, useContext, useState } from "react";
import { obtenerCategoriasRequest, obtenerPublicacionesUsuario } from "../api/productos";


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


    return(
        <ProductosContext.Provider value={{
          obtenerCategorias,
          categorias,
          obtenerPublicaciones,
          publicacionesUser,
        }}>
            {children}
        </ProductosContext.Provider>
    )
}