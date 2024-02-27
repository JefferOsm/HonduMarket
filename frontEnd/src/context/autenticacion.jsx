import { createContext,useState,useContext, useEffect } from "react";
import {registroRequest, loginRequest, verificarTokenRequest, actualizarUsuarioRequest, eliminarUsuarioRequest, actualizarFotoReques} from '../api/auth/registrar'
import Cookies from 'js-cookie';

export const AutenticacionContext = createContext()

//Usar Contexto
export const usarAutenticacion = () =>{
    const contexto = useContext(AutenticacionContext)
    if(!contexto){
        throw new Error('usarAutenticacion debe estar en un AutenticacionProvider')
    }
    return contexto
}

//Componente para englobar a otros
export const AutenticacionProvider = ({children}) =>{
    //usuario a ser leido en todo el sistema
    const [usuario, setUsuario] = useState(null);
    const [autenticado,setAutenticado]= useState(false);
    const [erroresAut, setErroresAut]= useState([]);
    const [loading, setLoading]= useState(true)
    const [passw,setPassw] = useState(null)

    //Peticion para el registro de usuarios
    const registro = async (user) => {
        try {
            const response = await registroRequest(user);
            console.log(response);
            setUsuario(response);
            setAutenticado(true);
            setPassw(user.pass)
        } catch (error) {
            setErroresAut(error.response.data)
        }
    }

    //peticion para el logueo de usuarios
    const login = async (user) => {
        try {
            const response = await loginRequest(user);
            // console.log(response);
            setUsuario(response);
            setAutenticado(true);
            setPassw(user.pass)
        } catch (error) {
            setErroresAut(error.response.data)
        }
    }

    //Actualizar Datos
    const actualizarUsuario= async(user)=>{
        try {
            console.log(user)
            const response = await actualizarUsuarioRequest(user);
            setUsuario(response);
            setPassw(user.pass)
            // console.log(response)
            setAutenticado(true);
            return true
        } catch (error) {
            setErroresAut(error.response.data)
            return false
        }
    }

    //Eliminar Cuenta
    const eliminarUsuario = async()=>{
        try {
            const response= await eliminarUsuarioRequest();
            console.log(response)
            Cookies.remove('token');
            setAutenticado(false)
            setUsuario(null)
            setPassw(null)
        } catch (error) {
            setErroresAut(error.response.data)
        }
    }

    //Almacenar foto perfil
    const fotoPerfil = async(file)=>{
        try {
            const response= await actualizarFotoReques(file)
            setUsuario(response)
        } catch (error) {
            console.log(error)
        }
    }

    //Cerrar Sesino
    const logout = async()=>{
        Cookies.remove('token');
        setAutenticado(false)
        setUsuario(null)
        setPassw(null)
    }

    //Eliminar los errores despues de 5 segundos
    useEffect(()=>{
        if (erroresAut.length > 0){
            const timer = setTimeout(() => {
                setErroresAut([])
            }, 5000);

            return () => clearTimeout(timer)
        }
    },[erroresAut])

    //Cargar la cookie con el token de usuario y verificar si esta autenticado
    //cada vez que carga la pagina
    useEffect(()=>{
        async function comprobarLogin() {
            const cookies= Cookies.get();

            //Comprobar si hay un token guardado
            if(!cookies.token){
                setAutenticado(false);
                setUsuario(null);
                setPassw(null)
                setLoading(false);
                return;
            }
            //si hay token verificar en el backend si existe el usuario
            try {
                const response = await verificarTokenRequest(cookies.token);
                if(!response) {
                    setAutenticado(false);
                    setLoading(false);
                    return;
                } 

                setAutenticado(true);
                setUsuario(response);
                setLoading(false);
            } catch (error) {
                
                setAutenticado(false);
                setUsuario(null);
                setLoading(false);
            }
        }
        comprobarLogin();
    },[])
    
    return(
        <AutenticacionContext.Provider value={{
            registro,
            login,
            usuario,
            loading,
            logout,
            actualizarUsuario,
            autenticado,
            eliminarUsuario,
            fotoPerfil,
            passw,
            erroresAut
        }}>
            {children}
        </AutenticacionContext.Provider>
    )
}