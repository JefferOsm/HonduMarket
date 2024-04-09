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

  // constante para saber en que pagina estamos
  const [currentPage, setCurrentPage] = useState(1);
  const [paginacion, setPaginacion] = useState(1);

  //funcionalidades para el modal de Filtros
  const [filtros, setfiltros] = useState(false);
  const filtrosClose = () => setfiltros(false);
  const handlefiltros = () => setfiltros(true);

  //funcionalidades para implementar los filtros seleccionados
  const [Escoger_Filtros, setEscoger_Filtros] = useState(new Array(3).fill(null));
  const [category_anterior, setcategory_anterior] = useState("");
  const [depto_anterior, setdepto_anterior] = useState("");
  const [option_anterior, setoption_anterior] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setResults([]); // Limpia los resultados anteriores
        const filteredProducts = await buscarProductos(query);
        console.log(filteredProducts)
        setResults(filteredProducts); // arreglo que tiene los resultados de la busqueda
        setResults_2(filteredProducts); //copia que no se modifica de los resultados de la busqueda
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


  //Funcionalidad para enviar con que categoria hacer el filtro
  const handleCategorySelect = (category) =>{

      //validamos si category ya se habia seleccionado para eliminarla del arreglo de filtros
      if (Escoger_Filtros[1] !== null && category === category_anterior){
        Escoger_Filtros[1] = null;
        setEscoger_Filtros(Escoger_Filtros);
        Filtros_aplicar(Escoger_Filtros);
      }else{
        //ya que se escoja por primera vez o sea otra categoria que no se habia seleccionado
        setcategory_anterior(category);
        Escoger_Filtros[1] = category;
        setEscoger_Filtros(Escoger_Filtros);
        Filtros_aplicar(Escoger_Filtros);
      }
  };

   //Funcionalidad para hacer filtro por departamento
  const handleDeptoSelect = (depto) => {

    //validamos si depto ya se habia seleccionado para eliminarlo del arreglo de filtros
    if (Escoger_Filtros[2] !== null && depto === depto_anterior){
      Escoger_Filtros[2] = null;
      setEscoger_Filtros(Escoger_Filtros);
      Filtros_aplicar(Escoger_Filtros);
    }else{
       //ya que se escoja por primera vez o sea otro departamento que no se habia seleccionado
      setdepto_anterior(depto);
      Escoger_Filtros[2] = depto;
      setEscoger_Filtros(Escoger_Filtros);
      Filtros_aplicar(Escoger_Filtros);
    }
  };

  //Funcionalidad para cambiar el orden los elemntos segun la opcion del modal
  const handleOptionSelected = (option) => {

    //validamos si option ya se habia seleccionado para eliminarlo del arreglo de filtros este es el orden
      if (Escoger_Filtros[0] !== null && option === option_anterior){
        Escoger_Filtros[0] = null;
        setEscoger_Filtros(Escoger_Filtros);
        Filtros_aplicar(Escoger_Filtros);
      }else{
        //ya que se escoja por primera vez o sea otro orden
        setoption_anterior(option);
        Escoger_Filtros[0]= option;
        setEscoger_Filtros(Escoger_Filtros);
        Filtros_aplicar(Escoger_Filtros);
      }
  };

  //funcion para aplicar los filtros seleccionados que estan en el arreglo
  const Filtros_aplicar = (arreglo) => {

    //validamos si un orden esta seleccionado 
    if (arreglo[0] !== null){

      //Orden_1 es del mas antiguo al mas reciente
      if (arreglo[0] === "Orden_1") {
        //se define una variable la cual ya tendra el orden aplicado y se remplasa el primer arreglo
        let filtro_1 = [...results_2].sort((a, b) => new Date(a.fecha_publicacion) - new Date(b.fecha_publicacion));
        setResults(filtro_1);

        //se verifica si hay una categoria seleccionada
        if (arreglo[1] !== null){
          let filtro_2 = filtro_1.filter((producto) => producto.categoria === arreglo[1]);
          setResults(filtro_2);

          //se verifica si hay un departamento seleccionado
          if (arreglo[2] !== null){ 
            let filtro_3 = filtro_2.filter((producto) => producto.departamento === arreglo[2]);
            setResults(filtro_3);
          }
        }else if (arreglo[2] !== null){
          
          //se verifica si hay un departamento seleccionado en caso de que no haya una categoria seleccionada
          let filtro_2 = filtro_1.filter((producto) => producto.departamento === arreglo[2]);
          setResults(filtro_2);
    
        }
      } 

      //Orden_2 es del mas reciente al mas antiguo
      if (arreglo[0] === "Orden_2") {
        let filtro_1 = [...results_2].sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
        setResults(filtro_1);

        if (arreglo[1] !== null){
          let filtro_2 = filtro_1.filter((producto) => producto.categoria === arreglo[1]);
            setResults(filtro_2);
    
            if (arreglo[2] !== null){
             
              let filtro_3 = filtro_2.filter((producto) => producto.departamento === arreglo[2]);
              setResults(filtro_3);
            }
        }else if (arreglo[2] !== null){

          //se verifica si hay un departamento seleccionado en caso de que no haya una categoria seleccionada
          let filtro_2 = filtro_1.filter((producto) => producto.departamento === arreglo[2]);
          setResults(filtro_2);
    
        }
      } 

      //Precio_1 es de mayor a menor
      if (arreglo[0] === "Precio_1") {

        let filtro_1 = [...results_2].sort((a, b) => b.precio - a.precio);
        setResults(filtro_1);

        if (arreglo[1] !== null){

          let filtro_2 = filtro_1.filter((producto) => producto.categoria === arreglo[1]);
          setResults(filtro_2);
    
          if (arreglo[2] !== null){
            let filtro_3 = filtro_2.filter((producto) => producto.departamento === arreglo[2]);
            setResults(filtro_3);
          }
        }else if (arreglo[2] !== null){

          //se verifica si hay un departamento seleccionado en caso de que no haya una categoria seleccionada
          let filtro_2 = filtro_1.filter((producto) => producto.departamento === arreglo[2]);
          setResults(filtro_2);
        }
      } 

      //Precio_2 es de menor a mayor
      if (arreglo[0] === "Precio_2") {
        let filtro_1 = [...results_2].sort((a, b) => a.precio - b.precio);
        setResults(filtro_1);

        if (arreglo[1] !== null){
          let filtro_2 = filtro_1.filter((producto) => producto.categoria === arreglo[1]);
            setResults(filtro_2);
    
            if (arreglo[2] !== null){
             
              let filtro_3 = filtro_2.filter((producto) => producto.departamento === arreglo[2]);
              setResults(filtro_3);
            }
        }else if (arreglo[2] !== null){
          //se verifica si hay un departamento seleccionado en caso de que no haya una categoria seleccionada
          let filtro_2 = filtro_1.filter((producto) => producto.departamento === arreglo[2]);
          setResults(filtro_2);
    
        }
      }

    }else if (arreglo[1] !== null){
      //en caso de que orden no este seleccionado entonces colocamos que el orden sea verificar si hay alguna categoria seleccionada y se aplica por defecto
      let filtro_1 = [...results_2].filter((producto) => producto.categoria === arreglo[1]);
        setResults(filtro_1);

        //verificamos si hay un departamento seleccionado
        if (arreglo[2] !== null){ 
          let filtro_2 = filtro_1.filter((producto) => producto.departamento === arreglo[2]);
          setResults(filtro_2);
        }

    }else if (arreglo[2] !== null){
      //verificamos si hay un departamento seleccionado y porque los demas filtros no
      let filtro_1 = [...results_2].filter((producto) => producto.departamento === arreglo[2]);
      setResults(filtro_1);

    }else{
      //si se escogio un filtro y luego se de selecciono y el arreglo esta vacio entonces mandamos los resultados que tenemos guardados
      let sin_filtros = [...results_2];
      setResults(sin_filtros);

    }
  };
  

    // Calcular el índice inicial y final para la porción de resultados que se mostrará en la página actual
    const startIndex = (paginacion - 1) * 4;
    const endIndex= startIndex + 4;

  const resultsForPage = results.slice(startIndex, endIndex);

  // Función para generar los numeros de páginas que hay
  const renderPaginationItems = () => {
    return pages.map((pageNumber) => (
      <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
        <a className="page-link btn" onClick={() => handleClick(pageNumber)}>
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
            </li>
            {renderPaginationItems()}
            <li className="page-item">
            </li>
          </ul>
        </nav>
      </div>

      <ModalFiltro show={filtros} handleClose={filtrosClose} onOptionSelected={handleOptionSelected} onCategorySelected={handleCategorySelect} onSelectedDepto={handleDeptoSelect}/>
    </div>
  );
}

export default SearchResultsPage;