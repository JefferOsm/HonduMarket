import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { usarProductosContex } from '../../context/productosContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function ModalChat ({show,handleClose}){
  const {usuarioProduct} = usarProductosContex();

  return (

      <Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-scrollable">
        <Modal.Header closeButton>
          <Modal.Title className='fw-bold'>Enviale un mensaje a @{usuarioProduct.username}</Modal.Title>
        </Modal.Header>

        <Modal.Body className=''>

          <div className="row">
            <span className="bc-secondary-body text-light rounded ml-auto col-md-2">Hola</span>
          </div>

          <div className="row">
            <span className="bc-primary-2 col-md-2 rounded text-light ms-auto">Hola</span>
          </div>
        </Modal.Body>

        <Modal.Footer className='input-group'>
          <input type="text" className="form-control form-control-ms" placeholder="Escribe tu mensaje" aria-label="mensaje"/>
          <Button className="btn btn-danger">
             <FontAwesomeIcon icon= {faPaperPlane} />
          </Button>
          <Button className="">
              <FontAwesomeIcon icon={faImage} />
          </Button>
        </Modal.Footer>
      </Modal>

  )
}

export default ModalChat