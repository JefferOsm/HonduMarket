import React, { useEffect, useState } from "react"
import {useForm} from 'react-hook-form';
import { usarAutenticacion } from "../context/autenticacion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ConditionsModel from "../components/conditionsModel";

function RegistroPage() {

  //funcionalidades para el modal de terminos
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  
  //Funcionalidades para el Registro
  const {register, handleSubmit,watch, formState:{errors}} = useForm();
  const password = watch('pass');
  const {registro,autenticado,erroresAut} = usarAutenticacion();
  const navegacion = useNavigate();

  //si se autentica mandar a Home
   useEffect(()=>{
     if(autenticado){
       navegacion('/')
     }
   },[autenticado])


  //Peticion Al Backend
  const peticion= handleSubmit(async (values) => {
    console.log(values)
    registro(values)
  })

  //Aceptar terminos
  const [isAcept, setIsAcept] = useState(false);
  const comprobarCheck = () => {
    setIsAcept(!isAcept);
  };

  return (
    <>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-8 mx-auto align-middle ">
            <div className="card text-light bc-degrate shadow">
              <div className="card-body">
                {
                  Array.isArray(erroresAut) && erroresAut.map((error, i) =>(
                    <div className="bg-danger p-2 text-light" key={i}>
                      {error}
                    </div>
                  ))
                }
                <form className="row g-3 px-4 py-3" 
                  onSubmit={peticion}
                >
                    <h2 className='text-center fw-bold'>Crear cuenta</h2>
                    <div className="row g-3">
                      
                      <div className="col">
                        <label className="form-label">Nombre Completo</label>
                        <input type="text" className="form-control" 
                        placeholder="Nombre Completo" aria-label="Nombre" {... register ('nombre', {required:true})}/>
                      </div>
                      
                      {
                        errors.nombre && (
                          <p className="text-danger">El Nombre es Obligatorio</p>
                        )
                      }
                      
                      <div className="col-12">
                      <label className="form-label">Dirección</label>
                        <input type="text" className="form-control" 
                        placeholder="colonia, calle principal Ave 123" {... register('direccion',{required:true})} />
                      </div>

                      {
                        errors.direccion && (
                          <p className="text-danger">La Direccion es Obligatorio</p>
                        )
                      }

                      <div className="col-12">
                        <label className="form-label">Número de teléfono:</label>
                        <input className="form-control" maxLength={8}  placeholder="Número de teléfono: Ej 88121502" 
                        {... register('telefono', {required:true, maxLength:8})} pattern="[0-9]*" />
                      </div>

                      {
                        errors.telefono && (
                          <p className="text-danger">El Telefono es Obligatorio </p>
                        )
                      }

                      <div className="col">
                        <label className="form-label">Nombre de Usuario: </label>
                        <div className="input-group">
                          <div className="input-group-text">@</div>
                          <input type="text" className="form-control text-dark" 
                          placeholder="Nombre de Usuario" {... register('username', {required:true})} />
                        </div>
                      </div>

                      {
                        errors.username && (
                          <p className="text-danger">El Nombre de Usuario es Obligatorio</p>
                        )
                      }
                      </div>

                    <div className="d-flex justify-content-between  direct-flex-row">
                      {/* Correo */}
                      <div className="w-100 ">
                        <label className="form-label">Correo Electrónico</label>
                        <input type="email" className="form-control" placeholder="Correo@example.com"
                        {...register('correo',{required:true})} />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between  direct-flex-row">
                    {/* Contraseña */}
                    <div className="w-50 ">
                        <label className="form-label">Contraseña</label>
                        <input type="password" minLength={5} className="form-control text-dark" placeholder="Ej fsdqn"
                        {... register('pass', {required:true,minLength:5})}/>
                      </div>
                      </div>
                    {/* Confirmación de contraseña */}
                    <div className="d-flex justify-content-between  direct-flex-row">
                    <div className="w-50 ">
                      <label className="form-label">Confirmar contraseña</label>
                      <input type="password" className="form-control text-dark" placeholder="Confirmar contraseña"
                      {...register('confirmPass', {
                        required: 'Debes confirmar tu contraseña',
                        validate: value =>
                          value === password || 'Las contraseñas no coinciden'
                      })}/>
                      <p className="text-info mt-1">Debe ser de mínimo de 5 Caracteres</p>
                      {errors.confirmPass && <p className="text-danger mt-1">{errors.confirmPass.message}</p>}
                    </div>
                    </div>

                    {
                        errors.correo && (
                          <p className="text-danger">El Correo es Obligatorio</p>
                        )
                    }
                    
                    {
                        errors.pass && (
                          <p className="text-danger">La Contraseña es Obligatoria y Debe ser de mas de 5 Caracteres</p>
                        )
                    }

                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="dropdownCheck"
                          checked={isAcept}
                          onChange={comprobarCheck}
                        />
                        <label className="form-check-label"  htmlFor="dropdownCheck">
                          Acepta los <a href="#" className="link-info" onClick={handleShow}>terminos y condiciones</a>  
                        </label>
                    </div>
                    
                    <div className="col-12">
                      <button type="submit" className="btn bc-secondary " disabled={!isAcept}>Crear Cuenta</button>
                    </div>
                    
                    <p><a>Ya tienes una cuenta? </a><Link to='/login' className="link-info fw-bold">Inicia Sesion</Link></p> 
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConditionsModel show={show} handleClose={handleClose} />
    </>
  )
}

export default RegistroPage
