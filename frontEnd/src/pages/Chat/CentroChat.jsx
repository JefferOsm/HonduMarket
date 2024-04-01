import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import {ChatItem} from 'react-chat-elements'
import { usarChatContext } from '../../context/chatContext';
function CentroChat() {
  const{conversacionesGen,
        obtenerUsuarios,obtenerConvProd,obtenerConvGen}= usarChatContext();

  const[usuariosChat,setUsuariosChat]= useState([])
  const[convProd,setConvProd]= useState([]);
  const[convGen,setConvGen]= useState([]);

  useEffect(()=>{
    const cargarData= async()=>{
      const usuarios= await obtenerUsuarios();
      const convGen= await obtenerConvGen();
      const convProd= await obtenerConvProd();
      
      setUsuariosChat(usuarios);
      setConvGen(convGen);
      setConvProd(convProd);
    }

    cargarData();


  },[])

  return (
    <div className="card" style={{display: "flex", flexDirection: "row", height: "90vh", width: "100%"}}>
      {/*Apartado donde ira la lista de chat*/}
      <div className="card-secction overflow-y-auto" style={{flex: "0.4", padding: "10px", border: "1px solid #ccc"}}>
      {/* Conversaciones */}
      <div className='d-flex p-2 bg-primary rounded align-items-center'> 
          <div className='p-4 rounded-circle bc-primary'></div>
          <div className='fw-bold fs-5 ms-3'>User</div>
      </div>
        <ul className="list-group list-group-flush">

          <li className="list-group-item">{usuariosChat[0] ? (
            <>
            {usuariosChat[0].id}
            </>
          ):(<>
          </>)}</li>
          <li className="list-group-item">Leonel</li>
          <li className="list-group-item">Jesus</li>
          <li className="list-group-item">Carlos</li>
          <li className="list-group-item">Nestor Luque</li>
        </ul>
        

        
      </div>

      {/*Apartado donde ira el chat actual*/}
      <div className="card-secction" style={{ flex: "1", padding: "10px", border: "1px solid #ccc" }}>

      </div>

    </div>
    
  )
}

export default CentroChat