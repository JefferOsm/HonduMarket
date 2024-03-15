import{ React, useEffect,useState} from 'react'
import { usarAutenticacion } from '../../context/autenticacion';
import { usarProductosContex } from '../../context/productosContext';
import { Link } from 'react-router-dom';

function MisPublicaciones() {
    //Funciones para la pagina
    const {autenticado}= usarAutenticacion();
    const { obtenerPublicaciones,publicacionesUser} = usarProductosContex();

    useEffect(()=>{
        obtenerPublicaciones();
      },[])
      
  return (
    <div className='container-lg bg-primary-light shadow mt-4 contenedor-publicaciones mb-4'>
        <h3 className='py-3 px-3'>Productos Publicados</h3>
        <div className='px-3 contenedor-card-publicacion'>

            {/*aqui se imprimen los ultimos productos registrados*/}
            {publicacionesUser.map(publicacion => (
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
                            <p className='fw-semibold' style={{position:'absolute', bottom:'0'}}>{"Lps " + publicacion.precio}</p><br/>
                        </div>
                    </div>
                    </Link>
                ))}
        </div>
    </div>
  )
}

export default MisPublicaciones

const imagen = 'https://img.freepik.com/foto-gratis/retrato-abstracto-ojo-elegancia-mujeres-jovenes-generado-ai_188544-9712.jpg?size=626&ext=jpg&ga=GA1.1.117944100.1710115200&semt=ais';