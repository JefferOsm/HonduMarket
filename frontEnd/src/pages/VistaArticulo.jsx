import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { usarAutenticacion } from '../context/autenticacion';
import { usarProductosContex } from '../context/productosContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';


function VistaArticulo() {
  const {usuario,eliminarUsuario,fotoPerfil}= usarAutenticacion();

  //Peticion para foto de perfil
  const onSubmit= async(data)=>{

    const formData= new FormData();
    formData.append('image',data.imagen[0])
    console.log(formData)

    await fotoPerfil(formData)

  }
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
              <h5>Detalle</h5>
              <div style={{display: "flex"}}>
                <h5>{"Categoria: "+ objetoVacio.categoria}</h5> 
                <h5 className="px-3">{"Estado: "+ objetoVacio.estado}</h5>
              </div>
              <h6>{objetoVacio.descripcion}</h6>
            </div>

            {/*Informacion del vendedor*/}
            <div>
              {/*<div className="d-flex align-items-center"> 
                <img src={usuario.url_imagen} className="rounded-circle img-fluid img-thumbnail" alt="Imagen de perfil" style={{ width: "100px", height: "100px" }} />
                <p className="text-center mb-1 fw-bold fs-3 ml-2 px-3">{usuario.nombre}</p>  
              </div>

              <p className="text-center mb-3 fs-6 text-secondary">@{usuario.username}</p>

              <div className="d-flex justify-content-center mt-2">
                <div className='d-flex mx-2'>
                  <p className='mx-2 fs-5 text-secondary'><FontAwesomeIcon icon={faMap} /></p>
                  <p className='fs-5 text-secondary'>{usuario.direccion}</p>
                </div>

                <div className='mx-2 d-flex'>
                  <p className='fs-5 text-secondary'><FontAwesomeIcon icon={faPhone}></FontAwesomeIcon></p>
                  <p className='fs-5 text-secondary'>+504 {usuario.telefono}</p>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <div className='d-flex mx-2'>
                  <p className='mx-2 fs-5 text-secondary'><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon></p>
                  <p className='fs-5 text-secondary'>{usuario.correo}</p>
                </div>
                </div>*/}
            </div>
            
            
            
           
        </div>
      </div>
    </div>
  )
}

export default VistaArticulo