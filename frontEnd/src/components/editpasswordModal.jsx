import React, { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';   
import { usarAutenticacion } from '../context/autenticacion'; 

    
function EditpasswordModal({ show, handleClose }) {
    const {register, handleSubmit, formState:{errors}} = useForm();
    const {actualizarPassword, erroresAut} = usarAutenticacion();
    const [error,setError] = useState([]);

    //Timer para error
    useEffect(() => {
      if (error.length > 0) {
        const timer = setTimeout(() => {
          setError([]);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [error]);

  //Realizar peticion al backend
   const peticion= handleSubmit(async (values)=>{
    // console.log(values) Ver valores
    if(values.passNuevo != values.passNuevoConf){
      setError(['La nueva contraseña no Coincide'])
    }
    else{
      const res= await actualizarPassword(values);
      if(res){
        window.alert('Cambio Realizado Exitosamente');
        handleClose();
      }
    }})

  
    return (
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton className="bc-degrate">
          <Modal.Title className="fw-bold text-light">
            Cambiar Contraseña
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bc-primary text-light justify">

          {erroresAut.map((error, i) => (
            <div className="bg-danger p-2 text-light" key={i}>
              {error}
            </div>
          ))}

          {error.map((error, i) => (
            <div className="bg-danger p-2 text-light" key={i}>
              {error}
            </div>
          ))}
          
          <form className="px-4 py-3" onSubmit={peticion}>
            <div className="mb-3">
              <label className="form-label">Contraseña Actual</label>
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña Actual"
                aria-label="Contraseña Actual"
                {...register("passActual", { required: true })}
              />
            </div>
            {errors.passActual && (
              <p className="text-danger">El Campo es Obligatorio</p>
            )}

            <div className="mb-3">
              <label className="form-label">Nueva Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nueva Contraseña"
                aria-label="Nueva Contraseña"
                {...register("passNuevo", { required: true })}
              />
            </div>

            {errors.passNuevo && (
              <p className="text-danger">El Campo es Obligatorio</p>
            )}

            <div className="mb-3">
              <label className="form-label">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirmar Nueva Contraseña"
                aria-label="Confirmar Nueva Contraseña"
                {...register("passNuevoConf", { required: true })}
              />
            </div>

            {errors.passNuevoConf && (
              <p className="text-danger">El Campo es Obligatorio</p>
            )}

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Cambiar
              </button>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
  
  export default EditpasswordModal;