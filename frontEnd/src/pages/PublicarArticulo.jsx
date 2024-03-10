import React, { useEffect, useState } from "react"
import {useForm} from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faPhone, faEnvelope, faImage, faCheck } from '@fortawesome/free-solid-svg-icons';
import { usarAutenticacion } from "../context/autenticacion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ConditionsModel from "../components/conditionsModel";
import ModalBody from "react-bootstrap/esm/ModalBody";

function PublicarArticulo () {

    //Funcionalidades para subir imagen
    const {register, handleSubmit, formState:{errors}} = useForm();
    const {usuario,fotoPerfil}= usarAutenticacion();

    //Funcion para agregar imagenes al carrucel
    function Agregarimagen() {
      const inputArchivo = document.getElementById("escoger-imagen");
      const contenedorImagenes = document.getElementById("contenedor-imagenes");
      const archivo = inputArchivo.files[0];
    
      // Contar las imágenes existentes
      const numeroImagenes = contenedorImagenes.querySelectorAll("div").length;
    
      // Verificar selección de archivo y límite
      if (!archivo || numeroImagenes >= 6) {
        return alert("Solo se pueden escoger 6 Imagenes");
      }

      if (numeroImagenes == 0){

        const div = document.createElement("div");
        div.className = "carousel-item active";
        // Crear la primera imagen
        const imagen = document.createElement("img");
        imagen.src = URL.createObjectURL(archivo);
        imagen.className = "d-block w-100";
        div.appendChild(imagen);
      
        // Agregar la primera imagen al contenedor
        contenedorImagenes.appendChild(div);

      }else{

      const div = document.createElement("div");
      div.className = "carousel-item";
      // Crear una nueva imagen
      const imagen = document.createElement("img");
      imagen.src = URL.createObjectURL(archivo);
      imagen.className = "d-block w-100";
      div.appendChild(imagen);
    
      // Agregar la imagen al contenedor
      contenedorImagenes.appendChild(div);
      }
    }
    
    //Funcion para agregar botones al carrucel
    function AgregarBoton() {
      const inputArchivo = document.getElementById("escoger-imagen");
      const contenedorBotones = document.getElementById("contenedor-botones");
      const archivo = inputArchivo.files[0];
    
      // Contar las imágenes existentes
      const numeroBotones = contenedorBotones.querySelectorAll("button").length;
    
      // Verificar selección de archivo y límite
      if (!archivo || numeroBotones >= 6) {
        return alert("Solo se pueden escoger 6 Imagenes");
      }

      if (numeroBotones == 0){

        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("data-bs-target", "#carouselExampleIndicators");
        button.setAttribute("data-bs-slide-to", numeroBotones.toString);
        button.className = "active";
        button.setAttribute("aria-current", "true");
        button.setAttribute("aria-label", "Slide" + (numeroBotones+1).toString);

        // Agregar el primer boton del carrucel
        contenedorBotones.appendChild(button);
      }else{

      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("data-bs-target", "#carouselExampleIndicators");
      button.setAttribute("data-bs-slide-to", numeroBotones.toString);
      button.setAttribute("aria-label", "Slide" + (numeroBotones+1).toString);

      // Agregar el primer boton del carrucel
      contenedorBotones.appendChild(button);
      }
    }
    
    function Carrucel() {
      AgregarBoton();
      Agregarimagen();
      
    }
    
    
    // funcion para eliminar imagen seleccionada
    function removeImage(button) {
      const li = button.parentNode;
      carouselList.removeChild(li);
    }
    

    //Peticion para foto de perfil
    const onSubmit= async(data)=>{

      const formData= new FormData();
      formData.append('image',data.imagen[0])
      console.log(formData)

      await fotoPerfil(formData)
    }
    
    //Funcionalidades para la vista previa
    const [text, setText] = useState("");
    const [descripcion, setDescipcion] = useState("");
    const [precio, setprecio] = useState("");
    const [categoria, setcategoria] = useState("");
    const [estado, setestado] = useState("");
    const [departamento, setdepartamento] = useState("");

    const Titulo = (event) => {
      setText(event.target.value);
    };

    const Descripcion = (event) => {
        setDescipcion(event.target.value);
      };

      const Precio = (event) => {
        setprecio("Lps " + event.target.value);
      };

      const Categoria = (event) => {
        setcategoria(event.target.value);
      };

      const Estado = (event) => {
        setestado("Estado: " + event.target.value);
      };

      const Departamento = (event) => {
        setdepartamento("Publicado hace unos segundo en " + event.target.value);
      };

    const defaultTitulo = "Titulo";
    const defaultDescripcion = "La descripcion aparecera aqui";
    const defaultPrecio = "Precio";
    const defaultCategoria = "Categoria";
    const defaultEstado = "Estado";
    const defaultDepartamento = "Publicado hace unos segundo";

  return (
    <div style={{display: "flex", justifyContent: "space-between"}}>
        <div className="card py-3 px-3" style={{maxWidth: "27vw"}}>
            <h2>Registra tu producto</h2>
            <div className="col py-2">
                <input type="text" className="form-control" placeholder="Titulo" aria-label="Titulo" onChange={Titulo}/>
                <label className="form-label py-2">Descripción</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" onChange={Descripcion}></textarea>
                
                <div className="input-group py-2" style={{width:"15vw", borderRadius: "5px"}}>
                <div className="input-group-text">Lps</div>
                    <input type="number" className="form-control" placeholder="Precio" aria-label="Precio" required onChange={Precio}/>
                </div>

                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Categoria</label>
                    <select className="form-select" id="inputGroupSelect01" onChange={Categoria}>
                        <option  defaultValue={"opcion"}>Selecciona una opcion</option>
                        <option value="Hogar">Hogar</option>
                        <option value="Moda">Moda</option>
                        <option value="Mascotas">Mascotas</option>
                    </select>
                </div>

                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Estado</label>
                    <select className="form-select" id="inputGroupSelect01" onChange={Estado}>
                    <option  defaultValue={"opcion"}>Selecciona una opcion</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="Usado">Usado</option>
                    </select>
                </div>

                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Departamento</label>
                    <select className="form-select" id="inputGroupSelect01" onChange={Departamento}>
                    <option  defaultValue={"opcion"}>Selecciona una opcion</option>
                        <option value="Francisco Morazan">Francisco Morazan</option>
                        <option value="Olancho">Olancho</option>
                    </select>
                </div>

                <h6 className="text-center">Solo se pueden agregar 6 Imagenes</h6>
                {/* Formulario para subir la imagen */}
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className='input-group d-flex justify-content-center'>
                  
                  <label htmlFor="escoger-imagen" className='btn btn-outline-secondary rounded-1 font-size-lg' title='Subir Foto'>
                    <div className="modal-dialog py-4 modal-center modal-lg modal-dialog-rounded d-flex flex-column justify-content-center align-items-center" style={{background: "lightGray"}}>
                      <p className="h5">Agregar Fotos</p>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "35px", height: "35px" }} fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                          <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                          <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
                      </svg>
                      <img src={imgdemas} alt="Agregar Fotos" width="35" height="35" />
                    </div>
                  </label>

                  <input 
                    type='file' className='form-control' accept='image/*' id='escoger-imagen' style={{ display: 'none' }}
                    onChange={Agregarimagen}/>
                </div>
                </form>

                <div className="d-grid gap-2 col-6 mx-auto py-3">
                <button type="button" className="btn btn-outline-success">Guardar Publicacion</button>
                </div>

               
                

            </div>
        </div>

          
        <div className="card shadow-lg bg-white" style={{margin: "6%", flexGrow: "100", display: "flex", flexDirection: "row", maxWidth: "60vw"}}>
          <div className="card-secction" style={{flex: "1", padding: "10px", border: "1px solid #ccc"}}>
              <h6 className="card-title">Vista previa</h6>
              {/*<img id="imagenPrevia" className="img-fluid mx-auto" />*/}

              <div id="carouselExampleIndicators" className="carousel slide">
                <div className="carousel-indicators" id="contenedor-botones">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="5" aria-label="Slide 6"></button>
                </div>
                <div className="carousel-inner" id="contenedor-imagenes">
                  
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>


              
          </div>
          <div className="card-secction" style={{flex: "0.7", padding: "10px", border: "1px solid #ccc"}}>
            <div>
              <h1>{text === "" ? defaultTitulo : text}</h1>
              <h5>{precio === "" ? defaultPrecio : precio}</h5>
              <h6>{departamento === "" ? defaultDepartamento : departamento}</h6>
              <h5>Detalle</h5>
              <div style={{display: "flex"}}>
                  <h5>{categoria === "" ? defaultCategoria : categoria}</h5> 
                  <h5 className="px-3">{estado === "" ? defaultEstado : estado}</h5>
              </div>
              <h6>{descripcion === "" ? defaultDescripcion : descripcion}</h6>
            </div>

            
            <div style={{ flex: "0.7", padding: "10px", border: "1px solid #ccc" }}>
              <div className="d-flex align-items-center"> 
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
            </div>
            </div>

          </div>
        </div>
          
        

        
        
        
        
    </div>
  )
}

export default PublicarArticulo

const imgdemas = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA6ElEQVR4nO2ZUQrCMAyGexB99iKNegNZ9iI2l9sQdrFp7S5QqS8OcUgrtIX9H+R5/7+kKU2UAgCAatmfzltic9WNTMTic4ZuZNIsw6G97JLFa5ZbbuH0aYTNPWiJNhD+fGnx9I4+2kCJsqHlcnIJGSgvnGYBA7SmDIzWfQ0YiAEZsCghj0NM6EKuzjY6LvT5f4NgYAYyYFFCHoeYcA+4Ou8BwntAkIGfoIQsHjQecyGqYCJHq53M6YqGu8TmEW+AZajIQBdtIGxGwnKhuPhGxmMrG5W+YpI+zOdzC9evb5ouWTwAAKgcPAF1HK9L/+dO1QAAAABJRU5ErkJggg==';

