import { createContext,useState,useContext, useEffect } from "react";
import { obtenerConversaciones } from "../api/chat";

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

    return(
        <ChatContext.Provider value={{
            obtenerConversacion,
            conversacion,

        }}>
            {children}
        </ChatContext.Provider>
    )
}