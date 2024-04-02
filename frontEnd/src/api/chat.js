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
