import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFilter, faLightbulb, faMessage, faSearch} from '@fortawesome/free-solid-svg-icons'
import { usarProductosContex } from '../context/productosContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';


function ModalBusqueda({show,handleClose}) {

    const{productosBusqueda}= usarProductosContex();
    const [busqueda,setBusqueda]= useState('');
    const [matchPublicaciones, setMatchPublicaciones]=useState([]);

    
//filtrar publicaciones para mostrar los nombres
    const handleChange= e=>{
        if (e.target.value.trim() == ''){
            setMatchPublicaciones([])
            setBusqueda(e.target.value)
        }else{
            setBusqueda(e.target.value)
            filtrado(e.target.value)
        }
    }

    const filtrado=(termino)=>{
        let resultado= productosBusqueda.filter((publicacion)=>{
            if(publicacion.nombre.toString().toLowerCase().includes(termino.toLowerCase())){
                return publicacion
            }
        })
        setMatchPublicaciones(resultado)
        console.log(matchPublicaciones)
    }

    //Busqueda 
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?query=${busqueda}`);

    };

  return (
    <Modal show={show} onHide={handleClose} size='lg' backdrop="static">
        <Modal.Body >
            <form className="d-flex mx-auto input-busqueda mt-4" role="search" onSubmit={handleSearch}>
              
                <button className="btn bc-secondary" type='submit' onClick={handleClose}  ><FontAwesomeIcon icon={faSearch}/></button>
                <input className="form-control ms-2" type="search" placeholder="Nombre del Producto o servicios"
                aria-label="Search" autoFocus
                value={busqueda}
                onChange={handleChange}/>
            </form>
            <p className='fs-5 text-secondary fw-bold text-center p-1 my-2'> Sugerencias </p>
            <ul className="list-group input-busqueda mx-auto mt-2"> 
                


            {matchPublicaciones.length>0 ? (
                <>
                    {matchPublicaciones.map(publicacion=>(

                        
                        <li className="list-group-item  fw-bold" key={publicacion.id}>
                            <Link to={`/search?query=${publicacion.nombre}`} className="text-decoration-none text-dark hover" onClick={handleClose}
                            >{publicacion.nombre}</Link>
                        </li>
                
                       
                    ))}
                </>
            ):(
                <>
                    <li className='fs-6 fw-bold text-center mt-4 bc-primary rounded text-light p-2 busqueda-error'>
                        No se encontraron publicaciones relacionadas
                    </li>
                </>
            )}
         </ul>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-secondary" onClick={(handleClose)}>
            Salir
          </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ModalBusqueda