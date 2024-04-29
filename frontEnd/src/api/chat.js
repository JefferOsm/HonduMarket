import axios from "./axios";


export const obtenerConversaciones = async (data) => {
    const response = await axios.get(`/chat/conversacion?emisor=${data.emisor}&receptor=${data.receptor}&producto=${data.producto}`);
    return response.data;
  };

export const obtenerUsuariosReq = async()=>{
  const response = await axios.get(`/chat/usuarios`);
  return response.data;
};

export const obtenerConvProdReq= async()=>{
  const response= await axios.get(`/chat/conversaciones-producto`);
  return response.data;
}
  
export const obtenerConvGenReq= async()=>{
  const response = await axios.get(`/chat/conversaciones-general`);
  return response.data;
}

export const obtenermsjGeneralReq = async (data) => {
  const response = await axios.get(`/chat/mensajes-general?emisor=${data.emisor}&receptor=${data.receptor}`);
  return response.data;
};

//Canales
export const crearCanalReq = async (data) => {
  const response = await axios.post('/chat/canal-create', data);
  return response.data;
};

export const obtenerCanalesReq = async () => {
  const response = await axios.get('/chat/canales-user');
  return response.data;
};

export const obtenerTodosCanalesReq = async () => {
  const response = await axios.get('/chat/canales');
  return response.data;
};

export const seguirCanalReq = async (id) => {
  const response = await axios.get(`/chat/canales/seguir/${id}`);
  return response.data;
};


export const borrarCanalReq = async (id) => {
  const response = await axios.delete(`/chat/canales/${id}`);
  return response.data;
};


export const enviarMsjProdReq = async (data) => {
  const response = await axios.post(`/chat/mensaje`, data);
  return response.data;
};



export const mensajesCanalReq = async (id) => {
  const response = await axios.get(`/chat/canales/mensajes/${id}`);
  return response.data;
};

