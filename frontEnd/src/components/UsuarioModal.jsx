import React, {useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faPhone, faEnvelope, faImage, faCheck } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { usarAutenticacion } from '../context/autenticacion';
import { usarProductosContex } from '../context/productosContext';

function UsuarioModal ({show,handleClose}) {
  const {autenticado} = usarAutenticacion();
  const {obtenerUsuario, usuarioProduct} = usarProductosContex();
  

  return (
    <Modal show={show} onHide={handleClose} className='modal-dialog-centered'>
      <Modal.Header closeButton>
        <Modal.Title className='ms-auto'>Contacto</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {autenticado ? (
          <>
            <div className='container-fluid'>
              <div className='rounded-circle mx-auto shadow' 
              style={{backgroundImage:`url(${usuarioProduct.url_imagen})`, width:'80px', height:'80px',
               backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>
              </div>

              <p className='text-center fs-5 mt-2 text-secondary'>@{usuarioProduct.username}</p>

              <div className='d-flex mt-4 justify-content-center'>
                <div>
                  <p className='fs-4 fw-semibold'><FontAwesomeIcon icon={faEnvelope}/> Correo</p>
                  <p className='text-secondary fw-bold'>{usuarioProduct.correo}</p>
                </div>

                <div className='ms-4'>
                  <p className='fs-4 fw-semibold'><FontAwesomeIcon icon={faPhone}/> Telefóno</p>
                  <p className='text-secondary fw-bold'>+504 {usuarioProduct.telefono}</p>
                </div>
              </div>

            </div>
          </>
        ):(
          <>
          <div>
            <p className='justify text-dark fw-bold fs-6'>
              Debes inciar sesión para ver la información de contacto
            </p> 
            <Link to={'/login'} className='btn bc-secondary'>Inicia Sesión</Link>
          </div> 
          </>
        )}


      </Modal.Body>
    </Modal>
  )
}

export default UsuarioModal