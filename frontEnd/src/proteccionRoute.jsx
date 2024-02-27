import React from 'react'
import { usarAutenticacion } from './context/autenticacion'
import { Navigate, Outlet } from 'react-router-dom';


function ProteccionRoute() {
    const {loading,usuario,autenticado}=  usarAutenticacion();

    if(loading) return <h1>loading ...</h1>
    if(!loading && !autenticado){
        return <Navigate to='/login' replace></Navigate>
    }

  return (
    <Outlet/>
  )
}

export default ProteccionRoute