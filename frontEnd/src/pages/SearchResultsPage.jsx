import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { buscarProductos } from '../api/productos'; // Importa la función de búsqueda
import LoguearparaverModal from '../components/avisoModel'; // Importa el modal
import { usarAutenticacion } from "../context/autenticacion"


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = useQuery().get('query');
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false); // Agrega un estado para controlar la visibilidad del modal
  const { autenticado } = usarAutenticacion();

  const handleOpenModal = () => {
    if (autenticado) {// Si el usuario no está autenticado, muestra el modal
      navigate('/producto'); // Redirige al usuario a la página del producto
    } else {
      setShowModal(true); // Muestra el modal
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Función para cerrar el modal
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setResults([]); // Limpia los resultados anteriores
        const filteredProducts = await buscarProductos(query);
        setResults(filteredProducts); // Establece los resultados en lugar de agregar a ellos
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="container-mb rounded shadow mb-4" style={{background:'white'}}>
      <h3 className="py-3 px-3">Resultados de la búsqueda</h3>
      <div className="px-3 d-flex flex-wrap justify-content-around">
        {results.map((producto) => (
          <div className="card bg-primary-light shadow" style={{width: "18rem", margin: '10px'}} key={producto.id} onClick={handleOpenModal}>
            <div style={{overflow:'hidden', height:'200px'}}>
              <img src={producto.url_imagen} className="card-img-top" alt="..." style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
            </div>
            <div className="card-body">
              <h5 class="card-title">{producto.nombre}</h5>
              <p className="card-text">
                <a>{"Lps " + producto.precio}</a><br/>
                <a>{producto.descripcion + " "}</a>
              </p>
            </div>
          </div>
        ))}
      </div>
      <LoguearparaverModal show={showModal} handleClose={handleCloseModal} /> {/* Agrega el modal */}
    </div>
  );
}

export default SearchResultsPage;