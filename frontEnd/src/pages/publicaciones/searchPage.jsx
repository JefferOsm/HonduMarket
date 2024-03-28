import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { buscarProductos } from '../../api/productos'; // Importa la función de búsqueda
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import ModalFiltro from '../../components/ModalFiltro';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = useQuery().get('query');
  const [results, setResults] = useState([]);
  // constante para saber en que pagina estamos
  const [currentPage, setCurrentPage] = useState(1);
  const [paginacion, setPaginacion] = useState(1);

  //funcionalidades para el modal de Filtros
  const [filtros, setfiltros] = useState(false);
  const filtrosClose = () => setfiltros(false);
  const handlefiltros = () => setfiltros(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setResults([]); // Limpia los resultados anteriores
        const filteredProducts = await buscarProductos(query);
        console.log(filteredProducts)
        setResults(filteredProducts); // Establece los resultados en lugar de agregar a ellos
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [query]);

  // Convertir el número del precio con formato con comas
  const comas = (value) => {
    if (value !== undefined && value !== null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  };


  // Calcular cuantas páginas se van a necesitar
  const totalPages = Math.ceil(results.length / 4);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Función para manejar el clic en un número de página
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber); // Actualizar el estado del número de página actual
    setPaginacion(pageNumber);
  };

  // Calcular el índice inicial y final para la porción de resultados que se mostrará en la página actual
  const startIndex = (paginacion - 1) * 4;
  const endIndex = startIndex + 4;

  //ordenar del mas reciente al mas antiguo
  const reversedResults = [...results].reverse();
  // Obtener la porción de resultados para la página actual usando slice
  const resultsForPage = reversedResults.slice(startIndex, endIndex);

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
    <div className="container-fluid rounded shadow mb-4 mt-2" style={{background:'white'}}>
      <h3 className="py-3 px-3 d-flex align-items-center">
        Resultados de la búsqueda
        <div className='ms-auto'>
            <button className="btn bc-secondary d-flex align-items-center" type='button' onClick={handlefiltros}>
                <span className='px-1'>Filtros</span>
                <FontAwesomeIcon icon={faFilter} className="me-2" />
            </button>
        </div>
      </h3>

      <div className="resultados-busqueda-card mt-4">
        {resultsForPage.map((producto) => (
                            <Link to={`/Vista_del_articulo/${producto.nombre}/${producto.id}`}
                            className="card bg-primary-light shadow text-decoration-none mb-3 mt-2 mx-2"  key={producto.id}>
                                <img src={producto.url_imagen} className="card-img-top" alt="..."
                                style={{ width: '100%', height: '10rem', objectFit: 'cover' }}/>
                                <div className="card-body"  style={{ height: '10rem'}}>
                                    <h5 className="card-title fw-semibold">{producto.nombre}</h5>
                                    <div className="card-text">
                                        <div className='card-descripcion fw-light'>
                                            <p>{producto.descripcion }</p>
                                        </div>
                                        <p className='fw-semibold' style={{position:'absolute', bottom:'0'}}>{"Lps " + comas(producto.precio)}</p><br/>
                                    </div>
                                </div>
                            </Link>
                            
        ))}
      </div>

      {/*Botones para pasar de pagina */}
      <div className="pagination-container d-flex justify-content-center">
        <nav aria-label="...">
          <ul className="pagination">
            <li className="page-item disabled">
              <span className="page-link">Previous</span>
            </li>
            {renderPaginationItems()}
            <li className="page-item">
              <span className="page-link" href="#">Next</span>
            </li>
          </ul>
        </nav>
      </div>

      <ModalFiltro show={filtros} handleClose={filtrosClose} />
    </div>
  );
}

export default SearchResultsPage;