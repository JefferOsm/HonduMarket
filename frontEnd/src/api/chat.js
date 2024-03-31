import axios from "./axios";


export const obtenerConversaciones = async (data) => {
    const response = await axios.get(`/chat/conversacion?emisor=${data.emisor}&receptor=${data.receptor}`);
    return response.data;
  };
  