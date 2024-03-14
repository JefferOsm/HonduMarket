import React, { useEffect } from "react"
import { usarProductosContex } from "../context/productosContext";
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';


function HomePage() {
  const {obtenerCategorias,categorias,publicacionesHome,obtenerPublicacionesInicio} = usarProductosContex();
  const { obtenerPublicaciones,publicacionesUser} = usarProductosContex();

  useEffect(()=>{
    obtenerCategorias();
    obtenerPublicacionesInicio();
    obtenerPublicaciones();
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

      <div className="container-mb rounded shadow mb-4" style={{background:'white'}}>
        <h3 className="py-3 px-3">Productos a la venta</h3>
        <div className="px-3 d-flex flex-wrap justify-content-around">
          {publicacionesHome.map(publicacion => (
            <Link to={"/Vista_del_articulo/"+ publicacion.id} style={{ textDecoration: 'none', color: 'inherit', margin: '10px' }} key={publicacion.id}>
              <div className="card bg-primary-light shadow" style={{width: "18rem"}}>
                <div style={{overflow:'hidden', height:'200px'}}>
                  <img src={publicacion.url_imagen} className="card-img-top" alt="..." style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                </div>
                <div className="card-body">
                  <h5 class="card-title">{publicacion.nombre}</h5>
                  <p className="card-text">
                    <a>{"Lps " + publicacion.precio}</a><br/>
                    <a>{publicacion.descripcion + " "}</a>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
    </div>
  )

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
    </div>
  );
}

export default HomePage
