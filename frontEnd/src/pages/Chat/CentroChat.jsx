import React, { useEffect, useState } from 'react'
import { usarChatContext } from '../../context/chatContext';
import { usarAutenticacion } from '../../context/autenticacion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function CentroChat() {
  const{obtenerUsuarios,obtenerConvProd,obtenerConvGen,
        obtenerConversacion, obtenerMsjGeneral}= usarChatContext();
  
  const {usuario}=usarAutenticacion();

  //estado para la navbar
  const [activo,setActivo]=useState('General')

  //evento al darle click a un link en la nav
  const handleLink=(opcion)=>{
    setActivo(opcion);
    setMostrarMsj(false);

    if(opcion==='General'){
      setConversaciones(convGen);
    }else if(opcion === 'Productos'){
      setConversaciones(convProd);
    }else if(opcion === 'Canales'){

    }
  }

  //formatear ultima hora de la conversacion
  function formatearHora(fechaString) {
    const fecha = new Date(fechaString);
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const amPm = horas >= 12 ? 'pm' : 'am';
    horas = horas % 12 || 12;
    return `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos} ${amPm}`;
  }
  //formatear la fecha de la ultima conversacion
  // Función de utilidad para formatear la fecha en formato "dd/mm/yyyy" o "hoy" si es la fecha actual
  function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const hoy = new Date();

    // Verificar si la fecha es hoy
    if (fecha.toDateString() === hoy.toDateString()) {
      return 'hoy';
    }

    // Formatear la fecha en formato "dd/mm/yyyy"
    const dia = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    const mes = fecha.getMonth() < 9 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    const año = fecha.getFullYear();

    return `${dia}/${mes}/${año}`;
  }
  

  //estados para las conversaciones
  const[usuariosChat,setUsuariosChat]= useState([]);   //usuarios totales disponibles para chatear
  const[convProd,setConvProd]= useState([]);  //conversaciones hechas por productos
  const[convGen,setConvGen]= useState([]); //conversaciones Generales
  const[mensajes,setmensajes]= useState([]); //mensajes de la convesacion
  const[mostrarMsj,setMostrarMsj]= useState(false); //estado usado para mostrar el apartado de mensajes

  const[conversaciones,setConversaciones]= useState([]); //estado general para conversaciones
  const [usuarioLog,setUsuarioLog]= useState([]);//estado para el usuario logeado

  useEffect(()=>{
    const cargarData= async()=>{
      const usuarios= await obtenerUsuarios();
      const convGen= await obtenerConvGen();
      const convProd= await obtenerConvProd();
      
      setUsuariosChat(usuarios);
      setConvGen(convGen);
      setConvProd(convProd);
      setConversaciones(convGen);
    }
    cargarData();
    setUsuarioLog(usuario.id);
  },[usuario]);


  const handleClickConversacion= (data)=>{
    const cargarConv= async(data)=>{
      try {
        if(data.producto){
          const msj= await obtenerConversacion(data);
          console.log(msj)
          setmensajes(msj);
        }else{
          const msj= await obtenerMsjGeneral(data);
          console.log(msj)
          setmensajes(msj);
        }

      } catch (error) {
        console.error('Error al obtener mensajes', error)
      }

    }
    cargarConv(data);
    setMostrarMsj(true);
  }


  return (
    <div
      className="card bc-lista-chat"
      style={{
        display: "flex",
        flexDirection: "row",
        height: "90.3vh",
        width: "100%",
      }}
    >
      {/*Apartado donde ira la lista de chat*/}
      <div
        className="card-secction overflow-y-auto"
        style={{ flex: "0.4", padding: "10px", width: "30%" }}
      >
        <nav className="navbar navbar-expand-lg  bc-lista-chat">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav mx-auto">
                <a
                  className={`nav-link text-light fs-6 mx-2  ${
                    activo === "General" ? "nav-chat-active" : ""
                  }`}
                  href="#"
                  onClick={() => {
                    handleLink("General");
                  }}
                >
                  General
                </a>

                <a
                  className={`nav-link text-light fs-6 mx-2  ${
                    activo === "Productos" ? "nav-chat-active" : ""
                  }`}
                  href="#"
                  onClick={() => {
                    handleLink("Productos");
                  }}
                >
                  Productos
                </a>

                <a
                  className={`nav-link text-light fs-6 mx-2  ${
                    activo === "Canales" ? "nav-chat-active" : ""
                  }`}
                  href="#"
                  onClick={() => {
                    handleLink("Canales");
                  }}
                >
                  Canales
                </a>
              </div>
            </div>
          </div>
        </nav>
        {/* Conversaciones */}
        <ul className="list-group">
          {/* Mostrar conversaciones generales entre ususarios */}
          {activo === "General" ? (
            <>
              {conversaciones.map((conversacion) => {
                const horaFormateada = formatearHora(
                  conversacion.fecha_ultimo_mensaje
                );
                const fechaFormateada = formatearFecha(
                  conversacion.fecha_ultimo_mensaje
                );
                return (
                  <li
                    className="p-2 bc-lista-chat-item text-light rounded-3 my-1 d-flex align-items-center"
                    key={conversacion.id}
                    onClick={() => {
                      handleClickConversacion({
                        emisor: usuario.id,
                        receptor: conversacion.id,
                      });
                    }}
                  >
                    <div
                      className="rounded-circle rounded float-start me-2"
                      style={{
                        backgroundImage: `url(${conversacion.foto})`,
                        width: "45px",
                        height: "45px",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div className="title d-flex flex-column">
                      <div className="fw-bold">@{conversacion.username}</div>
                      <div className="subtitle">{"¿Qué estás haciendo?"}</div>
                    </div>
                    <div className="d-felex flex-column ms-auto text-center">
                      <div>{horaFormateada}</div>
                      <div className="text-secondary">{fechaFormateada} </div>
                    </div>
                  </li>
                );
              })}
            </>
          ) : null}

          {/* Mostrar las conversaciones que tienen que ver con productos o servicios */}

          {activo === "Productos" ? (
            <>
              {conversaciones.map((conversacion) => {
                const horaFormateada = formatearHora(
                  conversacion.fecha_ultimo_mensaje
                );
                const fechaFormateada = formatearFecha(
                  conversacion.fecha_ultimo_mensaje
                );
                return (
                  <li
                    className="p-2 bc-lista-chat-item text-light rounded-3 my-1 d-flex align-items-center "
                    key={conversacion.producto_id}
                    onClick={() => {
                      handleClickConversacion({
                        emisor: usuario.id,
                        receptor: conversacion.id,
                        producto: conversacion.producto_id,
                      });
                    }}
                  >
                    <div
                      className="rounded-circle rounded float-start me-2"
                      style={{
                        backgroundImage: `url(${conversacion.imagen})`,
                        width: "45px",
                        height: "45px",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div className="title d-flex flex-column">
                      <div className="fw-bold">
                        {conversacion.nombre_producto} (@{conversacion.username}
                        )
                      </div>
                      <div className="subtitle">{"¿Qué estás haciendo?"}</div>
                    </div>
                    <div className="d-felex flex-column ms-auto text-center">
                      <div>{horaFormateada}</div>
                      <div className="text-secondary">{fechaFormateada} </div>
                    </div>
                  </li>
                );
              })}
            </>
          ) : null}
        </ul>
      </div>

      {/*Apartado donde ira el chat actual*/}
      {mostrarMsj ? (
        <>
          <div
            className="card-secction bc-fondo-del-chat"
            style={{
              flex: "1",
              backgroundImage: `url('../../../public/images/Fondo_Chat.jpg')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "70%",
            }}
          >
            <div className="card-body " style={{ width: "100%" }}>
              <ul className="overflow-y-auto" style={{ height: "80vh" }}>
                {mensajes.map((msj, i) => (
                  <>
                    {msj.emisor !== usuarioLog ? (
                      <>
                        <li className="bc-secondary-body text-light rounded ml-auto p-2 my-3 col-md-5 list-unstyled" key={msj.mensajeID}>
                          {msj.mensaje}
                        </li>
                      </>
                    ) : (
                      <>

                        <li className="bc-primary-2 rounded text-light ms-auto  col-md-5 p-2 my-3 list-unstyled" key={msj.mensajeID}>
                          {msj.mensaje}
                        </li>
                      </>
                    )}
                  </>
                ))}
              </ul>
            </div>

            <div
              className="card-footer text-body-secondary position-absolute bottom-0"
              style={{ width: "70%" }}
            >
              <form className="form d-flex">
                <input
                  type="text"
                  className="form-control form-control-ms w-100"
                  placeholder="Escribe tu mensaje"
                  aria-label="mensaje"
                />
                <button className="btn btn-danger ms-2">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="card-secction bc-fondo-del-chat"
            style={{
              flex: "1",
              backgroundImage: `url('../../../public/images/Fondo_Chat.jpg')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "70%",
            }}
          >
            <div className="p-2  text-center w-100 h-100 d-flex align-items-center justify-content-center">
              <p className="text-light fw-bold">Aqui veras tus mensajes</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CentroChat