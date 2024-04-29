import React, {useState, useEffect } from 'react';
import { usarProductosContex } from "../../context/productosContext";

function CSV_Publicar() {

  const [contenido, set_contenido] = useState([]);
  const [id_categoria, set_id_categoria] = useState([]);
  const [id_departamento, set_id_departamento] = useState([]);
  const [id_estados, set_id_estados] = useState([]);
  const { obtenerCategorias, obtenerDepartamentos, obtenerEstados, categorias,
    departamentos, estados, agregarPublicacion, subirVideoPublicacion } = usarProductosContex();

  useEffect(() => {
    obtenerCategorias()
    obtenerDepartamentos()
    obtenerEstados()
  }, [])

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.readAsText(file);
    }
  };

  const handleFileRead = (event) => {
    const content = event.target.result;
    const lines = content.split('\n');
    const parsedContent = lines.map(line => {
        const values = line.split(',');
        return {
            nombre: values[0],
            descripcion: values[1],
            precio: values[2],
            categoria: values[3],
            estado: values[4],
            departamento: values[5]
        };
    });

    Obtener_id(parsedContent);
    set_contenido(parsedContent);
    console.log(parsedContent); // Aquí puedes hacer lo que quieras con los datos del archivo CSV
  };

  const Obtener_id = (A_contenido) => {
    const categoria_id = [];
    const estado_id = [];
    const departamento_id = [];

    for (let i = 0; i < A_contenido.length; i++) {

      const categoriaActual = String(A_contenido[i].categoria).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const estadoActual = String(A_contenido[i].estado).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const departamentoActual = String(A_contenido[i].departamento).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const CategoriaEncontrada = categorias.find((C) => 
        String(C.nombre_categoria).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === categoriaActual);

      const EstadoEncontrado = estados.find((E) => 
        String(E.nombre_estado).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === estadoActual);

      const DepartamentoEncontrado = departamentos.find((D) => 
        String(D.nombre_departamento).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === departamentoActual);


      if (CategoriaEncontrada !== undefined ) {
        categoria_id.push(CategoriaEncontrada.categoria_id);
      }else{
        alert('No hay ninguna coincidencia con '+ categoriaActual);
      }

      if (EstadoEncontrado !== undefined ) {
        estado_id.push(EstadoEncontrado.id_estado);
      }else{
        alert('No hay ninguna coincidencia con '+ estadoActual);
      }

      if (DepartamentoEncontrado !== undefined ) {
        departamento_id.push(DepartamentoEncontrado.id_departamento);
      }else{
        alert('No hay ninguna coincidencia con '+ departamentoActual);
      }
    }

    set_id_categoria(categoria_id);
    set_id_estados(estado_id);
    set_id_departamento(departamento_id);
  }


  return (
    <div className='card'>
      <div className='mx-auto py-3'>
        <h2>Cargar archivo CSV</h2>
        <input type="file" onChange={handleFileUpload} accept=".csv" />
      </div>

      <div className='py-3 px-3'>
        <table  className="table table-bordered">
          <caption>Productos por subir</caption>
          <thead>
              <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Descripcion</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Departamento</th>
              </tr>
          </thead>
          <tbody>
            {contenido.map((producto,index) => (
              <React.Fragment key={index}>
                <tr>
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.precio}</td>
                    <td>{producto.categoria}</td>
                    <td>{producto.estado}</td>
                    <td>{producto.departamento}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className=' py-3 px-3'>
        <h6>categorias</h6>   
        {id_categoria.map(categoria => (   
          <h6>{categoria}</h6>       
        ))}
        <h6>Estados</h6> 
        {id_estados.map(categoria => (   
          <h6>{categoria}</h6>       
        ))}
        <h6>Departamentos</h6> 
        {id_departamento.map(categoria => (   
          <h6>{categoria}</h6>       
        ))}
      </div>
    </div>
  );
}

export default CSV_Publicar;
