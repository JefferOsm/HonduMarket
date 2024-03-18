import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { usarProductosContex } from '../context/productosContext';


function DeletePublicacionModal({show,handleClose,id}) {
    const{eliminarPublicacion} = usarProductosContex();

    const borrarPublicacion = (id)=>{
        eliminarPublicacion(id);
        handleClose
      }
  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>Estas Seguro de Eliminar la Publicacion</Modal.Body>
        <Modal.Footer>
        <Button variant="btn btn-danger" onClick={()=>{borrarPublicacion(id)}}>
            Eliminar
        </Button>
        <Button variant="btn btn-secondary" onClick={(handleClose)}>
            Cancelar
        </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default DeletePublicacionModal