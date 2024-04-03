import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { usarProductosContex } from '../../context/productosContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usarAutenticacion } from '../../context/autenticacion';
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';
import { usarChatContext } from '../../context/chatContext';



function ModalChat ({show,handleClose,receptor}){
  const{obtenerConversacion} = usarChatContext();
  const {usuarioProduct,detailProduct,imagenesProduct} = usarProductosContex();
  const {usuario,autenticado}= usarAutenticacion();

  const [socket, setSocket]= useState(null);
  const[onlineUsers,setOnlineUsers]= useState([]);
  const[usuarioLog, setUsuarioLog]= useState(null);

  const [mensaje,setMensaje]= useState('');
  const [mensajes, setMensajes] = useState([]);

  useEffect(()=>{
    if(show){
    const newSocket= io('http://localhost:3000');

    setSocket(newSocket);


    return ()=>{
      newSocket.disconnect();
    }
  }

  },[show]);


  useEffect(()=>{
    if(socket === null || !usuario ||!show) return;
    setUsuarioLog(usuario.id);
    socket.emit('agregarUsuariosProductos', `${usuario.id}-${detailProduct.id}`);

    if(show && autenticado){
      const cargarConversacion= async()=>{
        const conversaciones= await obtenerConversacion({emisor:usuario.id,receptor, producto:detailProduct.id});
        //console.log(conversaciones);
        if(conversaciones){
        setMensajes(conversaciones);}
      };
  
      cargarConversacion();
    }
  

    return()=>{
      socket.off('agregarUsuariosProductos')
    }
  },[socket,usuario,autenticado,receptor]);


  const handleSubmit= (e)=>{
    e.preventDefault()

    const newMensaje= {
      mensaje,
      emisor:usuarioLog,
      receptor
    }
    //enviamos datos al websocket server
    setMensajes([... mensajes, newMensaje])
    socket.emit('mensajes',
    { mensaje,
      emisor:usuarioLog,
      receptor,
      producto: detailProduct.id
    }
    );
    //console.log(mensajes);
    setMensaje('');
    document.getElementById('input-message').value='';

  }

  useEffect(()=>{
    if(socket === null) return
    socket.on('getMensajes', mensaje=>{
      if (mensaje.receptor === usuarioLog) {
        recibirMensajes(mensaje);
      }
    });

    return ()=>{
      socket.off('getMensajes')
    }
  },[socket]);

  const recibirMensajes =(mensaje)=>{
    setMensajes(prevMessages => [...prevMessages, mensaje]);
    console.log(mensajes)
  }

  return (

      <Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-scrollable" backdrop='static'>
        <Modal.Header closeButton >
          <p className='fw-bold fs-5 my-auto'> {detailProduct.nombre} (@{usuarioProduct.username})</p>
        </Modal.Header>

        <Modal.Body style={{backgroundImage:`url('../../../public/images/Fondo_del_chat.jpg')`,
              backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>

          <ul className="">

            {mensajes.map((message,i)=>(
              <>
                {message.emisor!==usuarioLog ? (
                  <>
                  <li className="bc-secondary-body text-light rounded ml-auto p-2 my-2 col-md-5 list-unstyled" key={message.mensajeID} style={{wordWrap:'break-word'}}>
                  {message.mensaje}
                  </li>
                  </>
                ):(
                  <>
                  <li className="bc-primary-2 rounded text-light ms-auto col-md-5 p-2 my-2 list-unstyled" style={{wordWrap:'break-word'}} key={message.mensajeID}>
                    {message.mensaje}
                  </li>
                  </>
                )}
              </>
             ))}
            
          </ul>

          <ul className="row">
           
          </ul>
        </Modal.Body>

        <Modal.Footer className='input-group'>
          <form className='form d-flex w-100' onSubmit={handleSubmit}>
            <input type="text" id='input-message' className="form-control form-control-ms" placeholder="Escribe tu mensaje" aria-label="mensaje"
            onChange={(e)=>{setMensaje(e.target.value)}}/>
            <button className="btn btn-danger ms-2">
             <FontAwesomeIcon icon= {faPaperPlane} />
            </button>
            {/* <Button className="">
                <FontAwesomeIcon icon={faImage} />
            </Button> */}
          </form>

        </Modal.Footer>
      </Modal>

  )
}

export default ModalChat