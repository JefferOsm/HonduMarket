import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalFiltro ({show,handleClose, onOptionSelected, onCategorySelected, onSelectedDepto}) {

  //Funcionalidades para el filtro
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onOptionSelected(option); // Llama a la función proporcionada por el padre
    handleClose();
  };

  const [selectedCategory, setSelectedCategory] = useState ('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategorySelected(category);
    handleClose();

  }

  const [selectedDepto, setSelectedDepto] = useState ('');

  const handleDeptoSelect = (depto) => {
    setSelectedDepto(depto);
    onSelectedDepto(depto);
    handleClose();

  }


  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton  className=''>
        <Modal.Title className='fw-bold'>Filtros de búsqueda</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex flex-row justify-content-between align-items-start text-body'>

        {/*Parte para hacer filtro por un orden de publicacion*/}
        <ul className="list-group list-group-flush">
            <li className="list-group-item">Ordenar del</li>
            <li className="list-group-item">
              <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_1')}>más antiguo a más reciente</a></p>
              <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_2')}>más reciente al más antiguo</a></p>
            </li>
        </ul>

        {/*Parte para hacer filtro por un orden del precio*/}
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Precio</li>
          <li className="list-group-item">
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_3')}>De mayor a menor</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_4')}>De menor a mayor</a></p>
          </li>
        </ul>

        {/*Parte para hacer filtro por Categoría*/}
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Categoría</li>
          <li className="list-group-item">
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Inmuebles')}>Inmuebles</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Vehiculos')}>Vehiculos</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Hogar')}>Hogar</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Bebes')}>Bebes</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Moda')}>Moda</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Mascotas')}>Mascotas</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Electronica')}>Electronica</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Servicios')}>Servicios</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Negocios')}>Negocios</a></p>
            <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleCategorySelect('Empleos')}>Empleos</a></p>
          </li>
        </ul>

        {/*Parte para hacer filtro por Departamento*/}
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Departamento</li>
          <li className="list-group-item">
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Atlántida')}>Atlántida</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Choluteca')}>Choluteca</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Colón')}>Colón</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Comayagua')}>Comayagua</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Copán')}>Copán</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Cortés')}>Cortés</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('El Paraíso')}>El Paraíso</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Francisco Morazán')}>Francisco Morazán</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Gracias a Dios')}>Gracias a Dios</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Intibucá')}>Intibucá</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Islas de la Bahía')}>Islas de la Bahía</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('La Paz')}>La Paz</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Lempira')}>Lempira</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Ocotepeque')}>Ocotepeque</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Olancho')}>Olancho</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Santa Bárbara')}>Santa Bárbara</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Valle')}>Valle</a></p>
            <p><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Yoro')}>Yoro</a></p>
          </li>
        </ul>

      </Modal.Body>
    </Modal>
  )
}

export default ModalFiltro