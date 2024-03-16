import React, { useEffect, useState } from "react"
import { usarProductosContex } from "../context/productosContext";
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import LoguearparaverModal from "../components/avisoModel";
import { usarAutenticacion } from '../context/autenticacion'



function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const {obtenerCategorias,categorias} = usarProductosContex();
  const { obtenerPublicaciones,publicacionesUser} = usarProductosContex();
  const{autenticado}=  usarAutenticacion();

   // Función para manejar el cierre del modal
   const handleCloseLoginModal = () => setShowLoginModal(false);

   // Función para abrir el modal
   const handleShowLoginModal = () => setShowLoginModal(true);
 
   // Función para manejar el clic en una tarjeta
   const handleCardClick = () => {
     // Si el usuario no está autenticado, mostrar el modal
     if (!autenticado) {
       handleShowLoginModal();
     }
   };

  useEffect(()=>{
    obtenerCategorias();
    console.log(categorias)
  },[])

  return (
    <div className="container-md my-4 ">
{/*       
      <div className="contenedor-categorias mb-4">
        {categorias.map(categoria=>(
          <Link className="p-2 bc-secondary-body text-light text-center rounded" style={{textDecoration:'none'}}
          key={categoria.categoria_id}>
            {categoria.nombre_categoria}
          </Link>

        ))}

      </div> */}

      
      <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="10000">
            <img src="public/homeReference.jpg" className="d-block w-100" alt="..."/>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img src="public/homeReference.jpg" className="d-block w-100" alt="..."/>
          </div>
          <div className="carousel-item">
            <img src="public/homeReference.jpg" className="d-block w-100" alt="..."/>
          </div>
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
      ))}
      {/* Modal para iniciar sesión */}
      <LoguearparaverModal show={showLoginModal} handleClose={handleCloseLoginModal} />
    
    </div>
  );
}

export default HomePage
