import{ React, useEffect,useState} from 'react'
import { usarAutenticacion } from '../../context/autenticacion';
import { usarProductosContex } from '../../context/productosContext';
import { Link } from 'react-router-dom';

function MisPublicaciones() {
    //Funciones para la pagina
    const {autenticado}= usarAutenticacion();
    const { obtenerPublicaciones,publicacionesUser} = usarProductosContex();
    // constante para saber en que pagina estamos
    const [currentPage, setCurrentPage] = useState(1);
    const [paginacion, setPaginacion] = useState(1);

    useEffect(()=>{
        obtenerPublicaciones();
      },[])

    // Convertir el número a cadena y aplicar el formato con comas
    const comas = (value) => {
        if (typeof value === 'undefined') {
            return 'No sirve esta chanchada';
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Calcular cuantas páginas se van a necesitar
    const totalPages = Math.ceil(publicacionesUser.length / 5);
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
    const resultsForPage = publicacionesUser.slice(startIndex, endIndex);

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
        <h3 className='py-3 px-3 text-center text-secondary fs-3 fw-bold'>Productos Publicados</h3>
        <div className='px-3 contenedor-card-publicacion'>

            {/*aqui se imprimen los ultimos productos registrados*/}
            {resultsForPage.map(publicacion => (
            <div key={publicacion.id}>
                {publicacion.producto_inactivo ==0 ? (
                    <>
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
                    </>
                ):(
                    <>

                        <Link to={`/Vista_del_articulo/${publicacion.nombre}/${publicacion.id}`} className="card bg-primary-light shadow text-decoration-none mb-4 producto-inactivo" key={publicacion.id}>
                            <img src={publicacion.imagen} className="card-img-top" alt="..." style={{ width: '100%', height: '10rem', objectFit: 'cover' }} />
                            <div className="card-body" style={{ height: '10rem' }}>
                            <h5 className="card-title fw-semibold">{publicacion.nombre}</h5>
                            <div className="card-text">
                                <div className='card-descripcion fw-light'>
                                <p>{publicacion.descripcion}</p>
                                </div>
                                <p className='fw-semibold' style={{ position: 'absolute', bottom: '0' }}>{"Lps " + comas(publicacion.precio)}</p><br />
                            </div>
                            </div>
                        </Link>
                    </>
                )}
            </div>
            
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
    </div>
  )
}

export default MisPublicaciones

const imagen = 'https://img.freepik.com/foto-gratis/retrato-abstracto-ojo-elegancia-mujeres-jovenes-generado-ai_188544-9712.jpg?size=626&ext=jpg&ga=GA1.1.117944100.1710115200&semt=ais';