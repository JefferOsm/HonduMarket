import axios from "./axios";

export const obtenerTipoDenunciasReq = async () => {
    const response = await axios.get(`/usuarios/denuncias/tipos`);
    return response.data;
  };

  export const envioReporteReq = async (data) => {
    const response = await axios.post(`/usuarios/denuncias/reporte`, data);
    return response.data;
  };
  