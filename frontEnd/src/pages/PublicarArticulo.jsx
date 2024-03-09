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
        <div className="card py-3 px-3">
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

               
                
                


                <div className="modal-dialog py-4 modal-center modal-lg modal-dialog-rounded d-flex flex-column justify-content-center align-items-center" style={{background: "lightGray"}}>
                    <p className="h5">Agregar Fotos</p>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "35px", height: "35px" }} fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                        <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                        <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
                    </svg>
                    <img src={imgdemas} alt="Agregar Fotos" width="35" height="35" />
                </div>
               
                

            </div>
        </div>

        <div className="card shadow-lg bg-white rounded" style={{margin: "6%", flexGrow: "100", display: "flex", flexDirection: "row"}}>
        <div className="card-secction" style={{flex: "1", padding: "10px", border: "1px solid #ccc"}}>
            <h6 className="card-title">Vista previa</h6>
            
        </div>
        <div className="card-secction" style={{flex: "0.7", padding: "10px", border: "1px solid #ccc"}}>
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
        </div>


        
        
        
        
    </div>
  )
}

export default PublicarArticulo

const imgdemas = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA6ElEQVR4nO2ZUQrCMAyGexB99iKNegNZ9iI2l9sQdrFp7S5QqS8OcUgrtIX9H+R5/7+kKU2UAgCAatmfzltic9WNTMTic4ZuZNIsw6G97JLFa5ZbbuH0aYTNPWiJNhD+fGnx9I4+2kCJsqHlcnIJGSgvnGYBA7SmDIzWfQ0YiAEZsCghj0NM6EKuzjY6LvT5f4NgYAYyYFFCHoeYcA+4Ou8BwntAkIGfoIQsHjQecyGqYCJHq53M6YqGu8TmEW+AZajIQBdtIGxGwnKhuPhGxmMrG5W+YpI+zOdzC9evb5ouWTwAAKgcPAF1HK9L/+dO1QAAAABJRU5ErkJggg==';
