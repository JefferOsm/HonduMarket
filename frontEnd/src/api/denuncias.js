import axios from "./axios";

export const obtenerTipoDenunciasReq = async () => {
    const response = await axios.get(`/usuarios/denuncias/tipos`);
    return response.data;
  };
  