import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { usarAutenticacion } from '../context/autenticacion';


function DeleteProfileModal({show,handleClose}) {
    const {eliminarUsuario} = usarAutenticacion();

  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tu usuario se eliminara de forma permanente</Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-danger" onClick={()=>{eliminarUsuario()}}>
            Eliminar
          </Button>
          <Button variant="btn btn-secondary" onClick={(handleClose)}>
            Cancelar
          </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default DeleteProfileModal