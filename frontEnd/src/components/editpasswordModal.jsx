import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';    

    
function EditpasswordModal({ show, handleClose }) {
    console.log(show)
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
    };
  
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className='bc-degrate'>
          <Modal.Title className='fw-bold text-light'>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bc-primary text-light justify'>
          <form className="px-4 py-3" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Contraseña Actual</label>
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña Actual"
                aria-label="Contraseña Actual"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nueva Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nueva Contraseña"
                aria-label="Nueva Contraseña"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirmar Nueva Contraseña"
                aria-label="Confirmar Nueva Contraseña"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between">
              <Button type="submit" className='btn btn-primary'>Cambiar</Button>
              <Button variant='secondary' onClick={handleClose}>Cancelar</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal> 
    );
  }
  
  export default EditpasswordModal;