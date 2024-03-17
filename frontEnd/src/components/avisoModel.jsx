import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom'; 

function LoguearparaverModal({ show, handleClose }) {
    const navigate = useNavigate(); 

    const handleLogin = () => {
        navigate('/login'); // Utiliza navigate para redireccionar a '/login'
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className='bc-degrate'>
                <Modal.Title className='fw-bold text-light'>Espera por favor</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bc-primary text-light justify'>
                <p className='justify'>
                    Para acceder a la información completa del producto,
                    es necesario que inicie sesión en HONDUMARKET
                </p>
            </Modal.Body>
            <Modal.Footer className='bc-degrate'>
                <Button className="btn btn-danger" onClick={handleClose}>
                    Salir
                </Button>
                <Button className="btn btn-primary" onClick={handleLogin}>
                    Iniciar sesión
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LoguearparaverModal;