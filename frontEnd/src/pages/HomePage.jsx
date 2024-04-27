/* eslint-disable no-unused-vars */
import React, { useEffect,useState } from "react"
import { usarProductosContex } from "../context/productosContext";
import { usarAutenticacion } from "../context/autenticacion";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import ModalBusqueda from "../components/modalBusqueda";
import { Carrusel_1_Request } from '../api/productos';


function HomePage() {

  const {obtenerCategorias,categorias,publicacionesHome,obtenerPublicacionesInicio,obtenerPublicacionesInicioAuth} = usarProductosContex();
  const {autenticado, usuario} = usarAutenticacion();
  // Carousel
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1024 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  };

  const [id_usuario, setid_usuario] = useState(null);
  const [results, setresults] = useState([]);

  useEffect(()=>{
  
    if (autenticado){
      setid_usuario(usuario.id);
    }else{
      setid_usuario(null);
    }
    
  },[autenticado])


  useEffect(()=>{
    obtenerCategorias();
    if (autenticado){
      obtenerPublicacionesInicioAuth();
    }else{
      obtenerPublicacionesInicio();
    }

    const cargarDatos = async () => {
      const response = await Carrusel_1_Request( id_usuario);
      setresults(response);
    }

    //console.log(categorias)
    cargarDatos();
  },[id_usuario])

  // Convertir el número del precio con formato con comas
  const comas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <>
    <div className="container-md my-4 ">
      
      <div id="carouselExampleInterval" className="carousel slide " data-bs-ride="carousel" style={{ position: 'relative' }}>

        <div className="carousel-inner ">
          {results.map((producto, index) => (
            <Link to={`/Vista_del_articulo/${producto.nombre_producto}/${producto.producto_id}`}
            className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="10000" 
            style={{ width: '100%', objectFit: 'cover' }} key={producto.producto_id}>
                
                  <img src={producto.url_imagen} className="d-block size-detalle-imagen" alt="..." key={producto.producto_id}/>
                
            </Link>
          ))}
        </div>



          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
      </div>

    <p className="fs-3 text-dark fw-bold p-2 my-3">Podría Interesarte</p>
    {/* Prueba carusel-react */}
    <Carousel responsive={responsive} showDots={true} infinite={true}
    autoPlay={true}  autoPlaySpeed={3000} >
      {publicacionesHome.map(publicacion=>(

        <Link to={`/Vista_del_articulo/${publicacion.nombre}/${publicacion.id}`} 
        className="card bg-primary-light shadow text-decoration-none mb-3 mt-2 mx-2"  key={publicacion.id}>
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

    </Carousel>

{/* 
      {categorias.map((categoria) => (
        <div key={categoria.categoria_id}>
          <div className="bg-primary-dark my-4  p-3">
            <div className="row">
              <div>
                <h4>{categoria.nombre_categoria}</h4>
              </div>
            </div>
          </div>
          
        </div>
      ))} */}
    </div>
    </>
  );
}

export default HomePage
