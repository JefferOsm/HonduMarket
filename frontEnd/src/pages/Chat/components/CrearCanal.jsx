/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import {useForm} from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';   
import { usarAutenticacion } from '../../../context/autenticacion'; 
import { usarChatContext } from '../../../context/chatContext';


function CrearCanal({show,handleClose}) {
    const {register, handleSubmit, formState:{errors}, reset} = useForm();
    const {crearCanal}= usarChatContext()

    const peticion=handleSubmit(async(data)=>{

        const formData= new FormData();
        formData.append('image',data.imagen[0])
        formData.append('nombre', data.nombre)
        formData.append('descripcion', data.descripcion)
        
        console.log(formData)
        await crearCanal(formData)

        handleClose()
        reset()
        
    })


    
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton className="bc-degrate">
          <Modal.Title className="fw-bold text-light">
            Crear Canal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bc-primary text-light justify">
          
          <form className="px-4 py-3" onSubmit={peticion}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                placeholder="Nombre"
                aria-label="Nombre"
                {...register("nombre", { required: true })}
              />
            </div>
            {errors.nombre && (
              <p className="text-danger">El Campo es Obligatorio</p>
            )}

            <div className="mb-3">
              <label className="form-label">Descripcion</label>
              <textarea
                className="form-control"
                placeholder="Descripcion"
                aria-label="Descripcion"
                {...register("descripcion", { required: true })}
              />
            </div>

            {errors.descripcion && (
              <p className="text-danger">El Campo es Obligatorio</p>
            )}

            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input
                type="file"
                accept='image/*'
                className="form-control"
                placeholder="Imagen de Referencia"
                aria-label="Imagen de Referencia"
                {...register("imagen", { required: true })}
              />
            </div>

            {errors.imagen && (
              <p className="text-danger">El Campo es Obligatorio</p>
            )}

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Crear
              </button>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
  )
}

export default CrearCanal