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
  const [results_2, setResults_2] = useState([]);
  const [results_3, setResults_3] = useState([]);

  // constante para saber en que pagina estamos
  const [currentPage, setCurrentPage] = useState(1);
  const [paginacion, setPaginacion] = useState(1);

  //funcionalidades para el modal de Filtros
  const [filtros, setfiltros] = useState(false);
  const filtrosClose = () => setfiltros(false);
  const handlefiltros = () => setfiltros(true);

  //funcionalidades para implementar el filtro
  const [option1, setOption1] = useState(false);
  const [option2, setOption2] = useState(false);
  const [option3, setOption3] = useState(false);
  const [option4, setOption4] = useState(false);
  const [categoria, setCategoria] = useState(false);
  const [departamento, setDepartamento] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setResults([]); // Limpia los resultados anteriores
        const filteredProducts = await buscarProductos(query);
        console.log(filteredProducts)
        setResults(filteredProducts); // Establece los resultados en lugar de agregar a ellos
        setResults_2(filteredProducts);
        setResults_3(filteredProducts);
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

  //Funcionalidad para hacer filtro por categoria
  const handleCategorySelect = (category) =>{
    let filteredResults = []; // Declarar filteredResults como una variable local

    if (category == "Inmuebles") {
      filteredResults = results_2.filter((producto) => producto.categoria === 1);
      setResults(filteredResults);
    }
    else if(category == "Vehiculos") {
      filteredResults = results_2.filter((producto) => producto.categoria === 2);
      setResults(filteredResults);
    }
    else if (category == "Hogar") {
      filteredResults = results_2.filter((producto) => producto.categoria === 3);
      setResults(filteredResults);
    }
    else if(category == "Bebes") {
      filteredResults = results_2.filter((producto) => producto.categoria === 4);
      setResults(filteredResults);
    }
    else if (category == "Moda") {
      filteredResults = results_2.filter((producto) => producto.categoria === 5);
      setResults(filteredResults);
    }
    else if(category == "Mascotas") {
      filteredResults = results_2.filter((producto) => producto.categoria === 6);
      setResults(filteredResults);
    }
    else if (category == "Electronica") {
      filteredResults = results_2.filter((producto) => producto.categoria === 7);
      setResults(filteredResults);
    }
    else if(category == "Servicios") {
      filteredResults = results_2.filter((producto) => producto.categoria === 8);
      setResults(filteredResults);
    }
    else if (category == "Negocios") {
      filteredResults = results_2.filter((producto) => producto.categoria === 9);
      setResults(filteredResults);
    }
    else if(category == "Empleos") {
      filteredResults = results_2.filter((producto) => producto.categoria === 10);
      setResults(filteredResults);
    }
    console.log(filteredResults);
  };

   //Funcionalidad para hacer filtro por departamento
  const handleDeptoSelect = (depto) => {
    let filteredResults = []; // Declarar filteredResults como una variable local

    if (depto == "Atlántida") {
      filteredResults = results_3.filter((producto) => producto.departamento === 1);
      setResults(filteredResults);
    }
    else if ( depto == "Choluteca") {
      filteredResults = results_3.filter((producto) => producto.departamento === 2);
      setResults(filteredResults);
    }
    else if ( depto == "Colón") {
      filteredResults = results_3.filter((producto) => producto.departamento === 3);
      setResults(filteredResults);
    }
    else if ( depto == "Comayagua") {
      filteredResults = results_3.filter((producto) => producto.departamento === 4);
      setResults(filteredResults);
    }
    else if ( depto == "Copán") {
      filteredResults = results_3.filter((producto) => producto.departamento === 5);
      setResults(filteredResults);
    }
    else if ( depto == "El Paraíso") {
      filteredResults = results_3.filter((producto) => producto.departamento === 6);
      setResults(filteredResults);
    }
    else if ( depto == "Intibucá") {
      filteredResults = results_3.filter((producto) => producto.departamento === 7);
      setResults(filteredResults);
    }
    else if ( depto == "Islas de la Bahía") {
      filteredResults = results_3.filter((producto) => producto.departamento === 8);
      setResults(filteredResults);
    }
    else if ( depto == "La Paz") {
      filteredResults = results_3.filter((producto) => producto.departamento === 9);
      setResults(filteredResults);
    }
    else if ( depto == "Ocotepeque") {
      filteredResults = results_3.filter((producto) => producto.departamento === 10);
      setResults(filteredResults);
    }
    else if ( depto == "Olancho") {
      filteredResults = results_3.filter((producto) => producto.departamento === 11);
      setResults(filteredResults);
    }
    else if ( depto == "Santa Bárbara") {
      filteredResults = results_3.filter((producto) => producto.departamento === 12);
      setResults(filteredResults);
    }
    else if ( depto == "Valle") {
      filteredResults = results_3.filter((producto) => producto.departamento === 13);
      setResults(filteredResults);
    }
    else if ( depto == "Yoro") {
      filteredResults = results_3.filter((producto) => producto.departamento === 14);
      setResults(filteredResults);
    }
    else if ( depto == "Francisco Morazán") {
      filteredResults = results_3.filter((producto) => producto.departamento === 15);
      setResults(filteredResults);
    }
    else if ( depto == "Cortés") {
      filteredResults = results_3.filter((producto) => producto.departamento === 16);
      setResults(filteredResults);
    }
    else if ( depto == "Lempira") {
      filteredResults = results.filter((producto) => producto.departamento === 17);
      setResults(filteredResults);
    }
    else if ( depto == "Gracias a Dios") {
      filteredResults = results_3.filter((producto) => producto.departamento === 18);
      setResults(filteredResults);
    }
    console.log(filteredResults);
  };

  //Funcionalidad para cambiar el orden los elemntos segun la opcion del modal
  const handleOptionSelected = (option) => {
    
    if (option == "Opción_1" && !option1){
      const reversedPublicacionesUser = [...results_2].reverse();
      setResults(reversedPublicacionesUser);
      setOption1(true);
      setOption2(false);
      setOption3(false);
      setOption4(false);
    }else if (option == "Opción_2" && option1 && !option2){
      const reversedPublicacionesUser = [...results_2];
      setResults(reversedPublicacionesUser);
      setOption2(true);
      setOption1(false);
      setOption3(false);
      setOption4(false);
    }else if (option == "Opción_3" && !option3){
      const Demayoramenor = [...results_3].sort((a, b) => b.precio - a.precio);
      setResults(Demayoramenor);
      setOption3(true);
      setOption1(false);
      setOption2(false);
      setOption4(false);
    }else if (option == "Opción_4" && !option4){
      const Demenoramayor = [...results_3].sort((a, b) => a.precio - b.precio);
      setResults(Demenoramayor);
      setOption4(true);
      setOption1(false);
      setOption2(false);
      setOption3(false);
    }
  };

  // Calcular el índice inicial y final para la porción de resultados que se mostrará en la página actual
  const startIndex = (paginacion - 1) * 4;
  const endIndex = startIndex + 4;

  // Obtener la porción de resultados para la página actual usando slice
  const resultsForPage = results.slice(startIndex, endIndex);

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
      {resultsForPage.length>0 ? (
      <>
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
                                              <p>{producto.descripcion}</p>
                                          </div>
                                          <p className='fw-semibold' style={{position:'absolute', bottom:'0'}}>{"Lps " + comas(producto.precio)}</p><br/>
                                      </div>
                                  </div>
                              </Link>
                              
          ))}
        </div>
      </>
      ):(
        <>
          <div className='p-4 w-100 my-auto d-flex flex-column justify-content-center align-items-center'> 
            <p className='text-dark text-center fw-bold fs-4'>No se encontraron resultados</p>
            <img className='' src="../../../public/images/lista-deseos-notFound.jpg" alt="..."  style={{width:'20rem', height:'20rem', objectFit:'contain'}}/>
          </div>
        </>
      )}

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

      <ModalFiltro show={filtros} handleClose={filtrosClose} onOptionSelected={handleOptionSelected} onCategorySelected={handleCategorySelect} onSelectedDepto={handleDeptoSelect}/>
    </div>
  );
}

export default SearchResultsPage;