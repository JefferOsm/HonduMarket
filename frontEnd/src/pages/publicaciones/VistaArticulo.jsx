import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { usarProductosContex } from '../../context/productosContext';
import { usarAutenticacion } from "../../context/autenticacion";
import UsuarioModal from '../../components/UsuarioModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCloud, faCloudArrowDown, faCloudArrowUp, faHeart, faSquare, faSquarePen, faSquarePersonConfined, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player'
import DeletePublicacionModal from "../../components/DeletePublicacionModal";
import ModalChat from "../Chat/ModalChat";
import io from 'socket.io-client';
import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom';
import { Collapse, Button } from 'react-bootstrap';



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

  //funcionalidades para el modal de Editar Publicacion
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const navigate = useNavigate();
  const handleShowEdit = () => {
    navigate(`/Editar_articulo/${detailProduct.nombre}/${detailProduct.id}`);
  };

  const handleResubir = () => {
    cambiarEstadoPublicacion(detailProduct.id);
    alert("El producto ha sido publicado nuevamente");
    navigate("/perfil/publicaciones");
  };

  //Mostrar detalles
  // funcion para obtener el id de la url
  const { id } = useParams();
  //constante que recibe todas las publicaciones que existen
  const { autenticado, usuario } = usarAutenticacion();
  const { obtenerImagenes, obtenerDetalles, detailProduct, imagenesProduct,
    videoProduct, obtenerUsuario, agregarListaDeseos, mensajeDeseo, validarListaDeseo, validarLista, obtenerCalificaciones, cambiarEstadoPublicacion, obtenerCalificacionesProducto, obtenerComentariosProducto, agregarCalificacionProducto, editarCalificacionProducto, usuarioProduct } = usarProductosContex();



  //Lista de deseos
  const agregarDeseos = async (id) => {
    await agregarListaDeseos(id)
    await validarListaDeseo(id)
  }

  //para ocultar boton si es mi producto el que visualizo
  const [botonListaUsuario, setBotonListaUsuario] = useState(null)

  // Nuevo estado para almacenar las calificaciones
  const [calificaciones, setCalificaciones] = useState(null);



  //al cargar la pantalla
  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerDetalles(id);
      await obtenerImagenes(id);

      if (autenticado) {
        await validarListaDeseo(id);
        if (usuario.id === detailProduct.idUsuario) {
          setBotonListaUsuario(true);
          console.log(usuario);
          console.log(id);
        } else {
          setBotonListaUsuario(false);
        }
      }
    };


    cargarDatos();
  }, [autenticado, id, usuario, detailProduct.idUsuario]);


  useEffect(() => {
    const fetchCalificaciones = async () => {
      if (detailProduct.idUsuario) {
        const result = await obtenerCalificaciones(detailProduct.idUsuario);
        setCalificaciones(result);
        //console.log(result);
      }
    }

    fetchCalificaciones();
  }, [detailProduct.idUsuario])

  useEffect(() => {
    setCalificaciones([]); // Borra las calificaciones actuales
    const fetchCalificaciones = async () => {
      if (detailProduct.idUsuario) {
        const result = await obtenerCalificaciones(detailProduct.idUsuario);
        setCalificaciones(result);
      }
    }

    fetchCalificaciones();
  }, [detailProduct]);



  //PRODUCTO CALIFICACIONES

  // Nuevo estado para almacenar los comentarios
  const [comentarios, setComentarios] = useState(null);
  const [calificacionesProducto, setCalificacionesProducto] = useState(null);
  const [calificacionProducto, setCalificacionProducto] = useState(null);
  const [formValues, setFormValues] = useState({ calificacion: 0, comentario: '' });
  const [open, setOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Función para verificar si un usuario ya comentó
  const usuarioYaComento = (username) => {
    // Verificar si el usuario es el propietario del producto
    if (usuario && detailProduct && usuario.id === detailProduct.idUsuario) {
      return true;
    }
    // Buscar en la lista de comentarios si ya existe un comentario de este usuario
    if (comentarios) {
      const comentarioExistente = comentarios.find(comentario => comentario.autor === username);
      return comentarioExistente !== undefined;
    }
    return false;
  };


  useEffect(() => {
    const fetchCalificacionesYComentarios = async () => {
      if (detailProduct.id) {
        const result = await obtenerCalificacionesProducto(detailProduct.id);
        setCalificacionesProducto(result);
        //console.log(result);

        const resultComentarios = await obtenerComentariosProducto(detailProduct.id);
        setComentarios(resultComentarios);
      }
    }

    fetchCalificacionesYComentarios();
  }, [detailProduct.id]);

  useEffect(() => {
    setCalificacionesProducto([]); // Borra las calificaciones actuales
    const fetchCalificacionesProductos = async () => {
      if (detailProduct.id) {
        const result = await obtenerCalificacionesProducto(detailProduct.id);
        setCalificacionesProducto(result);
      }
    }

    fetchCalificacionesProductos();
  }, [detailProduct]);


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
      <div style={{ overflow: 'auto' }}>
        {/*card dinamica para que el tamano se ajuste a la pantalla y se divide en 2*/}
        <div className="container-md mt-2 shadow-lg bg-white rounded" style={{ position: 'relative' }}>

          {/*parte del card para presentar la imagen y videos si tiene*/}
          <div id="carouselExample" className="carousel slide mx-auto shadow contenedor-detalle" >
            <div className="carousel-inner detalle-publicacion-imagen">
              {imagenesProduct.map((imagen, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''} mt-2 `} style={{ width: '100%', objectFit: 'cover' }} key={imagen.id_imagenesProd}>
                  <img src={imagen.url_imagen} className="d-block size-detalle-imagen" alt="..." key={imagen.id_imagenesProd} />
                </div>
              ))}
              {videoProduct[0] &&

                <div className='carousel-item mt-2 ' style={{ width: '100%', objectFit: 'cover' }} >
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
            <div key={detailProduct.id} className="w-50-flex mb-3">
              <div className="d-flex ">
                <p className="fs-2 fw-bold">{detailProduct.nombre}</p>

                <div className="w-30 text-center">
                  {autenticado && !botonListaUsuario ? (
                    <>
                      {validarLista.length > 0 ? (
                        <>
                          <button className='btn fw-bold fs-2 rounded-circle btn-deseo-true py-0'
                            onClick={() => agregarDeseos(detailProduct.id)}>
                            <FontAwesomeIcon icon={faHeart} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className='btn fw-bold fs-2 rounded-circle btn-deseo-false py-0'
                            onClick={() => agregarDeseos(detailProduct.id)}>
                            <FontAwesomeIcon icon={faHeart} />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>

                    </>
                  )}
                </div>

                {
                  mensajeDeseo.map((mensaje, i) => (
                    <div className="rounded mensaje-deseo text-light my-2 me-2 text-center custom-fade mx-auto p-1 " key={i} >
                      <FontAwesomeIcon icon={faCheckCircle} className="my-auto" /> {mensaje}
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
                      style={{
                        width: '65px',
                        height: '65px', backgroundImage: `url(${detailProduct.fotoPerfil})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
                      }}></div>
                    <div className="ms-3 fw-bold">
                      {detailProduct.usuario}
                      {calificaciones && calificaciones.length > 0 && (
                        <div className='d-flex'>
                          <ReactStars
                            count={5}
                            value={calificaciones[0].promedio_calificaciones ? Number(calificaciones[0].promedio_calificaciones) : 0}
                            size={24}
                            isHalf={true} // Permite medias estrellas
                            edit={false} // Hace que las estrellas sean solo de lectura
                            activeColor="#ffd700"
                          />
                          <p className='ms-2' style={{ marginTop: '6px' }}>
                            {typeof calificaciones[0].promedio_calificaciones === 'number'
                              ? calificaciones[0].promedio_calificaciones.toFixed(1)
                              : calificaciones[0].promedio_calificaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="btn bc-primary text-light" onClick={handleShow}>Información</div>
                </div>
                {autenticado ? (
                  <>
                    <td>Envía un mensaje al vendedor</td>
                    <input type="text" class="form-control bc-mensaje" id="mensaje" defaultValue={"Hola. ¿Sigue disponible?"} />
                    <div className="btn bc-secondary fw-bold mt-2" onClick={handleChat}>Enviar</div>
                  </>
                ) : (
                  <>
                    <td>Envíale un mensaje al vendedor</td>
                    <input type="text" class="form-control bc-mensaje" id="mensaje" defaultValue={"Hola. ¿Sigue disponible?"} />
                    <Link to={'/login'} className='btn bc-secondary fw-bold mt-2'>Enviar</Link>
                  </>
                )}
              </div>
            </div>
          </div>



          {botonListaUsuario ? (
            <>
              <button className="btn btn-outline-danger btn-eliminar-publicacion" onClick={handleShowDelete}>
                <FontAwesomeIcon icon={faTrash} /> Eliminar
              </button>
              <button className="btn btn-outline-primary btn-editar-publicacion" onClick={handleShowEdit}>
                <FontAwesomeIcon icon={faSquarePen} /> Editar
              </button>
              {detailProduct.producto_inactivo === 1 && (
                <button className="btn bc-secondary btn-resubir-publicacion" onClick={handleResubir}>
                  <FontAwesomeIcon icon={faCloudArrowUp} /> Resubir
                </button>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="container-md mt-2 shadow-lg bg-white rounded" style={{ position: 'relative' }}>
          <h5 className='mt-4'>Opiniones del producto:</h5>
          {calificacionesProducto && calificacionesProducto.length > 0 && (
            <div className='d-flex'>
              <ReactStars
                count={5}
                value={calificacionesProducto[0].promedio_calificacionesProductos ? Number(calificacionesProducto[0].promedio_calificacionesProductos) : 0}
                size={24}
                isHalf={true} // Permite medias estrellas
                edit={false} // Hace que las estrellas sean solo de lectura
                activeColor="#ffd700"
              />

              <p className='ms-2' style={{ marginTop: '6px' }}>
                {typeof calificacionesProducto[0].promedio_calificacionesProductos === 'number'
                  ? calificacionesProducto[0].promedio_calificacionesProductos.toFixed(1)
                  : calificacionesProducto[0].promedio_calificacionesProductos}
              </p>
            </div>
          )}
          <div>
            {comentarios && comentarios.map((comentario, index) => (
              <div className="card bg-primary-light shadow text-decoration-none mb-3 mt-2 mx-2" key={index}>
                <div className="card-body" style={{ height: '10rem' }}>
                  <h5 className="card-title fw-semibold" style={{ fontSize: '0.9rem' }}>{comentario.autor}</h5>
                  <ReactStars
                    count={5}
                    value={comentario.calificacion}
                    size={24}
                    isHalf={true} // Permite medias estrellas
                    edit={false} // Hace que las estrellas sean solo de lectura
                    activeColor="#ffd700"
                  />
                  <div className="card-text">
                    <div className='card-descripcion fw-light' style={{ fontSize: '0.8rem' }}>
                      <p>{comentario.comentario}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="container p-4">
              <div className="row justify-content-center">
                <div className="col-md-12">
                  {usuario && detailProduct && usuario.id !== detailProduct.idUsuario && (
                    <Button
                      onClick={() => setOpen(!open)}
                      aria-controls="example-collapse-text"
                      aria-expanded={open}
                      className="mb-3"
                    >
                      Envia tu opinión
                    </Button>
                  )}
                  {submitSuccess && (
                    <div style={{
                      color: 'green',
                      backgroundColor: '#d4edda',
                      borderColor: '#c3e6cb',
                      padding: '10px',
                      marginTop: '10px',
                      borderRadius: '5px',
                      textAlign: 'center',
                    }}>
                      Tu opinión ha sido publicada con éxito.
                    </div>
                  )}


                  <Collapse in={open}>
                    <div className="card bc-degrate text-light shadow">
                      <div className="card-body">
                        <form className="p-4" onSubmit={async (e) => {
                          e.preventDefault();

                          if (usuarioYaComento(usuario.username)) {
                            await editarCalificacionProducto({
                              producto_id: detailProduct.id,
                              autor: usuario.username,
                              calificacion: formValues.calificacion,
                              comentario: formValues.comentario
                            });
                          } else {
                            await agregarCalificacionProducto({
                              producto_id: detailProduct.id,
                              autor: usuario.username,
                              calificacion: formValues.calificacion,
                              comentario: formValues.comentario
                            });
                          }
                          if (formValues.imagen) {
                            await subirImagen(formValues.imagen);
                          }

                          // Restablecer formValues después de enviar el formulario
                          setFormValues({ calificacion: 0, comentario: '' });

                          // Actualizar las calificaciones y comentarios
                          const calificacionesResult = await obtenerCalificacionesProducto(detailProduct.id);
                          setCalificacionProducto(calificacionesResult);
                          const comentariosResult = await obtenerComentariosProducto(detailProduct.id);
                          setComentarios(comentariosResult);

                          // Establecer submitSuccess en true para mostrar el mensaje de éxito
                          setSubmitSuccess(true);

                          // Cerrar el formulario
                          setOpen(false);
                        }}>
                          <h2 className="text-center fw-bold">Envia tu opinión</h2>

                          <div className="mb-3">
                            <label className="form-label">Calificación</label>
                            <ReactStars
                              count={5}
                              value={formValues.calificacion ? Number(formValues.calificacion) : 0}
                              onChange={(newRating) => {
                                setFormValues({ ...formValues, calificacion: newRating });
                              }}
                              size={24}
                              activeColor="#ffd700"
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Comentario</label>
                            <input
                              type="text"
                              name="comentario"
                              className="form-control"
                              placeholder="Comentario"
                              value={formValues.comentario}
                              onChange={(e) => setFormValues({ ...formValues, comentario: e.target.value })}
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Imagen</label>
                            <input
                              type="file"
                              name="imagen"
                              className="form-control"
                              onChange={(e) => setFormValues({ ...formValues, imagen: e.target.files[0] })}
                            />
                          </div>

                          <button type="submit" className="btn fw-bold bc-secondary">Enviar</button>
                        </form>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <UsuarioModal show={show} handleClose={handleClose} />
      <DeletePublicacionModal show={showDelete} handleClose={handleCloseDelete} id={detailProduct.id} />
      {/*<EditarProductoModal show={showEdit} handleClose={handleCloseEdit} id={detailProduct.id} />*/}
      <ModalChat show={Chat} handleClose={ChatClose} receptor={detailProduct.idUsuario} />
    </>
  )
}

export default VistaArticulo
const imagen = 'https://img.freepik.com/foto-gratis/retrato-abstracto-ojo-elegancia-mujeres-jovenes-generado-ai_188544-9712.jpg?size=626&ext=jpg&ga=GA1.1.117944100.1710115200&semt=ais';