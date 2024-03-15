import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function UsuarioModal ({show,handleClose,usuario}) {

  
  return (
    <Modal show={show} onHide={handleClose} className='modal-dialog-centered'>
      <Modal.Header closeButton>
        <Modal.Title className='ms-auto'>Vendedor</Modal.Title>
      </Modal.Header>
      <Modal.Body className=' justify'>

         <p clasName='justify '>
          Al usar este sitio web, usted acepta estar sujeto a estos Términos y
          Condiciones. Si no está de acuerdo con ellos, no lo use.
        </p> 

      </Modal.Body>
    </Modal>
  )
}

export default UsuarioModal