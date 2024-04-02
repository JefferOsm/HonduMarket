import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ProductosContext } from '../context/productosContext';

function EditarProductoModal({ id, show, handleClose }) {
  const { obtenerDetalles, editarPublicacion } = useContext(ProductosContext);
  const [producto, setProducto] = useState({});

  useEffect(() => {
    if (id) {
      obtenerDetalles(id).then(setProducto);
    }
  }, [id]);

  const handleInputChange = (event) => {
    setProducto({
      ...producto,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    editarPublicacion(id, producto).then(() => handleClose());
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formProductName">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control type="text" name="nombre" value={producto?.nombre || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formProductDescription">
              <Form.Label>Descripción del Producto</Form.Label>
              <Form.Control type="text" name="descripcion" value={producto?.descripcion || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formProductPrice">
              <Form.Label>Precio del Producto</Form.Label>
              <Form.Control type="number" name="precio" value={producto?.precio || ''} onChange={handleInputChange} />
            </Form.Group>
            {/* Agrega aquí más campos de formulario según sea necesario */}
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditarProductoModal;