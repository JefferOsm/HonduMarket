/* eslint-disable react/prop-types */
import  {useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { usarAutenticacion } from '../context/autenticacion';
import { usarProductosContex } from '../context/productosContext';
import Carousel from 'react-multi-carousel';
import ReactStars from "react-rating-stars-component";
import { Collapse } from 'react-bootstrap';

function UsuarioModal ({show,handleClose}) {
  const {autenticado,usuario} = usarAutenticacion();
  const {usuarioProduct,obtenerCalificaciones,detailProduct,obtenerComentarios,agregarCalificacion,editarCalificacion} = usarProductosContex();
 


  // Nuevo estado para almacenar las calificaciones
  const [calificaciones, setCalificaciones] = useState(null);
  const [comentarios, setComentarios] = useState(); 
  const [formValues, setFormValues] = useState({ calificacion: 0, comentario: '', idComentarioEditando: null })
  const [open, setOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const usuarioYaComento = (username) => {
    // Buscar en la lista de comentarios si ya existe un comentario de este usuario
    if (comentarios) {
      const comentarioExistente = comentarios.find(comentario => comentario.autor === username);
      return comentarioExistente !== undefined;
    }
    return false;
  };


  useEffect(()=>{
    const fetchCalificaciones = async () => {
      if(detailProduct.idUsuario) {
        const result = await obtenerCalificaciones(detailProduct.idUsuario);
        setCalificaciones(result);
        //console.log(result);
      }

      if(detailProduct.idUsuario) {
        const result = await obtenerComentarios(detailProduct.idUsuario);
        setComentarios(result);
        //console.log(result);
      }
    }
    
    fetchCalificaciones();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[detailProduct.idUsuario])

  //ACTUALIZAR PROMEDIO DE CALIFICACIONES
  const [promedioCalificaciones, setPromedioCalificaciones] = useState(0);

  useEffect(() => {
    if (calificaciones && calificaciones.length > 0) {
      setPromedioCalificaciones(Number(calificaciones[0].promedio_calificaciones));
    }
  }, [calificaciones]);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} className='modal-dialog-centered'>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>

        {autenticado ? (
          <>
            <div className='container-fluid'>
              <div className='rounded-circle mx-auto shadow' 
              style={{backgroundImage:`url(${usuarioProduct.url_imagen})`, width:'80px', height:'80px',
               backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>
              </div>

              <p className='text-center fs-5 mt-2 text-secondary'>@{usuarioProduct.username}</p>

              <div className='d-flex mt-4 justify-content-center'>
                <div>
                  <p className='fs-5 fw-semibold'><FontAwesomeIcon icon={faEnvelope}/> Correo</p>
                  <p className='text-secondary fw-bold fs-6'>{usuarioProduct.correo}</p>
                </div>

                <div className='ms-4'>
                  <p className='fs-5 fw-semibold'><FontAwesomeIcon icon={faPhone}/> Telefóno</p>
                  <p className='text-secondary fw-bold fs-6'>+504 {usuarioProduct.telefono}</p>
                </div>
              </div>

            </div>
            <h5 className='mt-4'>Opiniones del vendedor:</h5>
            {calificaciones && calificaciones.length > 0 && (
                <div className='d-flex'>
                  <ReactStars
                    count={5}
                    value={promedioCalificaciones ? promedioCalificaciones : 0}
                    size={24}
                    isHalf={true} // Permite medias estrellas
                    edit={false} // Hace que las estrellas sean solo de lectura
                    activeColor="#ffd700"
                  />

                  <p className='ms-2' style={{ marginTop: '6px' }}>
                    {typeof promedioCalificaciones === 'number' 
                      ? promedioCalificaciones.toFixed(1) 
                      : promedioCalificaciones}
                  </p>
                </div>
            )}

            <Carousel responsive={responsive} showDots={true} infinite={true}
              autoPlay={true}  autoPlaySpeed={4000} >
              {comentarios && comentarios.map((comentario,index) => (
                <div className="card bg-primary-light shadow text-decoration-none mb-3 mt-2 mx-2"  key={index}>
                  <div className="card-body"  style={{ height: '10rem'}}>
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
            </Carousel>
            

            <div className="container p-4">
              <div className="row justify-content-center">
                <div className="col-md-12">
                  {usuario.username !== usuarioProduct.username && (
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
                              await editarCalificacion({
                                usuario_id: detailProduct.idUsuario,
                                autor: usuario.username,
                                calificacion: formValues.calificacion,
                                comentario: formValues.comentario
                              });
                            } else {
                              await agregarCalificacion({
                                usuario_id: detailProduct.idUsuario,
                                autor: usuario.username,
                                calificacion: formValues.calificacion,
                                comentario: formValues.comentario
                              });
                            }

                            // Restablecer formValues después de enviar el formulario
                            setFormValues({ calificacion: 0, comentario: '' });

                            // Actualizar las calificaciones y comentarios
                            const calificacionesResult = await obtenerCalificaciones(detailProduct.idUsuario);
                            setCalificaciones(calificacionesResult);
                            const comentariosResult = await obtenerComentarios(detailProduct.idUsuario);
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

                          <button type="submit" className="btn fw-bold bc-secondary">Enviar</button>
                        </form>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            </div>

          </>
        ):(
          <>
          <div>
            <p className='justify text-dark fw-bold fs-6'>
              Debes inciar sesión para ver la información de contacto
            </p> 
            <Link to={'/login'} className='btn bc-secondary'>Inicia Sesión</Link>
          </div> 
          </>
        )}


      </Modal.Body>

    </Modal>
  )
}

export default UsuarioModal