import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { usarProductosContex } from '../context/productosContext';

function VistaArticulo() {
  const { obtenerPublicaciones,publicacionesUser} = usarProductosContex();
  
  useEffect(() => {
    obtenerPublicaciones();
  }, []);

  const {id} = useParams();

  let objetoVacio = Object.assign({}, publicacionesUser[0]);

  for (let i = 0; i < publicacionesUser.length; i++) {
    if (publicacionesUser[i].id == id){
      objetoVacio = publicacionesUser[i];
    }
  }  
  
  

  return (
    <div style={{display: "flex", justifyContent: "space-between"}}>
      <div className="card card-fullscreen shadow-lg bg-white rounded" style={{margin: "2%", flexGrow: "100", display: "flex", flexDirection: "row"}}>
        <div className="card-secction" style={{flex: "1", padding: "10px", border: "1px solid #ccc"}}>
            
            
        </div>
        <div className="card-secction" style={{flex: "0.7", padding: "10px", border: "1px solid #ccc"}}>
       
            <div key={objetoVacio.id}>
              <h1>{objetoVacio.nombre}</h1>
              <h5>{"Lps " + objetoVacio.precio}</h5>
              <h6>{"Publicado hace unos segundos en " + objetoVacio.departamento}</h6>
              <h5>Detalle</h5>
              <div style={{display: "flex"}}>
                <h5>{"Categoria: "+ objetoVacio.categoria}</h5> 
                <h5 className="px-3">{"Estado: "+ objetoVacio.estado}</h5>
                <h6>{objetoVacio.descrpcion}</h6>
              </div>
            </div>
            
            
            
            
           
        </div>
      </div>
    </div>
  )
}

export default VistaArticulo