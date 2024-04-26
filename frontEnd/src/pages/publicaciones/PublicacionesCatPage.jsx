/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { usarProductosContex } from '../../context/productosContext';
import { Link, useParams } from 'react-router-dom';
import { usarAutenticacion } from "../../context/autenticacion";
import {Toaster, toast} from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

function PublicacionesCatPage() {
        const[validacion,setValidacion]=useState(false)
        const{productosCat,suscripcionCategoria,productosCategoria,validarSuscripcion}= usarProductosContex();
        const { autenticado } = usarAutenticacion();
        
        const { nombre,id } = useParams();

        useEffect(()=>{
            const cargar= async(id)=>{
                await productosCategoria(id)
                if(autenticado){
                    const response= await validarSuscripcion(id)
                    setValidacion(response)
                }

            }
            cargar(id)
        },[id, autenticado])

        //funciones suscripcion
        const suscribir= async(id)=>{
            const response= await suscripcionCategoria(id)
            if(response.validacion){
                setValidacion(true)
            }else{
                setValidacion(false)
            }
            if(response.suscripcion){
                toast.success('Suscripción agregada')
            }else{
                toast.error('Se eliminó la suscripción')
            }
            
        }

        // constante para saber en que pagina estamos
        const [currentPage, setCurrentPage] = useState(1);
        const [paginacion, setPaginacion] = useState(1);



        // Convertir el número a cadena y aplicar el formato con comas
        const comas = (value) => {
            if (typeof value === 'undefined') {
                return 'No sirve esta chanchada';
            }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };
        // Calcular cuantas páginas se van a necesitar
        const totalPages = Math.ceil(productosCat.length / 5);
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
        // Función para manejar el clic en un número de página
        const handleClick = (pageNumber) => {
            setCurrentPage(pageNumber); // Actualizar el estado del número de página actual
            setPaginacion(pageNumber);
        };
    
        // Calcular el índice inicial y final para la porción de resultados que se mostrará en la página actual
        const startIndex = (paginacion - 1) * 5;
        const endIndex = startIndex + 5;
        // Obtener la porción de resultados para la página actual usando slice
        const resultsForPage = productosCat.slice(startIndex, endIndex);
    
        // Función para generar los numeros de páginas que hay
        const renderPaginationItems = () => {
            return pages.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                <a className="page-link" href="#" onClick={() => handleClick(pageNumber)}>
                {pageNumber}
                </a>
            </li>
            ));
        };
  return (
    <div className='container-lg bg-primary-light shadow mt-4 contenedor-publicaciones mb-4 rounded'>
    <Toaster richColors position='bottom-left'/>
    <div className='d-flex'>
        <h3 className='mx-3 my-3 fs-3 fw-bold'>{nombre}</h3>
        {autenticado && resultsForPage.length>0  ? (
            <>
                <div className={`btn ms-auto my-3 mx-3  ${validacion ? 'btn-unsuscribe': 'btn-suscribe'} rounded-pill`}
                onClick={()=>{suscribir(resultsForPage[0].categoria)}}>
                    {validacion ? (
                      <>
                        <FontAwesomeIcon icon={faThumbsDown}/> Anular Suscripción
                      </>
                    ) :(
                      <>
                        <FontAwesomeIcon icon={faThumbsUp}/> Suscribirse
                      </>
                    )}
                </div>
            </>
        ):(
            <>
            </>
        )}
    </div>


      {/*aqui se imprimen los ultimos productos registrados*/}
      {resultsForPage.length>0 ? (
        <>
          <div className='px-3 contenedor-card-publicacion'>
            {resultsForPage.map(publicacion => (
              <Link to={`/Vista_del_articulo/${publicacion.nombre}/${publicacion.id}`} 
              className="card bg-primary-light shadow text-decoration-none mb-4 "  key={publicacion.id}>
                <img src={publicacion.imagen} className="card-img-top" alt="..."
                style={{ width: '100%', height: '10rem', objectFit: 'cover' }}/>
                <div className="card-body"  style={{ height: '10rem'}}>
                  <h5 className="card-title fw-semibold">{publicacion.nombre}</h5>
                  <div className="card-text">
                    <div className='card-descripcion fw-light'>
                        <p>{publicacion.descripcion }</p>
                    </div>
                    <p className='fw-semibold' style={{position:'absolute', bottom:'0'}}>{"Lps " + comas(publicacion.precio)}</p><br/>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
        
      ):(
        <>
          <div className='p-4 w-100 my-auto d-flex flex-column justify-content-center align-items-center'> 
            <p className='text-dark text-center fw-bold fs-4'>No hay publicaciones de esta categoria</p>
            <img className='' src="../../../public/images/lista-deseos-notFound.jpg" alt="..."  style={{width:'20rem', height:'20rem', objectFit:'contain'}}/>
          </div>
        </>
      )}

      {/*Botones para pasar de pagina */}
      <div className="pagination-container d-flex justify-content-center">
        <nav aria-label="...">
          <ul className="pagination">
            {renderPaginationItems()}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default PublicacionesCatPage