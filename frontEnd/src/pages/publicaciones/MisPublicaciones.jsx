import{ React, useEffect,useState} from 'react'
import { usarAutenticacion } from '../../context/autenticacion';
import { usarProductosContex } from '../../context/productosContext';
import { Link } from 'react-router-dom';

function MisPublicaciones() {
    //Funciones para la pagina
    const {autenticado}= usarAutenticacion();
    const { obtenerPublicaciones,publicacionesUser} = usarProductosContex();
    // Separa las publicaciones en activas e inactivas
    const publicacionesActivas = publicacionesUser.filter(publicacion => publicacion.producto_inactivo == 0);
    const publicacionesInactivas = publicacionesUser.filter(publicacion => publicacion.producto_inactivo == 1);

    // Define el estado para la página actual de las publicaciones activas e inactivas
    const [currentPageActivas, setCurrentPageActivas] = useState(1);
    const [currentPageInactivas, setCurrentPageInactivas] = useState(1);

    useEffect(() => {
        obtenerPublicaciones();
    }, [])

    // Convertir el número a cadena y aplicar el formato con comas
    const comas = (value) => {
        if (typeof value === 'undefined') {
            return 'No sirve esta chanchada';
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Calcular cuantas páginas se van a necesitar para cada conjunto
    const totalPagesActivas = Math.ceil(publicacionesActivas.length / 5);
    const totalPagesInactivas = Math.ceil(publicacionesInactivas.length / 8);
    const pagesActivas = Array.from({ length: totalPagesActivas }, (_, i) => i + 1);
    const pagesInactivas = Array.from({ length: totalPagesInactivas }, (_, i) => i + 1);

    // Funciones para manejar el clic en un número de página
    const handleClickActivas = (pageNumber) => {
        setCurrentPageActivas(pageNumber);
    };

    const handleClickInactivas = (pageNumber) => {
        setCurrentPageInactivas(pageNumber);
    };

    // Calcular el índice inicial y final para la porción de resultados que se mostrará en la página actual
    const startIndexActivas = (currentPageActivas - 1) * 5;
    const endIndexActivas = Math.min(startIndexActivas + 5, publicacionesActivas.length);
    const startIndexInactivas = (currentPageInactivas - 1) * 8;
    const endIndexInactivas = Math.min(startIndexInactivas + 8, publicacionesInactivas.length);

    // Obtener la porción de resultados para la página actual usando slice
    const resultsForPageActivas = publicacionesActivas.slice(startIndexActivas, endIndexActivas);
    const resultsForPageInactivas = publicacionesInactivas.slice(startIndexInactivas, endIndexInactivas);

    // Funciones para generar los numeros de páginas que hay
    const renderPaginationItemsActivas = () => {
        return pagesActivas.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${currentPageActivas === pageNumber ? 'active' : ''}`}>
                <a className="page-link btn" onClick={() => handleClickActivas(pageNumber)}>
                    {pageNumber}
                </a>
            </li>
        ));
    };

    const renderPaginationItemsInactivas = () => {
        return pagesInactivas.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${currentPageInactivas === pageNumber ? 'active' : ''}`}>
                <a className="page-link btn" onClick={() => handleClickInactivas(pageNumber)}>
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
            {resultsForPageActivas.map(publicacion => (
            <div key={publicacion.id}>
                {publicacion.producto_inactivo == 0 && (
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
                )}
            </div>
            ))}
        </div>

        {/*Botones para pasar de pagina */}
        <div className="pagination-container d-flex justify-content-center">
            <nav aria-label="...">
            <ul className="pagination">
                <li className="page-item disabled">
                </li>
                {renderPaginationItemsActivas()}
                <li className="page-item">
                </li>
            </ul>
            </nav>
        </div>

        <h3 className='py-3 px-3 text-center text-secondary fs-3 fw-bold'>Productos Inactivos</h3>
        <div className='px-3 contenedor-card-publicacion'>
        {/*aqui se imprimen los ultimos productos registrados*/}
        {resultsForPageInactivas.map(publicacion => (
            <div key={publicacion.id}>
            {publicacion.producto_inactivo == 1 && (
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
            )}
            </div>
        ))}
        </div>

        <div className="pagination-container d-flex justify-content-center">
            <nav aria-label="...">
            <ul className="pagination">
                <li className="page-item disabled">
                </li>
                {renderPaginationItemsInactivas()}
                <li className="page-item">
                </li>
            </ul>
            </nav>
        </div>

        
    </div>
  )
}

export default MisPublicaciones

const imagen = 'https://img.freepik.com/foto-gratis/retrato-abstracto-ojo-elegancia-mujeres-jovenes-generado-ai_188544-9712.jpg?size=626&ext=jpg&ga=GA1.1.117944100.1710115200&semt=ais';