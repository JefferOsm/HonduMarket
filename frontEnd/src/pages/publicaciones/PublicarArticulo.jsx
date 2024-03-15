import React, { useEffect, useState } from "react"
import {useForm} from 'react-hook-form';
import { usarProductosContex } from "../../context/productosContext";

function PublicarArticulo () {

  const {obtenerCategorias,obtenerDepartamentos,obtenerEstados,categorias,
        departamentos,estados,agregarPublicacion,subirVideoPublicacion} = usarProductosContex();
  const {register, handleSubmit, formState:{errors}} = useForm();

  //Vista Previa
  const [text, setText] = useState("");
  const [descripcion, setDescipcion] = useState("");
  const [precio, setprecio] = useState("");
  const [categoria, setcategoria] = useState("");
  const [estado, setestado] = useState("");
  const [departamento, setdepartamento] = useState("");

  const comas = (value) => {
    // Convertir el número a cadena y aplicar el formato con comas
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  
  const defaultTitulo = "Titulo";
  const defaultDescripcion = "La descripcion aparecera aqui";
  const defaultPrecio = "Precio";
  const defaultCategoria = "Categoria";
  const defaultEstado = "Estado";
  const defaultDepartamento = "Publicado hace unos segundos en";

  
//Traer datos de dep,cat,est
  useEffect(()=>{
    obtenerCategorias()
    obtenerDepartamentos()
    obtenerEstados()
  },[])

  //Peticion
  const onSubmit = handleSubmit(async(values)=>{
    //DATOS Y FOTOS
    const formData = new FormData();
    const imagenes = document.querySelector('input[type="file"]').files;
    formData.append('nombre', values.nombre);
    formData.append('descripcion', values.descripcion);
    formData.append('precio', values.precio);
    formData.append('categoria', values.categoria);
    formData.append('estado', values.estado);
    formData.append('departamento', values.departamento);
    
    for (let i = 0; i < imagenes.length; i++) {
        formData.append('imagenes', imagenes[i]);
    }

    //console.log(formData)

   const idProdAct= await agregarPublicacion(formData);
   console.log(idProdAct)

    if(values.video.length>0){
      const dataVideo = new FormData();
      dataVideo.append('video', values.video[0])

      await subirVideoPublicacion(idProdAct, dataVideo);
    }

  })

  //Vista Previa (Datos)
    const Titulo = (event) => {
      setText(event.target.value);

    };

    const Descripcion = (event) => {
        setDescipcion(event.target.value);
      };

      const Precio = (event) => {
        setprecio("Lps " + comas(event.target.value));
      };

      const Categoria = (event) => {
        const id = event.target.value;
        const categoriaSeleccionada = categorias.find(categoria => categoria.categoria_id === Number(id));
        setcategoria(defaultCategoria +' : '+ categoriaSeleccionada.nombre_categoria);
      };

      const Estado = (event) => {
        const id = event.target.value;
        const estadoSeleccionado = estados.find(estado => estado.id_estado === Number(id));
        setestado(defaultEstado+' : '+estadoSeleccionado.nombre_estado);
      };

      const Departamento = (event) => {
        const id = event.target.value;
        const departamentoSeleccionado = departamentos.find(departamento => departamento.id_departamento=== Number(id));
        setdepartamento(defaultDepartamento +'  '+ departamentoSeleccionado.nombre_departamento);
      };

  return (
    <div className="contenedor-publicar">
        <div className="card py-3 px-3 col-md-4">
            <h3 className="fw-bold">Registra tu producto</h3>
            <form className="col py-2" onSubmit={onSubmit}>

              {/* Registro nombre */}
                <input type="text" className="form-control" placeholder="Titulo" aria-label="Titulo"
                {... register ('nombre',{required:true, onChange:(e)=>{Titulo(e)}})} />

                {
                  errors.nombre && (
                    <p className="text-danger">El Campo es Obligatorio</p>
                  )
                }

                {/* Registro Descripcion */}
                <label className="form-label py-2">Descripción</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
                {... register('descripcion',{required:true, onChange:(e)=>{Descripcion(e)}})}></textarea>

                {
                  errors.descripcion && (
                    <p className="text-danger"> El Campo es Obligatorio</p>
                  )
                }
                
                {/* Registro Precio */}
                <div className="input-group py-2" style={{width:"15vw", borderRadius: "5px"}}>
                <div className="input-group-text">Lps</div>
                    <input type="number" className="form-control" placeholder="Precio" aria-label="Precio" required
                    {... register('precio',{required:true,  onChange:(e)=>{Precio(e)}}) }/>

                    {
                      errors.precio && (
                        <p className="text-danger"> El Campo es Obligatorio y Debe ser un número</p>
                      )
                    }                    
                </div>
                
                {/* Registro Categoria */}
                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Categoria</label>
                    <select className="form-select" id="inputGroupSelect01" onChange={Categoria}
                    {... register('categoria', {required:true,  onChange:(e)=>{Categoria(e)}})}>

                        <option  value="">Selecciona una opcion</option>
                        {categorias.map(categoria=>(
                           <option  value={categoria.categoria_id} key={categoria.categoria_id}>{categoria.nombre_categoria} </option>
                        ))}

                    </select>

                    
                    {
                      errors.categoria && (
                        <p className="ms-2 text-danger"> El Campo es Obligatorio</p>
                      )
                    }
                </div>

                {/* Registro de estado */}
                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Estado</label>
                    <select className="form-select" id="inputGroupSelect01" onChange={Estado}
                    {... register('estado',{required:true,onChange:(e)=>{Estado(e)} })}>
                    <option  value="">Selecciona una opcion</option>
                        {estados.map(estado=>(
                           <option  value={estado.id_estado} key={estado.id_estado}>{estado.nombre_estado}</option>
                        ))}
                    </select>
                    
                    {
                      errors.estado && (
                        <p className="ms-2 text-danger"> El Campo es Obligatorio</p>
                      )
                    }
                </div>

                {/* Registro de Departamento */}
                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Departamento</label>

                    <select className="form-select" id="inputGroupSelect01" onChange={Departamento}
                    {... register('departamento', {required:true,  onChange:(e)=>{Departamento(e)}})}>
                    <option  value="">Selecciona una opcion</option>
                    {departamentos.map(departamento=>(
                           <option  value={departamento.id_departamento} key={departamento.id_departamento}>{departamento.nombre_departamento}</option>
                        ))}

                    </select>

                    
                    {
                      errors.departamento && (
                        <p className="text-danger ms-2"> El Campo es Obligatorio</p>
                      )
                    }
                </div>

               
                
                {/* Registro de imagenes Y video*/}
                <div className="d-flex gap-5">
                  {/* Fotos */}

                    <div className="col-md-5"> 
                    <p>Fotos (Maximo 6)</p>
                        <label className=" py-4 modal-center modal-lg  d-flex flex-column justify-content-center align-items-center " 
                        style={{background: "lightGray"}} htmlFor="imagenes">
                          <p className="h5">Agregar Fotos</p>
                          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "35px", height: "30px" }} fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                              <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                              <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
                          </svg>
                          <img src={imgdemas} alt="Agregar Fotos" width="35" height="35" />
                        </label>

                    <input 
                    type='file' className='form-control' accept='image/*'
                    {... register('imagenes',{ required: true })} id='imagenes' style={{ display: 'none' }}
                      multiple />

                        {
                          errors.imagenes && (
                            <p className="ms-2 text-danger"> Seleccione minimo una imagen</p>
                          )
                        }

                    </div>

                        {/* Video */}

                    <div className="col-md-5">
                      <p> Video (Opcional)</p>
                        <label className=" py-4 modal-center modal-lg  d-flex flex-column justify-content-center align-items-center" 
                        style={{background: "lightGray"}} htmlFor="video">
                          <p className="h5">Agregar Video</p>
                          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "35px", height: "30px" }} fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                              <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                              <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
                          </svg>
                          <img src={imgdemas} alt="Agregar Fotos" width="35" height="35" />
                        </label>

                    <input 
                    type='file' className='form-control' accept='video/*'
                    {... register('video')} id='video' style={{ display: 'none' }}
                    />

                        
                    </div>
                </div>
               
               
               {/*Boton para guardar el producto en la BD */}
               <button type="submit" className="btn btn-primary mt-2">Publicar</button>
                

            </form>
        </div>

        {/*Card de la vista previa del producto ya registrado*/}
        <div className="card shadow-lg bg-white rounded" style={{margin: "6%", flexGrow: "100", display: "flex", flexDirection: "row"}}>
          
          {/*Apartado donde irian las imagenes que se suban antes de guardar el producto*/}
          <div className="card-secction" style={{flex: "1", padding: "10px", border: "1px solid #ccc"}}>
              <h6 className="card-title">Vista previa</h6>
          </div>
        
          {/*Informacion del Producto*/}
          <div className="card-secction" style={{flex: "0.7", padding: "10px", border: "1px solid #ccc"}}>
              <h1>{text === "" ? defaultTitulo : text}</h1>
              <h5>{precio === "" ? defaultPrecio : precio}</h5>
              <h6>{departamento === "" ? defaultDepartamento: departamento}</h6>
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
