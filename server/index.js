import {server, io} from './app.js'
import {PORT} from './config.js'
import {pool} from './db.js'
let usuariosConectados=[]

io.on('connection', socket =>{
  console.log(socket.id)

  socket.on('agregarUsuarios', (usuarioId)=>{
    !usuariosConectados.some((usuario)=>usuario.usuarioId === usuarioId) &&
    usuariosConectados.push({
      usuarioId,
      socketId: socket.id
    });

    socket.join(`usuario${usuarioId}`);

    console.log('conexiones', usuariosConectados);
    io.emit('usuariosConectados', usuariosConectados);
  });


  
  socket.on('mensajes', async(data)=>{
    const usuario= usuariosConectados.find((usuario)=> usuario.usuarioId === data.receptor);
    console.log(data)
    console.log(usuario)
    let result

    try {
      result = await pool.query('INSERT INTO tbl_mensajes(emisor_id,receptor_id,mensaje) VALUES(?,?,?)',[data.emisor,data.receptor,data.mensaje])
    } catch (error) {
      console.error(error)
    }
    if(usuario){
      io.to(`usuario${usuario.usuarioId}`).emit('getMensajes',
      { mensajeID:result[0].insertId,
        mensaje:data.mensaje, 
        emisor:data.emisor, 
        receptor:data.receptor,
        producto:data.producto  
      }
      );
    }else{
      console.log('fallo')
    }
  })

  socket.on('disconnect', ()=>{
    usuariosConectados= usuariosConectados.filter((usuario)=> usuario.socketId !== socket.id);
    io.emit('usuariosConectados', usuariosConectados);

  })

})


server.listen(PORT, () => {
  console.log("servidor inciado");
});
