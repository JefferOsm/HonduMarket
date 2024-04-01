import { createContext,useState,useContext, useEffect } from "react";
import { obtenerConvGenReq, obtenerConvProdReq, obtenerConversaciones, obtenerUsuariosReq } from "../api/chat";

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

    const obtenerUsuarios= async()=>{
        try {
            const response= await obtenerUsuariosReq();
            return response
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerConvProd= async()=>{
        try {
            const response= await obtenerConvProdReq();
            return response
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerConvGen= async()=>{
        try {
            const response= await obtenerConvGenReq();
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <ChatContext.Provider value={{
            obtenerConversacion,
            conversacion,
            obtenerUsuarios,
            obtenerConvProd,
            obtenerConvGen,

        }}>
            {children}
        </ChatContext.Provider>
    )
}