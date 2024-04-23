import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { usarProductosContex } from "../context/productosContext";

function ModalFiltro ({show,handleClose, onOptionSelected, onCategorySelected, onSelectedDepto}) {

  //Funcionalidades para el filtro
  const [selectedOption, setSelectedOption] = useState('');
  const { obtenerCategorias, obtenerDepartamentos, categorias,
    departamentos} = usarProductosContex();

    //funcionalidades para saber que filtro esta activo
    const [activoOrden, setActivoOrden] = useState(new Array(4).fill(false));
    const [activoCategoria, setActivoCategoria] = useState(new Array(categorias.length).fill(false));
    const [activoDepartamento, setActivoDepartamento] = useState(new Array(departamentos.length).fill(false));

  
    //Traer datos de dep,cat,est
  useEffect(() => {
    obtenerCategorias()
    obtenerDepartamentos()
  }, [])

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onOptionSelected(option); // Llama a la función proporcionada por el padre
    if (option === "Orden_1"){
      activoOrden[0] = !activoOrden[0];
      activoOrden[1] = false;
      activoOrden[2] = false;
      activoOrden[3] = false;
      setActivoOrden(activoOrden);
    }else if(option === "Orden_2"){
      activoOrden[1] = !activoOrden[1];
      activoOrden[0] = false;
      activoOrden[2] = false;
      activoOrden[3] = false;
      setActivoOrden(activoOrden);
    }else if(option === "Precio_1"){
      activoOrden[2] = !activoOrden[2];
      activoOrden[0] = false;
      activoOrden[1] = false;
      activoOrden[3] = false; 
      setActivoOrden(activoOrden);
    }else if(option === "Precio_2"){
      activoOrden[3] = !activoOrden[3];
      activoOrden[0] = false;
      activoOrden[1] = false;
      activoOrden[2] = false; 
      setActivoOrden(activoOrden);
    }
  };

  //categorias
  const handleCategorySelect = (category) => {
    onCategorySelected(category);
    for (let i = 0; i < categorias.length; i++) {
      if (i === (Number(category)-1)){
        activoCategoria[i] = !activoCategoria[i];
      }else{
        activoCategoria[i] = false;
      }
      setActivoCategoria(activoCategoria);
    }
  }

  //Departamentos
  const [selectedDepto, setSelectedDepto] = useState ('');

  const handleDeptoSelect = (depto) => {
    setSelectedDepto(depto);
    onSelectedDepto(depto);
    for (let i = 0; i < departamentos.length; i++) {
      if (i === (Number(depto)-1)){
        activoDepartamento[i] = !activoDepartamento[i];
      }else{
        activoDepartamento[i] = false;
      }
      setActivoDepartamento(activoDepartamento);
    }
  }


  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton  className=''>
        <Modal.Title className='fw-bold'>Filtros de búsqueda</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex flex-row justify-content-between align-items-start text-body'>

        {/*Parte para hacer filtro por un orden de publicacion*/}
        <ul className="list-group list-group-flush">
            <li className="list-group-item mx-auto">Ordenar del</li>
            <li className="list-group-item">

              <button type="button" className={activoOrden[0] ? "btn btn-light active mt-3" : "btn btn-light mt-3"} 
                onClick={() => handleOptionSelect('Orden_1')}>más antiguo al más reciente</button><br />

              <button type="button" className={activoOrden[1] ? "btn btn-light active mt-3" : "btn btn-light mt-3"}
                onClick={() => handleOptionSelect('Orden_2')}>más reciente al más antiguo</button><br />
            </li>
        </ul>

        {/*Parte para hacer filtro por un orden del precio*/}
        <ul className="list-group list-group-flush">
          <li className="list-group-item mx-auto">Precio</li>
          <li className="list-group-item">

            <button type="button" className={activoOrden[2] ? "btn btn-light active mt-3" : "btn btn-light mt-3"} 
            onClick={() => handleOptionSelect('Precio_1')}>De mayor a menor</button><br />

            <button type="button" className={activoOrden[3] ? "btn btn-light active mt-3" : "btn btn-light mt-3"} 
            onClick={() => handleOptionSelect('Precio_2')}>De menor a mayor</button><br />
          </li>
        </ul>

        {/*Parte para hacer filtro por Categoría*/}
        <ul className="list-group list-group-flush">
          <li className="list-group-item mx-auto">Categoría</li>
          <li className="list-group-item">
            {categorias.map((categoria,index) => (
              <React.Fragment key={index}>
              <button type="button" className={activoCategoria[categoria.categoria_id - 1] ? "btn btn-light active mt-3" : "btn btn-light mt-3"}
              onClick={() => handleCategorySelect(categoria.categoria_id)}>{categoria.nombre_categoria}</button>
              <br />
              </React.Fragment>
            ))}
          </li>
        </ul>

        {/*Parte para hacer filtro por Departamento*/}
        <ul className="list-group list-group-flush">
          <li className="list-group-item mx-auto">Departamento</li>
          <li className="list-group-item">
            {departamentos.map((departamento,index) => (
              <React.Fragment key={index}>
              <button type="button" className={activoDepartamento[departamento.id_departamento - 1] ? "btn btn-light active mt-3" : "btn btn-light mt-3"}
              onClick={() => handleDeptoSelect(departamento.id_departamento)}>{departamento.nombre_departamento}</button>
              <br />
              </React.Fragment>
            ))}
          </li>
        </ul>

      </Modal.Body>
    </Modal>
  )
}

export default ModalFiltro