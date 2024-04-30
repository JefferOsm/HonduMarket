/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { usarProductosContex } from "../../context/productosContext";

function CSV_Publicar() {

  const [contenido, set_contenido] = useState([]);
  const [id_categoria, set_id_categoria] = useState([]);
  const [id_departamento, set_id_departamento] = useState([]);
  const [id_estados, set_id_estados] = useState([]);

  //funcionalidades para el error
  

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
      console.log(values)
      const precio = parseInt(values[2].replace(/[^\d.]/g, ''));
      return {
        nombre: values[0],
        descripcion: values[1],
        precio: isNaN(precio) ? "Valor no aceptado" : precio, 
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


      if (CategoriaEncontrada !== undefined) {
        categoria_id.push(CategoriaEncontrada.categoria_id);
      } else {
        A_contenido[i].categoria = CategoriaEncontrada;
        set_contenido(A_contenido);
      }

      if (EstadoEncontrado !== undefined) {
        estado_id.push(EstadoEncontrado.id_estado);
      } else {
        A_contenido[i].estado = EstadoEncontrado;
        set_contenido(A_contenido);
      }

      if (DepartamentoEncontrado !== undefined) {
        departamento_id.push(DepartamentoEncontrado.id_departamento);
      } else {
        A_contenido[i].departamento = DepartamentoEncontrado;
        set_contenido(A_contenido);
      }
    }

    set_id_categoria(categoria_id);
    set_id_estados(estado_id);
    set_id_departamento(departamento_id);
  }

  const [imagenes, setImagenes] = useState([]);
  const fileInputRefs = useRef([]);
  const [mensaje, setMensaje] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleImageUpload = (index) => (event) => {
    const files = Array.from(event.target.files);
    const producto = contenido[index];

    if (files.length > 6) {
      alert(`No puedes subir más de 6 imágenes para el producto ${producto.nombre}.`);
      event.target.value = null;
      return;
    }

    files.forEach(file => {
      // Verificar el tamaño del archivo
      if (file.size > 10 * 1024 * 1024) {
        alert(`El tamaño de la imagen para el producto ${producto.nombre} no puede ser mayor a 10MB.`);
        event.target.value = null;
        return;
      }
    });

    setImagenes(prev => {
      const newImagenes = [...prev];
      newImagenes[index] = files;
      return newImagenes;
    });


  };


  const handleAgregarPublicacion = async () => {
    for (let i = 0; i < contenido.length; i++){
      const producto = contenido[i];
      const imagenesProducto = imagenes[i];

      if(!imagenesProducto || imagenesProducto.length === 0){
        alert('Es necesario subir al menos una imagen para el producto: ' + producto.nombre);
        setSubiendo(false);
        return;
      }
    }

    setSubiendo(true);
    for (let i = 0; i < contenido.length; i++) {
      const producto = contenido[i];
      const imagenesProducto = imagenes[i];

      if (producto.departamento === undefined || producto.estado === undefined || producto.categoria === undefined || isNaN(producto.precio)) {
        alert('Hay campos incorrectos')
        setSubiendo(false);
        return
      } else if (!imagenesProducto || imagenesProducto.length === 0) {
        alert('Es necesario subir al menos una imagen para el producto: ' + producto.nombre);
        setSubiendo(false);
        return;
      }

      const formData = new FormData();
      formData.append('nombre', producto.nombre);
      formData.append('descripcion', producto.descripcion);
      formData.append('precio', producto.precio);
      formData.append('categoria', id_categoria[i]);
      formData.append('estado', id_estados[i]);
      formData.append('departamento', id_departamento[i]);

      imagenesProducto.forEach((imagen, j) => {
        formData.append('imagenes', imagen, `imagen-${i}-${j}`);
      });

      await agregarPublicacion(formData);
    }

    // Limpiar los datos
    set_contenido([]);
    set_id_categoria([]);
    set_id_departamento([]);
    set_id_estados([]);
    setImagenes([]);

    // Mostrar mensaje de éxito
    setMensaje('Los artículos han sido publicados correctamente.');
    setSubiendo(false);
  };

  return (
    <div className='card' style={{height: "88vh"}}>
      <div className='mx-auto py-3'>
        <h2>Cargar archivo CSV</h2>
        <input type="file" onChange={handleFileUpload} accept=".csv" />
      </div>

      <div className='card py-3 px-3 overflow-auto' style={{height: "70vh"}}>
        <table className="table table-bordered">
          <caption>Productos por subir</caption>
          <thead>
            <tr>
              <th scope="col">N de linea</th>
              <th scope="col">Nombre</th>
              <th scope="col">Descripcion</th>
              <th scope="col">Precio</th>
              <th scope="col">Categoria</th>
              <th scope="col">Estado</th>
              <th scope="col">Departamento</th>
              <th scope="col">Imágenes</th>
            </tr>
          </thead>
          <tbody>
            {contenido.map((producto, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td className={isNaN(producto.precio) ? 'bg-danger-subtle text-danger-emphasis' : ''}>{producto.precio}</td>

                  <td className={producto.categoria !== undefined ? '' : 'bg-danger-subtle text-danger-emphasis'}>
                    {producto.categoria !== undefined ? producto.categoria : 'valor no aceptado'}
                  </td>

                  <td className={producto.estado !== undefined ? '' : 'bg-danger-subtle text-danger-emphasis'}>
                    {producto.estado !== undefined ? producto.estado : 'valor no aceptado'}
                  </td>

                  <td className={producto.departamento !== undefined ? '' : 'bg-danger-subtle text-danger-emphasis'}>
                    {producto.departamento !== undefined ? producto.departamento : 'valor no aceptado'}
                  </td>

                  <td>
                    <input type="file" accept="image/*" onChange={handleImageUpload(index)} ref={el => fileInputRefs.current[index] = el} multiple 
                      disabled={producto.departamento === undefined || producto.estado === undefined || producto.categoria === undefined || isNaN(producto.precio)} />
                  </td>

                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div className='py-3 px-3 d-flex justify-content-end'>
          <button className="btn btn-primary" onClick={handleAgregarPublicacion} 
          disabled={contenido.length === 0 || subiendo }>
            Agregar publicaciones
          </button>
        </div>
      </div>

      {mensaje && (
        <div className="alert alert-success" role="alert">
          {mensaje}
        </div>
      )}

      {/*<div className=' py-3 px-3'>
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
      </div>*/}
    </div>
  );
}

export default CSV_Publicar;
