import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function ModalDenuncia({ show, handleClose, tiposDenuncia }) {

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Denunciar vendedor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Motivo de la denuncia</h5>
                <select className="form-select mb-3">
                    <option value="">-selecionar-</option>
                    {tiposDenuncia && tiposDenuncia.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                </select>
                <textarea className="form-control" rows="3" placeholder="Descripción de la denuncia"></textarea>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" disabled={true}>
                    Enviar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalDenuncia;

