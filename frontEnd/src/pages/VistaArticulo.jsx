import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { usarProductosContex } from '../context/productosContext';
import UsuarioModal from "../components/UsuarioModal";


function VistaArticulo() {
  //funcionalidades para mostrar el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //constante que recibe todas las publicaciones que existen
  const { obtenerPublicaciones,publicacionesUser} = usarProductosContex();
  
  useEffect(() => {
    obtenerPublicaciones();
  }, []);

  // funcion para obtener el id de la url
  const {id} = useParams();

  //objeto vacion con los mismos atributos de las publicaciones
  let objetoVacio = Object.assign({}, publicacionesUser[0]);

  //busueda de la publicacion que tendo el id obtenido de la URL
  for (let i = 0; i < publicacionesUser.length; i++) {
    if (publicacionesUser[i].id == id){
      objetoVacio = publicacionesUser[i];
    }
  }  
  
  

  return (
    <>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        {/*card dinamica para que el tamano se ajuste a la pantalla y se divide en 2*/}
        <div className="card card-fullscreen shadow-lg bg-white rounded" style={{margin: "2%", flexGrow: "100", display: "flex", flexDirection: "row"}}>
          
          {/*parte del card para presentar la imagen y videos si tiene*/}
          <div className="card-secction" style={{flex: "1", padding: "10px", border: "1px solid #ccc"}}>
          </div>

          {/*parte del card para la informacion del producto como en la vista previa*/}
          <div className="card-secction" style={{flex: "0.7", padding: "10px", border: "1px solid #ccc"}}>
              
              {/*Informacion del producto*/}
              <div key={objetoVacio.id}>
                <h1>{objetoVacio.nombre}</h1>
                <h5>{"Lps " + objetoVacio.precio}</h5>
                <h6>{"Publicado hace unos segundos en " + objetoVacio.departamento}</h6>
                <h5>Detalles</h5>
                <div style={{display: "flex"}}>
                  <h5>{"Categoria: "+ objetoVacio.categoria}</h5> 
                  <h5 className="px-3">{"Estado: "+ objetoVacio.estado}</h5>
                </div>
                <p className="justify px-1">{objetoVacio.descripcion}</p>
              </div>

              {/*Informacion del vendedor*/}
              <div className="form-check">
                <label className="form-check-label"  htmlFor="dropdownCheck">
                  <a href="#" className="text-primary" onClick={handleShow}>Detalles del vendedor</a>
                </label>
              </div>
          </div>
        </div>
      </div>
        <UsuarioModal show={show} handleClose={handleClose} />
    </>
  )
}

export default VistaArticulo