import React from 'react';
import Modal from 'react-bootstrap/Modal';

const ImageModal = ({ isOpen, onRequestClose, selectedImage }) => (
  <Modal
    show={isOpen}
    onHide={onRequestClose}
  >
    <Modal.Header closeButton>
      <Modal.Title>Imagen seleccionada</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <img src={selectedImage} alt="Imagen seleccionada" style={{ width: '100%' }} />
    </Modal.Body>
  </Modal>
);

export default ImageModal;