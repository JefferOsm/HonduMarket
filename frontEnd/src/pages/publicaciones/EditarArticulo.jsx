import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { usarAutenticacion } from "../../context/autenticacion";
import { useForm } from 'react-hook-form';
import { usarProductosContex } from "../../context/productosContext";
import SeleccionFechaHora from "../../components/SeleccionFechaHora";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player';
import 'react-multi-carousel/lib/styles.css';


function EditarArticulo (){

  const { obtenerCategorias, obtenerDepartamentos, obtenerEstados, categorias,
    departamentos, estados, agregarPublicacion, subirVideoPublicacion } = usarProductosContex();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  //Mostrar detalles
  // funcion para obtener el id de la url
  const {id} = useParams();
  //constante que recibe todas las publicaciones que existen
  const {autenticado,usuario} = usarAutenticacion();
  const { obtenerImagenes, obtenerDetalles,detailProduct,imagenesProduct,
    videoProduct, obtenerUsuario, agregarListaDeseos, mensajeDeseo,validarListaDeseo,validarLista,obtenerCalificaciones} = usarProductosContex();

   //al cargar la pantalla
   useEffect(() => {
    const cargarDatos = async () => {
      await obtenerDetalles(id);
      await obtenerImagenes(id);
    };
    cargarDatos();
  }, [autenticado, id, usuario, detailProduct.idUsuario]);

  //Vista Previa
  const [text, setText] = useState("");
  const [descripcion, setDescipcion] = useState("");
  const [precio, setprecio] = useState("");
  const [categoria, setcategoria] = useState("");
  const [estado, setestado] = useState("");
  const [departamento, setdepartamento] = useState("");
  

    //imagenes que se enviaran al backend
    const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
    const[botonActive, setBotonActive]=useState(true)
    const[botonText, setBotonText]=useState('Publicar');

      //para programar publicacion
  const[fechaSeleccionada, setFechaSeleccionada] = useState(null)

    //opcion para subir
    const cammbiOpcion= (e)=>{
      setBotonActive(false);
      console.log(fechaSeleccionada)
    }

  const handleDateSelected = (date)=>{
    setFechaSeleccionada(date);
    
  }


  // Convertir el número a cadena y aplicar el formato con comas
  const comas = (value) => {
    if (typeof value === 'undefined') {
        return 'No sirve esta chanchada';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


  const defaultTitulo = detailProduct.nombre;
  const defaultDescripcion = detailProduct.descripcion;
  const defaultPrecio = comas(detailProduct.precio);
  const defaultCategoria = "Categoria: " + detailProduct.categoria;
  const defaultEstado = "Estado: " + detailProduct.estado;
  const defaultDepartamento = "Publicado hace unos segundos en "+ detailProduct.departamento;


  //Traer datos de dep,cat,est
  useEffect(() => {
    obtenerCategorias()
    obtenerDepartamentos()
    obtenerEstados()
  }, [])

  //Peticion
  const onSubmit = handleSubmit(async(values)=>{
    setBotonActive(true)
    setBotonText('Publicando ...')
    try {
       //DATOS Y FOTOS
    const formData = new FormData();

    if (text === ""){
      formData.append('nombre', detailProduct.nombre);
    }else{
      formData.append('nombre', values.nombre);
    }

    if (descripcion === ""){
      formData.append('descripcion', detailProduct.descripcion);
    }else{
      formData.append('descripcion', values.descripcion);
    }

    if (precio === ""){
      formData.append('precio', detailProduct.precio);
    }else{
      formData.append('precio', values.precio);
    }
    
    if (categoria === ""){
      formData.append('categoria', detailProduct.categoria);
    }else{
      formData.append('categoria', values.categoria);
    }
    
    if (estado === ""){
      formData.append('estado', detailProduct.estado);
    }else{
      formData.append('estado', values.estado);
    }
    
    if (departamento === ""){
      formData.append('departamento', detailProduct.departamento);
    }else{
      formData.append('departamento', values.departamento);
    }
    
    for (let i = 0; i < imagenesSeleccionadas.length; i++) {
        formData.append('imagenes', imagenesSeleccionadas[i]);
    }

    if(fechaSeleccionada){
      console.log(fechaSeleccionada)
      formData.append('fechaSubida', fechaSeleccionada)
      setBotonText('Programando ...')
    }

    console.log(formData)

   const idProdAct= await agregarPublicacion(formData);
   console.log(idProdAct)

    if(values.video.length>0){
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
    } catch (error) {
      console.log(error)
    } finally{
      setBotonActive(true)
      setBotonText('Publicar')
      if(fechaSeleccionada){
        window.alert('Tu publicacion Ha sido Programada')
      }else{
        window.alert('Se realizo tu Publicacion')
      }
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
        setcategoria('Categoria: '+ categoriaSeleccionada.nombre_categoria);
      };

      const Estado = (event) => {
        const id = event.target.value;
        const estadoSeleccionado = estados.find(estado => estado.id_estado === Number(id));
        setestado('Estado: '+estadoSeleccionado.nombre_estado);
      };

      const Departamento = (event) => {
        const id = event.target.value;
        const departamentoSeleccionado = departamentos.find(departamento => departamento.id_departamento=== Number(id));
        setdepartamento('Publicado hace unos segundos en '+ departamentoSeleccionado.nombre_departamento);
      };

       // urls de las imagenes que se usaran en vista previa
      const [imagenesPreview, setImagenesPreview] = useState([]);
      // urls que se usaran para vista previa de videos
      const [videoPreview, setVideoPreview] = useState('');

      useEffect(() => {
        // sacamos la url de la imagen y se la mandamos a los set correspondientes
        const urlsImagenes = imagenesProduct.map(imagen => imagen.url_imagen);
        setImagenesSeleccionadas(urlsImagenes);
        setImagenesPreview(urlsImagenes);
      }, [imagenesProduct]);

        // Función para generar la vista previa de las imágenes seleccionadas y para enviarlas al backend
      const generarVistaPreviaImagenes = (event) => {
        const files = event.target.files;
        const nuevasImagenesPreview = [...imagenesPreview]; 
        const imagenesForm= [];
        const limite= 6

        if(imagenesSeleccionadas.length + files.length > limite){
          window.alert('Solo se Permiten 6 imagenes Maximo');
          return
        }

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          imagenesForm.push(files[i])
          reader.onload = function (e) {
            nuevasImagenesPreview.push(e.target.result); 
            setImagenesPreview([...nuevasImagenesPreview]);
          };
          reader.readAsDataURL(file); 
        }
        setImagenesSeleccionadas([...imagenesSeleccionadas, ...imagenesForm]);
        console.log(imagenesSeleccionadas)
      };
      
        // Función para generar la vista previa del video seleccionado
      const generarVistaPreviaVideo = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
      };


      // variable de imagenes con el objeto a renderizar
      let vistaPreviaImagenes = imagenesPreview.map((url, index) => (
        <div className={`carousel-item ${index === 0 ? 'active' : ''} text-center`} key={index}>
           <img className="d-block w-100"  src={url} alt={`Imagen ${index}`} />
           <button type="button" className="btn-delete p-2 rounded mx-auto"  onClick={() => eliminarImagen(index)}><FontAwesomeIcon icon={faTrash}/></button>
        </div>
      ));

      // variable de imagenes con el objeto a renderizar
      let vistaPreviaVideo = videoPreview && (
        <div className="carousel-item text-center">
                  <ReactPlayer className='d-block w-100' url={videoPreview} controls/>
        </div>

      );

      //Funcion para eliminar imagen del carousel y del arreglo de archivos enviado al backend
      const eliminarImagen = (index) => {
          const nuevasImagenesPreview = [...imagenesPreview.slice(0, index), ...imagenesPreview.slice(index + 1)];
          setImagenesPreview(nuevasImagenesPreview);
          // Verificar si se eliminó la última imagen y no hay otras imágenes
          if (index === imagenesPreview.length - 1) {
            // Establecer el primer elemento como activo
            document.querySelector('.carousel-item:first-child').classList.add('active');
          }


          vistaPreviaImagenes = imagenesPreview.map((url, index) => (
          <div className={`carousel-item text-center`} key={index}>
            <img className="d-block w-100"  src={url} alt={`Imagen ${index}`} />
            <button type="button" className="btn-delete p-2 rounded mx-auto"  onClick={() => eliminarImagen(index)}><FontAwesomeIcon icon={faTrash}/></button>
          </div>
        ));

        const nuevasImagenesSeleccionadas = [...imagenesSeleccionadas.slice(0, index), ...imagenesSeleccionadas.slice(index + 1)];
        setImagenesSeleccionadas(nuevasImagenesSeleccionadas);
      };
  return (
    <div className="contenedor-publicar">
      <div className="card py-3 px-3 contenedor-publicar-content">
       <div className="card-body contenedor-publicar-form">
        <h3 className="fw-bold text-center">Registra tu producto</h3>
        <form className="col py-2" onSubmit={onSubmit}>

          {/* Registro nombre */}
          <input type="text" className="form-control" placeholder="Titulo" aria-label="Titulo"
            {...register('nombre', { onChange: (e) => { Titulo(e) } })} />

          {/* Registro Descripcion */}
          <label className="form-label py-2">Descripción</label>
          <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
            {...register('descripcion', { onChange: (e) => { Descripcion(e) } })}></textarea>

          {/* Registro Precio */}
          <div className="input-group py-2" style={{ width: "20vw", borderRadius: "5px" }}>
            <div className="input-group-text">Lps</div>
            <input type="number" className="form-control" placeholder="Precio" aria-label="Precio"
              {...register('precio', {onChange: (e) => { Precio(e) } })} />
          </div>

          {/* Registro Categoria */}
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputGroupSelect01">Categoria</label>
            <select className="form-select" id="inputGroupSelect01" onChange={Categoria}
              {...register('categoria', { onChange: (e) => { Categoria(e) } })}>

              <option value="">Selecciona una opcion</option>
              {categorias.map(categoria => (
                <option value={categoria.categoria_id} key={categoria.categoria_id}>{categoria.nombre_categoria} </option>
              ))}

            </select>
          </div>

          {/* Registro de estado */}
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputGroupSelect01">Estado</label>
            <select className="form-select" id="inputGroupSelect01" onChange={Estado}
              {...register('estado', { onChange: (e) => { Estado(e) } })}>
              <option value="">Selecciona una opcion</option>
              {estados.map(estado => (
                <option value={estado.id_estado} key={estado.id_estado}>{estado.nombre_estado}</option>
              ))}
            </select>

          </div>

          {/* Registro de Departamento */}
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputGroupSelect01">Departamento</label>

            <select className="form-select" id="inputGroupSelect01" onChange={Departamento}
              {...register('departamento', { onChange: (e) => { Departamento(e) } })}>
              <option value="">Selecciona una opcion</option>
              {departamentos.map(departamento => (
                <option value={departamento.id_departamento} key={departamento.id_departamento}>{departamento.nombre_departamento}</option>
              ))}

            </select>
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
                    {... register('imagenes',{ required: true, validate:{maxFiles: files => files.length <= 6}, onChange:(e)=>{generarVistaPreviaImagenes(e)}
                     })} id='imagenes' style={{ display: 'none' }}
                      multiple />
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
                    {... register('video',{onChange:(e)=>{generarVistaPreviaVideo(e)}})} id='video' style={{ display: 'none' }}
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
                      <input className="form-check-input bg-secondary collapsed" type="radio" 
                      name="flexRadioDefault" id="flexRadioDefault1" data-bs-toggle="collapse" 
                      data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne" 
                       onChange={cammbiOpcion}/>
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Publicar Ahora
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
                      <input className="form-check-input bg-secondary collapsed"
                       type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                        data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" 
                        aria-expanded="false" aria-controls="flush-collapseTwo"
                        onChange={cammbiOpcion}/>
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Programar Publicación
                      </label>
                    </div>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                      <SeleccionFechaHora onDateSelected={handleDateSelected} />
                    </div>
                  </li>
                </div>
              </div>
            </ul>
          </div>

          {/*Boton para guardar el producto en la BD */}
          <div className="vstack gap-2 col-md-5 mx-auto">
          <button type="submit" className="btn btn-primary" disabled={botonActive}>{botonText}</button>
          </div>

        </form>
        </div>
      </div>

      {/*Card de la vista previa del producto a registrar*/}
      <div className="card shadow-lg bg-white rounded contenedor-publicar-preview" >
          {/*Apartado donde irian las imagenes que se suban antes de guardar el producto*/}
          <div className="card-secction" style={{flex: "1", padding: "10px", border: "1px solid #ccc"}}>
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
                    {imagenesPreview.length > 0 ? (
                        <React.Fragment>
                          {vistaPreviaImagenes}
                          {vistaPreviaVideo}
                        </React.Fragment>
                      ) : (
                        <div className='carousel-item text-center active'>
                          <img className="d-block" src='../../../public/images/preview.jpg' alt='...' style={{height: "70vh", width: "35vw"}}/>
                        </div>
                      )}
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

export default EditarArticulo

const imgdemas = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA6ElEQVR4nO2ZUQrCMAyGexB99iKNegNZ9iI2l9sQdrFp7S5QqS8OcUgrtIX9H+R5/7+kKU2UAgCAatmfzltic9WNTMTic4ZuZNIsw6G97JLFa5ZbbuH0aYTNPWiJNhD+fGnx9I4+2kCJsqHlcnIJGSgvnGYBA7SmDIzWfQ0YiAEZsCghj0NM6EKuzjY6LvT5f4NgYAYyYFFCHoeYcA+4Ou8BwntAkIGfoIQsHjQecyGqYCJHq53M6YqGu8TmEW+AZajIQBdtIGxGwnKhuPhGxmMrG5W+YpI+zOdzC9evb5ouWTwAAKgcPAF1HK9L/+dO1QAAAABJRU5ErkJggg==';