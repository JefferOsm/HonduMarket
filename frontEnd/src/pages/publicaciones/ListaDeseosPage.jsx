import React, { useEffect } from 'react'
import { usarProductosContex } from '../../context/productosContext'
import { Link } from 'react-router-dom'

function ListaDeseosPage() {
    const{obtenerListaDeseos, publicacionesUser}= usarProductosContex()

    useEffect(()=>{
        obtenerListaDeseos()
    },[])
  return (
    <div className='container-lg bg-primary-light shadow mt-4 contenedor-publicaciones mb-4 ' style={{height:'90vh'}}>
    <h3 className='py-3 px-3 text-center text-secondary fs-3 fw-bold'>Lista de Deseos</h3>


        {/*aqui se imprimen los ultimos productos registrados*/}
        {publicacionesUser.length>0 ? (
            <>
            <div className='px-3 contenedor-card-publicacion'>
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
            </>
            
        ):(
            <>
                <div className='p-4 w-100 my-auto d-flex flex-column justify-content-center align-items-center'> 

                    <p className='text-dark text-center fw-bold fs-4'>No tienes publicaciones en tu lista de deseos</p>
                    <img className='' src="../../../public/images/lista-deseos-notFound.jpg" alt="..."  style={{width:'20rem', height:'20rem', objectFit:'contain'}}/>
                </div>
            </>
        )}
        

</div>
  )
}

export default ListaDeseosPage