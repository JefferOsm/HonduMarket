import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { buscarProductos } from '../../api/productos'; // Importa la función de búsqueda
import { Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = useQuery().get('query');
  const [results, setResults] = useState([]);

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

  return (
    <div className="container-fluid rounded shadow mb-4 mt-2" style={{background:'white'}}>
      <h3 className="py-3 px-3">Resultados de la búsqueda</h3>
      <div className="resultados-busqueda-card mt-4">
        {results.map((producto) => (
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
                                        <p className='fw-semibold' style={{position:'absolute', bottom:'0'}}>{"Lps " + producto.precio}</p><br/>
                                    </div>
                                </div>
                            </Link>
                            
        ))}
      </div>
    </div>
  );
}

export default SearchResultsPage;