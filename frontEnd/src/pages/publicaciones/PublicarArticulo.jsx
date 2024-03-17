import React, { useEffect, useState } from "react"
import { useForm } from 'react-hook-form';
import { usarProductosContex } from "../../context/productosContext";
import SeleccionFechaHora from "../../components/SeleccionFechaHora";

function PublicarArticulo() {
  const { obtenerCategorias, obtenerDepartamentos, obtenerEstados, categorias,
    departamentos, estados, agregarPublicacion, subirVideoPublicacion } = usarProductosContex();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  
  function eliminarImagen() {
    const carruselItem = this.parentNode;
    carruselItem.remove();
  
    // Obtener la lista de todos los elementos del carrusel
    const carruselItems = document.querySelectorAll('.carousel-item');
  
    // Verificar si el elemento eliminado era el activo
    if (carruselItem.classList.contains('active')) {
      // Activar el siguiente elemento en la lista o el último si no hay más elementos siguientes
      const nextIndex = Array.from(carruselItems).indexOf(carruselItem) + 1;
      const nextItem = nextIndex < carruselItems.length ? carruselItems[nextIndex] : carruselItems[carruselItems.length - 1];
      nextItem.classList.add('active');
    }
  }
  
  


  //Funcion para agregar imagenes al carrucel
  function Agregarimagen() {
    const inputArchivo = document.getElementById("imagenes");
    const contenedorImagenes = document.getElementById("contenedor-imagenes");
    const archivos = inputArchivo.files;

    // Iterar sobre cada archivo seleccionado
    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];

      // Contar las imágenes existentes
      const numeroImagenes = contenedorImagenes.querySelectorAll("img").length;
      const numeroVideos = contenedorImagenes.querySelectorAll("video").length;
      // Verificar selección de archivo y límite
      if (!archivos || numeroImagenes >= 6) {
        return alert("Solo se pueden escoger 6 Imagenes");
      }

      if (numeroImagenes == 0 && numeroVideos == 0) {

        //crear el div que sera un item del carrucel
        const div = document.createElement("div");
        div.className = "carousel-item active text-center";
        div.id = numeroImagenes;

        // Crear la primera imagen
        const imagen = document.createElement("img");
        imagen.src = URL.createObjectURL(archivo);
        imagen.className = "d-block w-100";

        // Se agrega la imagen y el boton al div 
        div.appendChild(imagen);

        // Crear un botón de eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn-delete border";
        botonEliminar.textContent = "X";
        botonEliminar.addEventListener("click", eliminarImagen.bind(botonEliminar));
        // Se agrega el botón de eliminar al div
        div.appendChild(botonEliminar);

        // Agregar la primera imagen al contenedor
        contenedorImagenes.appendChild(div);


      } else {

        //crear el div que sera un item del carrucel
        const div = document.createElement("div");
        div.className = "carousel-item text-center";

        // Crear una nueva imagen
        const imagen = document.createElement("img");
        imagen.src = URL.createObjectURL(archivo);
        imagen.className = "d-block w-100";

        // Se agrega la imagen y el div del boton al div 
        div.appendChild(imagen);

        // Crear un botón de eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn-delete border";
        botonEliminar.textContent = "X";
        botonEliminar.addEventListener("click", eliminarImagen.bind(botonEliminar));
        // Se agrega el botón de eliminar al div
        div.appendChild(botonEliminar);

        // Agregar la imagen al contenedor
        contenedorImagenes.appendChild(div);
      }
    }
  }


  //Funcion para agregar el video al carrucel
  function AgregarVideo() {
    const inputArchivo = document.getElementById("video");
    const archivo = inputArchivo.files[0];
    const contenedorVideos = document.getElementById("contenedor-imagenes");
    // Contar los videos existentes
    const numeroVideos = contenedorVideos.querySelectorAll("video").length;
    const numeroImagenes = contenedorVideos.querySelectorAll("img").length;


    // Verificar selección de archivo y límite
    if (!archivo || numeroVideos >= 1) {
      return alert("Solo se pueden escoger 1 video");
    }

    if (numeroImagenes == 0 && numeroVideos == 0) {
      const div = document.createElement("div");
      div.className = "carousel-item active";

      // Crear un elemento de video
      const video = document.createElement("video");
      video.className = "d-block w-100"
      video.controls = true;
      video.autoplay = true;
      video.loop = true;


      // Crear un source para el video
      const source = document.createElement("source");
      source.src = URL.createObjectURL(archivo);
      source.type = "video/mp4"; // Cambia el tipo de video según sea necesario

      // Agregar el source al video
      video.appendChild(source);

      // Agregar el video al div
      div.appendChild(video);

      // Crear un botón de eliminar
      const botonEliminar = document.createElement("button");
      botonEliminar.className = "btn-delete border";
      botonEliminar.textContent = "X";
      botonEliminar.addEventListener("click", eliminarImagen.bind(botonEliminar));
      // Se agrega el botón de eliminar al div
      div.appendChild(botonEliminar);

      // Agregar el div al contenedor de videos
      contenedorVideos.appendChild(div);
      alert("se agrego el video");
    } else {
      const div = document.createElement("div");
      div.className = "carousel-item";

      // Crear un elemento de video
      const video = document.createElement("video");
      video.className = "d-block w-100"
      video.controls = true;
      video.autoplay = true;
      video.loop = true;


      // Crear un source para el video
      const source = document.createElement("source");
      source.src = URL.createObjectURL(archivo);
      source.type = "video/mp4"; // Cambia el tipo de video según sea necesario

      // Agregar el source al video
      video.appendChild(source);

      // Agregar el video al div
      div.appendChild(video);

      // Crear un botón de eliminar
      const botonEliminar = document.createElement("button");
      botonEliminar.className = "btn-delete border";
      botonEliminar.textContent = "X";
      botonEliminar.addEventListener("click", eliminarImagen.bind(botonEliminar));
      // Se agrega el botón de eliminar al div
      div.appendChild(botonEliminar);

      // Agregar el div al contenedor de videos
      contenedorVideos.appendChild(div);
      alert("se agrego el video");
    }
  }

  




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
  useEffect(() => {
    obtenerCategorias()
    obtenerDepartamentos()
    obtenerEstados()
  }, [])

  //Peticion
  const onSubmit = handleSubmit(async (values) => {
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

    const idProdAct = await agregarPublicacion(formData);
    console.log(idProdAct)

    if (values.video.length > 0) {
      const dataVideo = new FormData();
      dataVideo.append('video', values.video[0])

      await subirVideoPublicacion(idProdAct, dataVideo);
    }

    reset();
    setText("");
    setDescipcion("");
    setprecio("");
    setcategoria("");
    setestado("");
    setdepartamento("");
    const contenedorImagenes = document.getElementById("contenedor-imagenes");
    contenedorImagenes.innerHTML = "";

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
    setcategoria(defaultCategoria + ' : ' + categoriaSeleccionada.nombre_categoria);
  };

  const Estado = (event) => {
    const id = event.target.value;
    const estadoSeleccionado = estados.find(estado => estado.id_estado === Number(id));
    setestado(defaultEstado + ' : ' + estadoSeleccionado.nombre_estado);
  };

  const Departamento = (event) => {
    const id = event.target.value;
    const departamentoSeleccionado = departamentos.find(departamento => departamento.id_departamento === Number(id));
    setdepartamento(defaultDepartamento + '  ' + departamentoSeleccionado.nombre_departamento);
  };

  return (
    <div className="contenedor-publicar">
      <div className="card py-3 px-3 col-auto">
        <h3 className="fw-bold text-center">Registra tu producto</h3>
        <form className="col py-2" onSubmit={onSubmit}>

          {/* Registro nombre */}
          <input type="text" className="form-control" placeholder="Titulo" aria-label="Titulo"
            {...register('nombre', { required: true, onChange: (e) => { Titulo(e) } })} />

          {
            errors.nombre && (
              <p className="text-danger">El Campo es Obligatorio</p>
            )
          }

          {/* Registro Descripcion */}
          <label className="form-label py-2">Descripción</label>
          <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
            {...register('descripcion', { required: true, onChange: (e) => { Descripcion(e) } })}></textarea>

          {
            errors.descripcion && (
              <p className="text-danger"> El Campo es Obligatorio</p>
            )
          }

          {/* Registro Precio */}
          <div className="input-group py-2" style={{ width: "20vw", borderRadius: "5px" }}>
            <div className="input-group-text">Lps</div>
            <input type="number" className="form-control" placeholder="Precio" aria-label="Precio" required
              {...register('precio', { required: true, onChange: (e) => { Precio(e) } })} />

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
              {...register('categoria', { required: true, onChange: (e) => { Categoria(e) } })}>

              <option value="">Selecciona una opcion</option>
              {categorias.map(categoria => (
                <option value={categoria.categoria_id} key={categoria.categoria_id}>{categoria.nombre_categoria} </option>
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
              {...register('estado', { required: true, onChange: (e) => { Estado(e) } })}>
              <option value="">Selecciona una opcion</option>
              {estados.map(estado => (
                <option value={estado.id_estado} key={estado.id_estado}>{estado.nombre_estado}</option>
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
              {...register('departamento', { required: true, onChange: (e) => { Departamento(e) } })}>
              <option value="">Selecciona una opcion</option>
              {departamentos.map(departamento => (
                <option value={departamento.id_departamento} key={departamento.id_departamento}>{departamento.nombre_departamento}</option>
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
                style={{ background: "lightGray" }} htmlFor="imagenes">
                <p className="h5">Agregar Fotos</p>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "35px", height: "30px" }} fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                  <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                  <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
                </svg>
                <img src={imgdemas} alt="Agregar Fotos" width="35" height="35" />
              </label>

              <input
                type='file' className='form-control' accept='image/*'
                {...register('imagenes', { required: true })} id='imagenes' style={{ display: 'none' }}
                multiple onChange={Agregarimagen} />

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
                style={{ background: "lightGray" }} htmlFor="video">
                <p className="h5">Agregar Video</p>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "35px", height: "30px" }} fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                  <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                  <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
                </svg>
                <img src={imgdemas} alt="Agregar Fotos" width="35" height="35" />
              </label>

              <input
                type='file' className='form-control' accept='video/*'
                {...register('video')} id='video' style={{ display: 'none' }} onChange={AgregarVideo}
              />


            </div>
          </div>

          {/*Boton para decidir si se programa el registro o se publica de un solo */}
          <div className="py-3">
            <ul className="list-group">
              <div className="accordion accordion-flush" id="accordionFlushExample">
                {/*Primera opcion para subir la publicacion */}
                <div className="accordion-item">
                  <li className="list-group-item bg-dark-subtle">
                    <div className="form-check">
                      <input className="form-check-input bg-secondary collapsed" type="radio" name="flexRadioDefault" id="flexRadioDefault1" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne" />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Subir al instante
                      </label>
                    </div>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                      
                    </div>
                  </li>
                </div>

              {/*Segunda opcion para subir la publicacion se cra un acordion*/}
                <div className="accordion-item">
                  <li className="list-group-item bg-dark-subtle">
                    <div className="form-check">
                      <input className="form-check-input bg-secondary collapsed" type="radio" name="flexRadioDefault" id="flexRadioDefault1" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo" />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Programar fecha de subida
                      </label>
                    </div>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                      <SeleccionFechaHora/>
                    </div>
                  </li>
                </div>
              </div>
            </ul>
          </div>

          {/*Boton para guardar el producto en la BD */}
          <div className="vstack gap-2 col-md-5 mx-auto">
          <button type="submit" className="btn btn-primary">Publicar</button>
          </div>

        </form>
      </div>

      {/*Card de la vista previa del producto a registrar*/}
      <div className="card shadow-lg bg-white rounded" style={{ margin: "3%", flexGrow: "100", display: "flex", flexDirection: "row" }}>
        <div className="card-secction" style={{ flex: "1", padding: "10px", border: "1px solid #ccc" }}>
          <h6 className="card-title">Vista previa</h6>
          {/*Apartado donde irian las imagenes que se suban antes de guardar el producto*/}
          <div id="carouselExampleIndicators" className="carousel slide">
            <div className="carousel-indicators" id="contenedor-botones">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="5" aria-label="Slide 6"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="6" aria-label="Slide 7"></button>

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

        {/*Informacion del Producto*/}
        <div className="card-secction" style={{ flex: "0.7", padding: "10px", border: "1px solid #ccc" }}>
          <h1>{text === "" ? defaultTitulo : text}</h1>
          <h5>{precio === "" ? defaultPrecio : precio}</h5>
          <h6>{departamento === "" ? defaultDepartamento : departamento}</h6>
          <h5>Detalle</h5>
          <div style={{ display: "flex" }}>
            <h5>{categoria === "" ? defaultCategoria : categoria}</h5>
            <h5 className="px-3">{estado === "" ? defaultEstado : estado}</h5>
          </div>
          <p>{descripcion === "" ? defaultDescripcion : descripcion}</p>
        </div>
      </div>
    </div>
  )
}

export default PublicarArticulo

const imgdemas = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA6ElEQVR4nO2ZUQrCMAyGexB99iKNegNZ9iI2l9sQdrFp7S5QqS8OcUgrtIX9H+R5/7+kKU2UAgCAatmfzltic9WNTMTic4ZuZNIsw6G97JLFa5ZbbuH0aYTNPWiJNhD+fGnx9I4+2kCJsqHlcnIJGSgvnGYBA7SmDIzWfQ0YiAEZsCghj0NM6EKuzjY6LvT5f4NgYAYyYFFCHoeYcA+4Ou8BwntAkIGfoIQsHjQecyGqYCJHq53M6YqGu8TmEW+AZajIQBdtIGxGwnKhuPhGxmMrG5W+YpI+zOdzC9evb5ouWTwAAKgcPAF1HK9L/+dO1QAAAABJRU5ErkJggg==';

const video = 'https://ia600208.us.archive.org/9/items/video-de-whats-app-2024-03-15-a-las-11.23.51-c-6e-81cde/Video%20de%20WhatsApp%202024-03-15%20a%20las%2011.23.51_c6e81cde.mp4';