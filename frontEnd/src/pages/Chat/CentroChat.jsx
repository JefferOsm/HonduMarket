import React, { useEffect, useState } from 'react'
import { usarChatContext } from '../../context/chatContext';
import { usarAutenticacion } from '../../context/autenticacion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function CentroChat() {
  
  //funcionalidades para hacer la lista del chat
  const{obtenerConversacion} = usarChatContext();
  const [socket, setSocket]= useState(null);
  const {usuario,autenticado}= usarAutenticacion();
  const fecha = new Date();
  const hora = fecha.getHours();
  const minutos = fecha.getMinutes();

  {/*useEffect(()=>{
    if(socket === null || !usuario ||!show) return;
    setUsuarioLog(usuario.id);
    socket.emit('agregarUsuarios', usuario.id);
    socket.on('usuariosConectados',(res)=>{
      setOnlineUsers(res)
    });

        
    if(show && autenticado){
      const cargarConversacion= async()=>{
        const conversaciones= await obtenerConversacion({emisor:usuario.id,receptor});
        //console.log(conversaciones);
        setMensajes(conversaciones);
      };
  
      cargarConversacion();
    }
  

    return()=>{
      socket.off('agregarUsuarios')
    }
  },[socket,usuario,autenticado,receptor]);*/}


  return (
    <div className="card bc-lista-chat" style={{display: "flex", flexDirection: "row", height: "89vh", width: "100vw"}}>
      {/*Apartado donde ira la lista de chat*/}
      <div className="card-secction overflow-scroll" style={{flex: "0.4", padding: "10px", border: "1px solid #ccc"}}>
        <ul className="list-group list-group-flush">
          <li className="list-group-item bc-lista-chat text-light">
            <div className='rounded-circle rounded float-start' 
              style={{backgroundImage:`url(${usuario.url_imagen})`, width:'40px', height:'40px',
              backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>
            </div>
            <div className="chat-info">
              <div className="title row">
                <div className='col-md-4'>@{usuario.username}</div>
                <div className='col-md-4 ms-auto'>{hora.toLocaleString()}:{minutos.toLocaleString()}</div>
                <div className="subtitle">{"¿Qué estás haciendo?"}</div>
              </div>
            </div>
          </li>
          <li className="list-group-item bc-lista-chat text-light">Leonel</li>
          <li className="list-group-item bc-lista-chat text-light">Jesus</li>
          <li className="list-group-item bc-lista-chat text-light">Carlos</li>
          <li className="list-group-item bc-lista-chat text-light">Nestor Luque</li>
        </ul>
      </div>

      {/*Apartado donde ira el chat actual*/}
      <div className="card-secction bc-fondo-del-chat" style={{ flex: "1", padding: "10px", border: "1px solid #ccc", backgroundImage:`url('../../../public/images/Fondo_Chat.jpg')`,
              backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>
        <div className="card-body">
          <ul>
            <li className="bc-secondary-body text-light rounded ml-auto p-2 my-2 col-md-5 list-unstyled">

            </li>
            <li className="bc-primary-2 rounded text-light ms-auto col-md-5 p-2 my-2 list-unstyled">

            </li>
          </ul>
        </div>

        <div className="card-footer text-body-secondary position-absolute bottom-0" style={{width: "70%"}}>
          <form className='form d-flex'>
            <input type="text" className="form-control form-control-ms w-100" placeholder="Escribe tu mensaje" aria-label="mensaje"/>
            <button className="btn btn-danger ms-2">
            <FontAwesomeIcon icon= {faPaperPlane} />
            </button>
          </form>
        </div>
      </div>

    </div>
    
  )
}

export default CentroChat