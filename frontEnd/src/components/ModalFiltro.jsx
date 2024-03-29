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

 
        <ul className="list-group list-group-flush">
            <li className="list-group-item">Ordenar</li>
            <li className="list-group-item">
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_1')}>Del mas reciente al mas antiguo</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_2')}>Del mas antiguo al mas reciente</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_3')}>De mayor a menor precio</a></p>
                <p><a className="link-dark link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => handleOptionSelect('Opción_4')}>De menor a mayor precio</a></p>
            </li>
        </ul>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Categoría
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Inmuebles')}>Inmuebles</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Vehiculos')}>Vehiculos</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Hogar')}>Hogar</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Bebes')}>Bebes</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Moda')}>Moda</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Mascotas')}>Mascotas</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Electronica')}>Electronica</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Servicios')}>Servicios</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Negocios')}>Negocios</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleCategorySelect('Empleos')}>Empleos</a></li>
          </ul>
        </div>

        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Departamento
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Atlántida')}>Atlántida</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Choluteca')}>Choluteca</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Colón')}>Colón</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Comayagua')}>Comayagua</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Copán')}>Copán</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Cortés')}>Cortés</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('El Paraíso')}>El Paraíso</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Francisco Morazán')}>Francisco Morazán</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Gracias a Dios')}>Gracias a Dios</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Intibucá')}>Intibucá</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Islas de la Bahía')}>Islas de la Bahía</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('La Paz')}>La Paz</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Lempira')}>Lempira</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Ocotepeque')}>Ocotepeque</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Olancho')}>Olancho</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Santa Bárbara')}>Santa Bárbara</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Valle')}>Valle</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleDeptoSelect('Yoro')}>Yoro</a></li>
          </ul>
        </div>

      </Modal.Body>
    </Modal>
  )
}

export default ModalFiltro