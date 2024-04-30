import {server, io} from './app.js'
import {PORT} from './config.js'
import {pool} from './db.js'
import enviarCorreos from './helpers/email.js';
let usuariosConectados=[]
let salaProductos=[]
let salaUsuarios=[]
let salaCanales=[]

io.on('connection', socket =>{
  //console.log('new',socket.id)


  // REGISTRAR CONEXIONES DE USUARIOS
  socket.on('agregarUsuarios', (usuarioId)=>{
    if(!usuariosConectados.some((usuario)=>usuario.usuarioId === usuarioId)){
    usuariosConectados.push({
      usuarioId,
      socketId: socket.id
    });
    socket.join(`usuario${socket.id + usuarioId}`);
  }

    console.log('conexiones', usuariosConectados);
    io.emit('usuariosConectados', usuariosConectados);
  });

    // REGISTRAR CONEXIONES DE USUARIOS
    socket.on('agregarSalaUsuarios', (usuarioId)=>{
    // Verificar si hay un registro existente con un socketId similar al nuevo
    const salaExistenteIndex = salaProductos.findIndex(sala => sala.socketId === socket.id && sala.usuarioId !== usuarioId);
  
    // Si hay un registro existente, eliminarlo de la sala
    if (salaExistenteIndex !== -1) {
      const salaEliminada = salaProductos.splice(salaExistenteIndex, 1)[0];
    }
  
    // Agregar el nuevo registro a la sala si no existe
    if (!salaUsuarios.some(sala => sala.usuarioId === usuarioId)) {
      salaUsuarios.push({
        usuarioId,
        socketId: socket.id
      });
      socket.join(`salaUser${socket.id + usuarioId}`);
      console.log('Conexiones salausuario después de agregar:', salaUsuarios);
    } else {
      console.log(`La sala con usuarioId ${usuarioId} y socketId ${socket.id} ya existe.`);
    }
    }
  );
  

  //REGISTRAR SALAS DE PRODUCTOS
 
  socket.on('agregarUsuariosProductos', (usuarioId) => {
    // Verificar si hay un registro existente con un socketId similar al nuevo
    const salaExistenteIndex = salaProductos.findIndex(sala => sala.socketId === socket.id && sala.usuarioId !== usuarioId);
  
    // Si hay un registro existente, eliminarlo de la sala
    if (salaExistenteIndex !== -1) {
      const salaEliminada = salaProductos.splice(salaExistenteIndex, 1)[0];
    }
  
    // Agregar el nuevo registro a la sala si no existe
    if (!salaProductos.some(sala => sala.usuarioId === usuarioId)) {
      salaProductos.push({
        usuarioId,
        socketId: socket.id
      });
      socket.join(`producto${socket.id + usuarioId}`);
      console.log('Conexiones productos después de agregar:', salaProductos);
    } else {
      console.log(`La sala con usuarioId ${usuarioId} y socketId ${socket.id} ya existe.`);
    }
  });


  socket.on('agregarSalaCanales', (usuarioId) => {
    // Verificar si hay un registro existente con un CanalID similar al nuevo
    const salaExistenteIndex = salaCanales.findIndex(sala => sala.socketId === socket.id && sala.usuarioId === usuarioId);
    const salas= socket.rooms
    salas.forEach((value) => {
      console.log(value);
      socket.leave(value); // Esto mostrará cada valor del Set
    });
    // Si hay un registro existente, eliminarlo de la sala
    if (salaExistenteIndex !== -1) {
      const salaEliminada = salaCanales.splice(salaExistenteIndex, 1)[0];
      socket.leave(`canal${usuarioId}`);
    }

    // Verificar si hay un registro existente con el mismo socketId
    const salaExistenteSocketIndex = salaCanales.findIndex(sala => sala.socketId === socket.id);

       // Si hay un registro existente con el mismo socketId, eliminarlo
    if (salaExistenteSocketIndex !== -1) {
        const salaEliminada = salaCanales.splice(salaExistenteSocketIndex, 1)[0];
        
    }
  
    //Agregar el nuevo registro a la sala si no existe
    if (!salaProductos.some(sala => sala.usuarioId === usuarioId)) {
      salaCanales.push({
        usuarioId,
        socketId: socket.id
      });
      socket.join(`canal${usuarioId}`);
      console.log('Conexiones productos después de agregar:', salaCanales);
    } else {
      console.log(`La sala con usuarioId ${usuarioId} y socketId ${socket.id} ya existe.`);
    }
  });
  
  

  //RECIBIR Y GUARDAR MENSAJES
  socket.on('mensajes', async(data)=>{
    console.log(data)
    let usuario
    if(data.producto){
      usuario= salaProductos.find((sala)=> sala.usuarioId ===`${data.receptor}-${data.producto}`);
    }else if(data.canalID){
      usuario= salaCanales.find((sala)=> sala.usuarioId === data.canalID);
    }else{
      usuario= salaUsuarios.find((usuario)=> usuario.usuarioId === `${data.receptor}-${data.emisor}`);
      //console.log(data)
    }

    //console.log(usuario)
    let result

    try {
      if(data.producto){
        result = await pool.query('INSERT INTO tbl_mensajes(emisor_id,receptor_id,mensaje,producto_id) VALUES(?,?,?,?)',
        [data.emisor,data.receptor,data.mensaje,data.producto])
      }else if(data.canalID){
        result = await pool.query('INSERT INTO tbl_canales_mensaje(mensaje,canal) VALUES(?,?)',
        [data.mensaje,data.canalID])
      }else{
        result = await pool.query('INSERT INTO tbl_mensajes(emisor_id,receptor_id,mensaje) VALUES(?,?,?)',
        [data.emisor,data.receptor,data.mensaje])
      }

    } catch (error) {
      console.error(error)
    }
    if(usuario){ 
      if(data.producto){
        io.to(`producto${usuario.socketId + usuario.usuarioId}`).emit('getMensajes',
        { mensajeID:result[0].insertId,
          mensaje:data.mensaje, 
          emisor:data.emisor, 
          receptor:data.receptor 
        }
        );
      }else if(data.canalID){
        io.to(`canal${data.canalID}`).emit('getMensajes',
        { mensajeID:result[0].insertId,
          mensaje:data.mensaje, 
          canalID:data.canalID, 
          emisor:data.emisor
        }
        );
      }else{
        console.log('to: '+ usuario.usuarioId)
        io.to(`salaUser${usuario.socketId+usuario.usuarioId}`).emit('getMensajes',
        { mensajeID:result[0].insertId,
          mensaje:data.mensaje, 
          emisor:data.emisor, 
          receptor:data.receptor 
        }
        );
      }
      
    }else{
      console.log('fallo')
    }
  })

  socket.on('disconnect', ()=>{
    usuariosConectados= usuariosConectados.filter((usuario)=> usuario.socketId !== socket.id);
    io.emit('usuariosConectados', usuariosConectados);
    console.log('desconectado', usuariosConectados);
    //console.log(socket.rooms)
  })

})


server.listen(PORT, () => {
  console.log("servidor inciado");
  enviarCorreos();
});
