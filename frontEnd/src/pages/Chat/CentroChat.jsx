import React, { useEffect, useRef, useState } from 'react'
import { usarChatContext } from '../../context/chatContext';
import { usarAutenticacion } from '../../context/autenticacion';
import { faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { io } from 'socket.io-client';

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
    const cargarDatos= async(opcion)=>{
    if(opcion==='General'){
      setConversaciones(convGen);
    }else if(opcion === 'Productos'){
      const convProd= await obtenerConvProd()
      setConversaciones(convProd);
    }else if(opcion === 'Canales'){

    }
  }

  cargarDatos(opcion)
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

  //WebSockets
  const socket= useRef();// guardar el socket
  const [socketConectado,setSocketConectado]= useState(false)// solo conectarse a ws una vez
  const [onlineUsers,setOnlineUsers]= useState([])// usuarios en linea
  const [mensajeWs,setMensajeWs]= useState('');// mensaje enviado al websocket
  const [receptor,setReceptor]= useState(null);
  const [idProd,setIdProd]= useState(null);

  const ultimoMensajeRef = useRef(null);


  //conectarse a websocket y traer la info
  useEffect(()=>{
    if(usuario && !socketConectado){
      socket.current= io('http://localhost:3000');
      setSocketConectado(true);
    }

    socket.current.emit('agregarUsuarios', usuario.id);
    socket.current.on('usuariosConectados',(res)=>{
      setOnlineUsers(res)
    });
    
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


  //enviar informacion de mensajes y usar websockets
  
  const handleSubmit= (e)=>{
    e.preventDefault()

    const newMensaje= {
      mensajeID:`${usuarioLog}-${mensajeWs}`,
      mensaje: mensajeWs,
      emisor:usuarioLog,
      receptor
    }
    //enviamos datos al websocket server
    setmensajes([... mensajes, newMensaje])
    socket.current.emit('mensajes',
    { mensaje: mensajeWs,
      emisor:usuarioLog,
      receptor,
      producto: idProd
    }
    );
    //console.log(mensajes);
    setMensajeWs('');
    document.getElementById('input-message').value='';

  };

  //recibir mensajes
  useEffect(()=>{
    socket.current.on('getMensajes', mensaje=>{
      setmensajes(prevMessages => [...prevMessages, mensaje]);
      console.log(mensaje)
    });
  },[]);

  //IR AL ULTIMO MENSAJE
  useEffect(() => {
    if (ultimoMensajeRef.current) {
      ultimoMensajeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes]);
  

//cargar los datos de la conversacion
  const handleClickConversacion= (data)=>{
    const cargarConv= async(data)=>{
      try {
        if(data.producto){
          socket.current.emit('agregarUsuariosProductos',`${usuarioLog}-${data.producto}`);
          const msj= await obtenerConversacion(data);
          //console.log(msj)
          setmensajes(msj);
          setReceptor(data.receptor);
          setIdProd(data.producto);
        }else{
          socket.current.emit('agregarUsuarios',usuarioLog);
          const msj= await obtenerMsjGeneral(data);
          //console.log(msj)
          setmensajes(msj);
          setReceptor(data.receptor);
          setIdProd(null);
        }

      } catch (error) {
        console.error('Error al obtener mensajes', error)
      }

    }
    cargarConv(data);
    setMostrarMsj(true);
 
  }

  //funcionalidades para hacer la busqueda del chat
  const [busqueda,setBusqueda]= useState('');
  const [matchPublicaciones, setMatchPublicaciones]=useState([]);

  //filtrar publicaciones para mostrar los nombres
  const handleChange= e=>{
    setMostrarMsj(false);
    if (e.target.value.trim() == ''){
        setMatchPublicaciones([])
        setConversaciones(convGen);
        setBusqueda(e.target.value)
    }else{
        setBusqueda(e.target.value)
        filtrado(e.target.value)
    }
  }

  const filtrado=(termino)=>{
    let resultado= usuariosChat.filter((publicacion)=>{
        if(publicacion.username.toString().toLowerCase().includes(termino.toLowerCase())){
            return publicacion
        }
    })
    setMatchPublicaciones(resultado);
    setConversaciones(resultado)
    document.getElementById('buscarUser').value=''
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

                {/* <a
                  className={`nav-link text-light fs-6 mx-2  ${
                    activo === "Canales" ? "nav-chat-active" : ""
                  }`}
                  href="#"
                  onClick={() => {
                    handleLink("Canales");
                  }}
                >
                  Canales
                </a> */}
              </div>
            </div>
          </div>
        </nav>
        {/* Conversaciones */}
        <ul className="list-group">
          {/* Mostrar conversaciones generales entre ususarios */}
          {activo === "General" ? (
            <>
              <div className="navbar-nav">
                <form className="d-flex input-group py-2" role="search" >
                    <div className=" input-group-text btn bc-secondary-body text-light" ><FontAwesomeIcon icon={faSearch}/></div>
                    <input className="form-control" id='buscarUser' type="search" placeholder="Busca un chat o inicia uno nuevo" aria-label="Search"
                    value={busqueda}
                    onChange={handleChange}/>
                </form>
              </div>
              {conversaciones.map((conversacion) => {
                let horaFormateada
                let fechaFormateada
                if(conversacion.fecha_ultimo_mensaje){
                horaFormateada = formatearHora(
                  conversacion.fecha_ultimo_mensaje
                );
                fechaFormateada = formatearFecha(
                  conversacion.fecha_ultimo_mensaje
                );
              }else{ 
                horaFormateada = ''
                fechaFormateada = ''
              
              }
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
                      <div className="subtitle"></div>
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
                      <div className="subtitle"></div>
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
                      
                        <li 
                        className="bc-secondary-body text-light rounded ml-auto p-2 my-3 col-md-5 list-unstyled" 
                        key={msj.mensajeID}
                        ref={i === mensajes.length - 1 ? ultimoMensajeRef : null}>
                          {msj.mensaje}
                        </li>
                      
                    ) : (
                        <li 
                        className="bc-primary-2 rounded text-light ms-auto  col-md-5 p-2 my-3 list-unstyled" 
                        key={msj.mensajeID}
                        ref={i === mensajes.length - 1 ? ultimoMensajeRef : null}>
                          {msj.mensaje}
                        </li>
                    )}
                  </>
                ))}
              </ul>
            </div>

            <div
              className="card-footer text-body-secondary position-absolute bottom-0"
              style={{ width: "70%" }}
            >
              <form className="form d-flex" onSubmit={handleSubmit}>
                <input
                autoFocus
                id='input-message'
                  type="text"
                  className="form-control form-control-ms w-100"
                  placeholder="Escribe tu mensaje"
                  aria-label="mensaje"
                  onChange={(e)=>{setMensajeWs(e.target.value)}}
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
              <p className="text-light fw-bold">Aquí veras tus mensajes</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CentroChat