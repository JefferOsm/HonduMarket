import React from "react"
import { useEffect } from "react";
import {useForm} from 'react-hook-form';
import { usarAutenticacion } from "../context/autenticacion";
import { Link, useNavigate } from "react-router-dom";


function LoginPage() {
  const {register, handleSubmit, formState:{errors}} = useForm();
  const {login,autenticado,erroresAut} = usarAutenticacion();
  const navegacion = useNavigate();

  const peticion= handleSubmit(async (values) => {
    login(values)
    console.log(values)
  })

  useEffect(()=>{
    if(autenticado){
    navegacion('/')
    }
  },[autenticado])


  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-md-4 mx-auto align-middle ">
          <div className="card bc-degrate text-light shadow">
            <div className="card-body">
            {
                erroresAut.map((error, i)=>(
                  <div className="bg-danger p-2 text-light" key={i}>
                    {error}
                  </div>
                ))
            }
              <form className="px-4 py-3" onSubmit={peticion}>
                <h2 className="text-center fw-bold">Inicia Sesión</h2>

                <div className="mb-3">
                    <label  className="form-label">Correo</label>
                    <input type="email" className="form-control" id="correo" 
                    placeholder="Correo@example.com" {...register('correo',{required:true})} />
                </div>

                {
                      errors.correo && (
                        <p className="text-danger">El Correo es Obligatorio</p>
                      )
                }

                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="pass" 
                    placeholder="Contraseña" {... register('pass', {required:true})} />
                </div>

                {
                      errors.pass && (
                        <p className="text-danger">La Contraseña es Obligatoria</p>
                      )
                }
                  <button type="submit" className="btn fw-bold bc-secondary">Iniciar sesión</button>
              </form>

              <div className="dropdown-divider"></div>
              <p style={{marginLeft: "30px"}}><a>Nuevo por aquí? </a><Link to='/registro' className="link-info fw-bold">Inscribirse</Link></p> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
