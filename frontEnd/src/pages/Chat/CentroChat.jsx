/* eslint-disable no-unused-vars */
import  { useEffect, useRef, useState } from 'react'
import { usarChatContext } from '../../context/chatContext';
import { usarAutenticacion } from '../../context/autenticacion';
import { faL, faPaperPlane, faSearch, faSquarePlus, faUserCheck, faUserTie } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { io } from 'socket.io-client';
import CrearCanal from './components/CrearCanal';

function CentroChat() {
  const{obtenerUsuarios,obtenerConvProd,obtenerConvGen,
        obtenerConversacion, obtenerMsjGeneral, obtenerCanales,
      obtenerTodosCanales,seguirCanal, borrarCanal,
    mensajesCanal}= usarChatContext();
  
  const {usuario}=usarAutenticacion();

  //estado para la navbar
  const [activo,setActivo]=useState('General')
  const [conversacionSelec,setConversacionSelec]= useState(null)// remarcar la conversacion seleccionada

  //evento al darle click a un link en la nav
  const handleLink=(opcion)=>{
    setConversacionSelec(null)
    setActivo(opcion);
    setMostrarMsj(false);
    const cargarDatos= async(opcion)=>{
    if(opcion==='General'){
      setConversaciones(convGen);
    }else if(opcion === 'Productos'){
      const convProd= await obtenerConvProd()
      setConversaciones(convProd);
    }else if(opcion === 'Canales'){
      const convCanales= await obtenerCanales()
      setConversaciones(convCanales);
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
  const[canalesBusqueda,setCanalesBusqueda]= useState([]);
  const[convProd,setConvProd]= useState([]);  //conversaciones hechas por productos
  const[convGen,setConvGen]= useState([]); //conversaciones Generales
  const[convCann,setConvCann]= useState([]); //conversaciones Canales
  const[mensajes,setmensajes]= useState([]); //mensajes de la convesacion
  const[mostrarMsj,setMostrarMsj]= useState(false); //estado usado para mostrar el apartado de mensajes
  const[inputMsj,setInputMsj]=useState(false);

  const[conversaciones,setConversaciones]= useState([]); //estado general para conversaciones
  const [usuarioLog,setUsuarioLog]= useState([]);//estado para el usuario logeado

  //WebSockets
  const socket= useRef();// guardar el socket
  const [socketConectado,setSocketConectado]= useState(false)// solo conectarse a ws una vez
  const [onlineUsers,setOnlineUsers]= useState([])// usuarios en linea
  const [mensajeWs,setMensajeWs]= useState('');// mensaje enviado al websocket
  const [receptor,setReceptor]= useState(null);
  const [idProd,setIdProd]= useState(null);
  const [canalID, setCanalID]= useState(null);

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
      const canales= await obtenerTodosCanales();
      const convCan= await obtenerCanales();
      setUsuariosChat(usuarios);
      setConvGen(convGen);
      setConvProd(convProd);
      setConversaciones(convGen);
      setCanalesBusqueda(canales);
      setConvCann(convCan);
    }
    cargarData();
    setUsuarioLog(usuario.id);

  },[usuario]);


  //enviar informacion de mensajes y usar websockets
  
  const handleSubmit= (e)=>{
    e.preventDefault()

    if(activo==='Canales'){
      const newMensaje= {
        mensaje: mensajeWs,
        canalID
      }
      //setmensajes([... mensajes, newMensaje])
      socket.current.emit('mensajes',
      { mensaje: mensajeWs,
        canalID,
        emisor:usuarioLog
      }
      );
    }else{
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
    }

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
  

  const [asideCanales, setAsideCanales]= useState(null) //para mostrar nav de los canales

  const peticionesCanales = async (data) => {
    const isAdmin = data.administrador === usuarioLog;
    const operation = isAdmin ? borrarCanal : seguirCanal;
  
    await operation(data.canalID);
    setMostrarMsj(false);
  
    const canales = await obtenerCanales();
    setConversaciones(canales);
    setConvCann(canales);
  
    const todosCanales = await obtenerTodosCanales();
    setCanalesBusqueda(todosCanales);
  };
//cargar los datos de la conversacion
  const handleClickConversacion= (data)=>{
    const cargarConv= async(data)=>{
      try {
        if(data.producto){
          setMostrarMsj(true);
          socket.current.emit('agregarUsuariosProductos',`${usuarioLog}-${data.producto}`);
          const msj= await obtenerConversacion(data);
          //console.log(msj)
          setmensajes(msj);
          setReceptor(data.receptor);
          setIdProd(data.producto);
          setInputMsj(false);
        }else if (activo=='General'){
          setMostrarMsj(true);
          //console.log(data)
          socket.current.emit('agregarSalaUsuarios',`${usuarioLog}-${data.receptor}`);
          const msj= await obtenerMsjGeneral(data);
          //console.log(msj)
          setmensajes(msj);
          setReceptor(data.receptor);
          setIdProd(null);
          setInputMsj(false);
          
        }else if(activo==='Canales'){
          setMostrarMsj(true);
          setAsideCanales(
            (<div className='w-100 p-2 d-flex bg-aside-canales align-items-center '>
              <img src={data.imagen} alt="Foto Perfil" className='rounded-circle'
              style={{width:'50px', height:'50px', contain:'content'}} />
              <p className='fw-bold ms-3 text-center my-auto'>{data.canal}</p>
              <button className='btn bgc-secondary ms-auto btn-channel'
              onClick={()=>{peticionesCanales(data)}}>
                  {data.administrador===usuarioLog ? 'Borrar canal' : data.sigue === 1 ? 'Dejar de Seguir' : 'Seguir'}
              </button>
            </div>)
            )
            socket.current.emit('agregarSalaCanales',data.canalID);
            setCanalID(data.canalID)
            const msj= await mensajesCanal(data.canalID)
            setmensajes(msj)
            setInputMsj(!(data.administrador === usuarioLog));
        }

      } catch (error) {
        console.error('Error al obtener mensajes', error)
      }

    }
    setConversacionSelec(data.index)
    cargarConv(data);
    //setMostrarMsj(true);
 
  }

  //funcionalidades para hacer la busqueda del chat
  const [busqueda,setBusqueda]= useState('');
  //const [matchPublicaciones, setMatchPublicaciones]=useState([]);

  //filtrar publicaciones para mostrar los nombres
  const handleChange= e=>{
    setMostrarMsj(false);
    if (e.target.value.trim() == ''){


        if(activo==='Canales'){
          const canales=async()=>{
            const response= await obtenerCanales()
            setConversaciones(response)
          }
          canales();
          setBusqueda(e.target.value)
        }else{
          setConversaciones(convGen);
          setBusqueda(e.target.value)
        }

    }else{
        setBusqueda(e.target.value)
        filtrado(e.target.value)
    }
  }

  const filtrado=(termino)=>{
    let resultado

    if(activo==='Canales'){
      resultado= canalesBusqueda.filter((canal)=>{
        if(canal.nombre.toString().toLowerCase().includes(termino.toLowerCase())){
            return canal
        }
    })
    }else{
      resultado= usuariosChat.filter((publicacion)=>{
        if(publicacion.username.toString().toLowerCase().includes(termino.toLowerCase())){
            return publicacion
        }
    })
    }

    //setMatchPublicaciones(resultado);
    setConversaciones(resultado)
    document.getElementById('buscarUser').value=''
  }

      //funcionalidades para el modal de crear canal
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
    //agregar el canal nuevo que ha sido creado
    useEffect(()=>{
     const cargarcanales= async()=>{
      if(!show){
        const canales= await obtenerCanales()
        setConversaciones(canales)
      }
     } 
     cargarcanales();

    },[show])



  return (
    <>
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
        className="card-secction"
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
        <ul className="list-group overflow-y-auto" style={{height:'80vh'}}>
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
              {conversaciones.map((conversacion,i) => {
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
                    className={`p-2 bc-lista-chat-item text-light rounded-3 my-1 d-flex align-items-center
                    ${conversacionSelec === i ? 'chat-seleccionado':''}`}
                    key={conversacion.id ? conversacion.id : i }
                    onClick={() => {
                      handleClickConversacion({
                        emisor: usuario.id,
                        receptor: conversacion.id,
                        index:i
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
                    <div className="d-flex flex-column ms-auto text-center">
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
              {conversaciones.map((conversacion, i) => {
                const horaFormateada = formatearHora(
                  conversacion.fecha_ultimo_mensaje
                );
                const fechaFormateada = formatearFecha(
                  conversacion.fecha_ultimo_mensaje
                );
                return (
                  <li
                    className={`p-2 bc-lista-chat-item text-light rounded-3 my-1 d-flex align-items-center
                    ${conversacionSelec === i ? 'chat-seleccionado':''} `}
                    key={conversacion.producto_id ? conversacion.producto_id: i}
                    onClick={() => {
                      handleClickConversacion({
                        emisor: usuario.id,
                        receptor: conversacion.id,
                        producto: conversacion.producto_id,
                        index:i
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
                    <div className="d-flex flex-column ms-auto text-center">
                      <div>{horaFormateada}</div>
                      <div className="text-secondary">{fechaFormateada} </div>
                    </div>
                  </li>
                );
              })}
            </>
          ) : null}


          {activo === "Canales" ? (
            <>
              <div className="d-flex">
                <form className="d-flex input-group py-2" role="search" style={{width:"88%"}}>
                    <div className=" input-group-text btn bc-secondary-body text-light"
                    title='Buscar' ><FontAwesomeIcon icon={faSearch}/></div>
                    <input className="form-control" id='buscarUser' type="search" 
                    placeholder="Busca canales" aria-label="Search"
                    value={busqueda}
                    onChange={handleChange}
                    />
                </form>
                <button className='btn ms-2 my-2 bgc-secondary btn-channel fs-5'
                title='Crear Canal' onClick={handleShow}>
                  <FontAwesomeIcon icon={faSquarePlus}/>
                </button>
              </div>
              {conversaciones.map((conversacion,i) => {
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
                    className={`p-2 bc-lista-chat-item text-light rounded-3 my-1 d-flex align-items-center 
                    ${conversacionSelec === i ? 'chat-seleccionado':''} `}
                    key={conversacion.canal_id ? conversacion.canal_id : i }
                    onClick={() => {
                      handleClickConversacion({
                        usuario: usuarioLog,
                        administrador: conversacion.administrador,
                        canal: conversacion.nombre,
                        imagen: conversacion.imagen,
                        sigue:conversacion.sigue,
                        canalID:conversacion.canal_id,
                        index: i
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
                      <div className="fw-bold">{conversacion.nombre}</div>
                      <div className="subtitle chat-ultimo-mensaje">{conversacion.ultimo_mensaje}</div>
                    </div>

                    {(usuarioLog===conversacion.administrador || conversacion.es_administrador) ? (
                      <>
                        <div className="ms-auto text-light rounded me-2 p-1  d-flex flex-column " title='Administrador'>
                          <FontAwesomeIcon icon={faUserTie}/>
                          <div className="text-secondary chat-fecha-ultimo">{fechaFormateada} </div>
                        </div>
                      </>
                    ):(
                      <>
                        {conversacion.sigue===1 ? (
                            <>
                            <div className="ms-auto text-light rounded d-flex flex-column" title='Siguiendo'>
                              <FontAwesomeIcon icon={faUserCheck}/>
                              <div className="text-secondary">{fechaFormateada} </div>
                            </div>
                            </>
                          ):(
                            <>
                            {/* <div className="ms-auto text-center btn-seguir-canal rounded">
                                Seguir
                            </div> */}
                            </>
                          )
                        }

                      </>
                    )}

                    
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
              {activo==='Canales' && (
                <>
                  {asideCanales}
                </>
              )}
            <div className="card-body " style={{ width: "100%" }}>

              <ul className="overflow-y-auto" style={{ height: activo==='Canales' ? "72vh": "80vh" }}>
                {mensajes && mensajes.map((msj, i) => (
                  <>
                    {msj.emisor !== usuarioLog ? (
                      
                        <li 
                        className="bc-secondary-body text-light rounded ml-auto p-2 my-3 col-md-5 list-unstyled" 
                        key={msj.mensajeID ? msj.mensajeID: i-1 }
                        ref={i === mensajes.length - 1 ? ultimoMensajeRef : null}>
                          {msj.mensaje}
                        </li>
                      
                    ) : (
                        <li 
                        className="bc-primary-2 rounded text-light ms-auto  col-md-5 p-2 my-3 list-unstyled" 
                        key={msj.mensajeID ? msj.mensajeID: i-1 }
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
                {!inputMsj  ? (
                  <>
                    <input
                    autoFocus
                    id='input-message'
                      type="text"
                      className="form-control form-control-ms w-100"
                      placeholder="Escribe tu mensaje"
                      aria-label="mensaje"
                      onChange={(e)=>{setMensajeWs(e.target.value)}}
                      disabled={inputMsj}
                    />
                    <button className="btn btn-danger ms-2">
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </>
                ):(
                  <>

                  </>
                )}

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
    <CrearCanal show={show} handleClose={handleClose}/>
    </>
  );
}

export default CentroChat