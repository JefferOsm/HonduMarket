import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { usarProductosContex } from '../../context/productosContext';
import { usarAutenticacion } from "../../context/autenticacion";
import UsuarioModal from '../../components/UsuarioModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player'
import DeletePublicacionModal from "../../components/DeletePublicacionModal";
import ModalChat from "../Chat/ModalChat";
import io from 'socket.io-client';



function VistaArticulo() {

    //funcionalidades para el modal de Usuario
    const [show, setShow] = useState(false);
    const [Chat, setChat] = useState(false);
    const handleClose = () => setShow(false);
    const ChatClose = () => setChat(false);

    const handleShow = () => {
      obtenerUsuario(detailProduct.idUsuario)
      setShow(true)
    };

    const handleChat = () => {
      obtenerUsuario(detailProduct.idUsuario)
      setChat(true)
    };

    //funcionalidades para el modal de Eliminar Publicacion
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => {
        setShowDelete(true)
    };
    

//Mostrar detalles
  // funcion para obtener el id de la url
    const {id} = useParams();
  //constante que recibe todas las publicaciones que existen
  const {autenticado,usuario} = usarAutenticacion();
  const { obtenerImagenes, obtenerDetalles,detailProduct,imagenesProduct,
    videoProduct, obtenerUsuario, agregarListaDeseos, mensajeDeseo,validarListaDeseo,validarLista} = usarProductosContex();



  //Lista de deseos
  const agregarDeseos = async(id)=>{
     await agregarListaDeseos(id)
     await validarListaDeseo(id)
  }

  //para ocultar boton si es mi producto el que visualizo
  const [botonListaUsuario,setBotonListaUsuario]=useState(null)

  //al cargar la pantalla
  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerDetalles(id);
      await obtenerImagenes(id);
      if(autenticado){
        await validarListaDeseo(id);
  
        if(usuario.id === detailProduct.idUsuario){
          setBotonListaUsuario(true);
          console.log(usuario);
        } else {
          setBotonListaUsuario(false);
        }
      }
    };

  
    cargarDatos();

  }, [autenticado, detailProduct.idUsuario, id, usuario]);

  // Convertir el número del precio con formato con comas
  const comas = (value) => {
    if (value !== undefined && value !== null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  };

  return (
    <>
    <div style={{overflow:'auto'}}>
      {/*card dinamica para que el tamano se ajuste a la pantalla y se divide en 2*/}
      <div className="container-md mt-2 shadow-lg bg-white rounded" style={{position:'relative'}}>
        
        {/*parte del card para presentar la imagen y videos si tiene*/}
          <div id="carouselExample" className="carousel slide mx-auto shadow contenedor-detalle" >
            <div className="carousel-inner detalle-publicacion-imagen">
              {imagenesProduct.map((imagen,index)=>(
                <div className={`carousel-item ${index === 0 ? 'active' : ''} mt-2 `} style={{width:'100%',objectFit:'cover'}} key={imagen.id_imagenesProd}>
                  <img src={imagen.url_imagen} className="d-block size-detalle-imagen" alt="..." key={imagen.id_imagenesProd}  />
                </div>
              ))}
              {videoProduct[0] && 

                <div className='carousel-item mt-2 ' style={{width:'100%',objectFit:'cover'}} >
                  <ReactPlayer className='size-detalle-imagen' url={videoProduct[0].url_video} 
                  controls
                  height={'350px'}
                  width={'100%'}
                  />
                </div>
              }

              
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>


        {/*parte del card para la informacion del producto como en la vista previa*/}
        <div className="contenedor-detalle mx-auto mt-3  contenedor-detalle-info mb-3" >
            
            {/*Informacion del producto*/}
            <div key={detailProduct.id}className="w-50-flex mb-3">
              <div className="d-flex ">
                <p className="fs-2 fw-bold">{detailProduct.nombre}</p>

                <div className=" w-30 text-center ms-4">
                {autenticado && !botonListaUsuario ? (
                    <>
                      {validarLista.length>0 ? (
                        <>
                          <button className='btn fw-bold fs-2 rounded-circle btn-deseo-true py-0'
                          onClick={()=> agregarDeseos(detailProduct.id)}>
                            <FontAwesomeIcon icon={faHeart}/>
                          </button>   
                        </>
                      ):(
                        <>
                          <button className='btn fw-bold fs-2 rounded-circle btn-deseo-false py-0'
                          onClick={()=> agregarDeseos(detailProduct.id)}>
                            <FontAwesomeIcon icon={faHeart}/>
                          </button>   
                        </>
                      )}
                    </>
                  ):(
                  <>
                       
                  </>
                  )}
                </div>
                                
            {
                mensajeDeseo.map((mensaje, i)=>(
                  <div className="alert mensaje-deseo p-2 text-light my-2 text-center custom-fade mx-auto" key={i} >
                    <FontAwesomeIcon icon={faCheckCircle}/> {mensaje}
                  </div>
                ))
            }
              </div>
              <p className="fs-3 fw-semibold text-info-emphasis">{"Lps " + comas(detailProduct.precio)}</p>
              <p className="size-detalle">{`Publicado ${detailProduct.fecha} en ${detailProduct.departamento}`}</p>
              <p className="fs-4">Detalles</p>
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <th scope="row">Categoria </th>
                    <td>{detailProduct.categoria}</td>
                  </tr>
                  <tr>
                    <th scope="row">Estado</th>
                    <td>{detailProduct.estado}</td>
                  </tr>
                </tbody>
              </table>
              <div>
                <p className="fs-4">Descripción</p>
                <p className="text-secondary fs-6">{detailProduct.descripcion}</p>
              </div>
            </div>

            {/*Informacion del vendedor*/}
            <div className="mb-3 w-50-flex">
                <div className="card p-4 shadow rounded ">  
                  <div className="d-flex justify-content-between flex-row align-items-center">
                    <div className="d-flex align-items-center">
                          <div className="rounded-circle"
                          style={{width:'65px', 
                          height:'65px', backgroundImage:`url(${detailProduct.fotoPerfil})`, backgroundRepeat:'no-repeat', backgroundSize:'cover'}}></div>
                          <div className="ms-3 fw-bold">{detailProduct.usuario}</div>
                    </div>
                    <div className="btn bc-primary text-light" onClick={handleShow}>Información</div>
                  </div>
                  {autenticado ? (
                    <>
                      <div className="btn bc-secondary fw-bold mt-3" onClick={handleChat}>Enviar Mensaje</div>   
                    </>
                  ):(
                  <>
                    <button className="btn bc-secondary fw-bold mt-3" disabled>Enviar Mensaje</button>   
                  </>
                  )}


                </div>  

            </div>
        </div>

        {botonListaUsuario ? (
          <>
            <button className="btn btn-outline-danger btn-eliminar-publicacion" onClick={handleShowDelete}>
                      <FontAwesomeIcon icon={faTrash}/> Eliminar
            </button>
          </>
        ):(
          <></>
        )}

      </div>
    </div>
    <UsuarioModal show={show} handleClose={handleClose} />
    <DeletePublicacionModal show={showDelete} handleClose={handleCloseDelete} id={detailProduct.id}  />
    <ModalChat show={Chat} handleClose={ChatClose} receptor={detailProduct.idUsuario} />
    </>
  )
}

export default VistaArticulo
const imagen = 'https://img.freepik.com/foto-gratis/retrato-abstracto-ojo-elegancia-mujeres-jovenes-generado-ai_188544-9712.jpg?size=626&ext=jpg&ga=GA1.1.117944100.1710115200&semt=ais';