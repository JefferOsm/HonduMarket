import React from 'react'

import Modal from 'react-bootstrap/Modal';

function CentroChat() {
  return (
    <div className="card" style={{display: "flex", flexDirection: "row", height: "89vh", width: "100vw"}}>
      {/*Apartado donde ira la lista de chat*/}
      <div className="card-secction overflow-scroll" style={{flex: "0.4", padding: "10px", border: "1px solid #ccc"}}>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Jeffer</li>
          <li class="list-group-item">Leonel</li>
          <li class="list-group-item">Jesus</li>
          <li class="list-group-item">Carlos</li>
          <li class="list-group-item">Nestor Luque</li>
        </ul>
        

        
      </div>

      {/*Apartado donde ira el chat actual*/}
      <div className="card-secction" style={{ flex: "1", padding: "10px", border: "1px solid #ccc" }}>

      </div>

    </div>
    
  )
}

export default CentroChat