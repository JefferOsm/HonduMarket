import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalFiltro ({show,handleClose, onOptionSelected}) {

  //Funcionalidades para el filtro
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onOptionSelected(option); // Llama a la función proporcionada por el padre
    handleClose();
  };


  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton  className=''>
        <Modal.Title className='fw-bold'>Filtros de búsqueda</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex flex-row justify-content-between align-items-start text-body'>

 
        <ul className="list-group list-group-flush">
            <li className="list-group-item">Ordenar</li>
            <li className="list-group-item">
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_1')}>Del mas reciente al mas antiguo</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_2')}>Del mas antiguo al mas reciente</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_2')}>Del mas caro al mas barato</a></p>
            </li>
        </ul>
        <ul className="list-group list-group-flush px-3">
            <li className="list-group-item">Categoria</li>
            <li className="list-group-item">
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#">inmuebles</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#">vehículos</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#">hogar</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#">servicios</a></p>
            </li>
        </ul>

        <ul className="list-group list-group-flush px-3">
            <li className="list-group-item">Departamento</li>
            <li className="list-group-item">
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#">Valle</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#"> Olancho</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#">Francisco morazan</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#">Gracias a Dios</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#">Yoro</a></p>
            </li>
        </ul>

      </Modal.Body>
    </Modal>
  )
}

export default ModalFiltro