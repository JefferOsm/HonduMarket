/* eslint-disable no-unused-vars */
import { createContext,useState,useContext, useEffect } from "react";
import { borrarCanalReq, crearCanalReq, enviarMsjProdReq, mensajesCanalReq, obtenerCanalesReq, obtenerConvGenReq, obtenerConvProdReq, obtenerConversaciones, obtenerTodosCanalesReq, obtenerUsuariosReq, obtenermsjGeneralReq, seguirCanalReq } from "../api/chat";

export const ChatContext= createContext();

//Usar Contexto
export const usarChatContext = () =>{
    const contexto = useContext(ChatContext)
    if(!contexto){
        throw new Error('usarChat debe estar en un AutenticacionProvider')
    }
    return contexto
};


//Componente para englobar a otros
export const ChatProvider = ({children}) =>{
    const [conversacion, setConversacion]= useState([]);
    const [socket,setSocket]= useState(null)

    //obtener msj de una conversacion de productos
    const obtenerConversacion= async(data)=>{
        try {
            const response= await obtenerConversaciones(data);
            //console.log(response)
            setConversacion(response);
            return response;
        } catch (error) {
            console.log(error)
            return;
        }
    }
    //usuarios disponibles para chatear
    const obtenerUsuarios= async()=>{
        try {
            const response= await obtenerUsuariosReq();
            return response
        } catch (error) {
            console.log(error)
        }
    }

    //conversaciones realizadas sobre productos
    const obtenerConvProd= async()=>{
        try {
            const response= await obtenerConvProdReq();
            return response
        } catch (error) {
            console.log(error)
        }
    }

    //conversaciones generales de usuario a usuario
    const obtenerConvGen= async()=>{
        try {
            const response= await obtenerConvGenReq();
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    //mensajes de una conversacion general de usuario a usuario
    const obtenerMsjGeneral= async(data)=>{
        try {
            const response= await obtenermsjGeneralReq(data);
            //console.log(response)
            return response;
        } catch (error) {
            console.log(error)
            return;
        }
    }

    const crearCanal= async(data)=>{
        try {
            const response= await crearCanalReq(data);
            window.alert(response.mensaje)
            return response;
        } catch (error) {
            console.log(error)
            return;
        }
    }

    const obtenerCanales= async()=>{
        try {
            const response= await obtenerCanalesReq();
            return response;
        } catch (error) {
            console.log(error)
            return;
        }
    }

    const obtenerTodosCanales= async()=>{
        try {
            const response= await obtenerTodosCanalesReq();
            //console.log(response)
            return response;
        } catch (error) {
            console.log(error)
            return;
        }
    }

    const seguirCanal= async(id)=>{
        try {
            const response= await seguirCanalReq(id);
            return response;
        } catch (error) {
            console.log(error)
            return;
        }
    }

    const borrarCanal= async(id)=>{
        try {
            const msg = window.confirm('Estas seguro de borrar el canal?')
            if(msg){
                const response= await borrarCanalReq(id);
                return response;
            }
        } catch (error) {
            console.log(error)
            return;
        }
    }

    const mensajesCanal= async(id)=>{
        try {
            const response= await mensajesCanalReq(id);
            return response;
        } catch (error) {
            console.log(error)
            return;
        }
    }

    const enviarMensajeProd= async(data)=>{
        try {
            const response= await enviarMsjProdReq(data);
            console.log(response)
            return response;
        } catch (error) {
            console.log(error)
            return;
        }
    }

    return(
        <ChatContext.Provider value={{
            obtenerConversacion,
            obtenerMsjGeneral,
            conversacion,
            obtenerUsuarios,
            obtenerConvProd,
            obtenerConvGen,
            crearCanal,
            obtenerCanales,
            obtenerTodosCanales,
            seguirCanal,
            borrarCanal,
            mensajesCanal,
            enviarMensajeProd

        }}>
            {children}
        </ChatContext.Provider>
    )
}