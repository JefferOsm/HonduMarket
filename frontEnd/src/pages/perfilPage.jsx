import React, { useEffect, useState } from 'react'
import { usarAutenticacion } from '../context/autenticacion';
import { usarProductosContex } from '../context/productosContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faPhone, faEnvelope, faImage, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {useForm} from 'react-hook-form';
import DeleteProfileModal from '../components/deleteProfileModal';

function PerfilPage() {
//Estados para el Modal de elminar perfil
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

//Funciones para la pagina
const {usuario,eliminarUsuario,fotoPerfil}= usarAutenticacion();
const { obtenerPublicaciones,publicacionesUser} = usarProductosContex();
const {register, handleSubmit, formState:{errors}} = useForm();

useEffect(()=>{
  obtenerPublicaciones();
},[])


//Peticion para foto de perfil
const onSubmit= async(data)=>{

    const formData= new FormData();
    formData.append('image',data.imagen[0])
    console.log(formData)
  
    await fotoPerfil(formData)
  
}



  return (
    <>
    <div className='container-md bg-primary-light mt-7 mb-4 rounded shadow contenedor-perfil p-2' style={{ height:'30rem', backgroundColor:'white',}}> 
      <div className="row ">
        {/* Imagen */}
        <Link to={usuario.url_imagen} target='_blank' className='foto-perfil rounded-circle mx-auto shadow' style={{width:'160px', 
        height:'160px', backgroundImage:`url(${usuario.url_imagen})`, backgroundRepeat:'no-repeat', backgroundSize:'cover'}} >
          
        </Link>
            
          <div className="content-perfil">
            {/* Formulario para subir la imagen */}
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className='input-group d-flex justify-content-center'>
              
              <label htmlFor="imagen" className='btn btn-outline-secondary rounded-1' title='Subir Foto'>
                <FontAwesomeIcon icon={faImage}/>
              </label>

              <input 
                type='file' className='form-control' accept='image/*'
                {... register('imagen',{ required: 'Selecciona una imagen' })} id='imagen' style={{ display: 'none' }}
                onChange={(event) => onSubmit({ imagen: event.target.files })} />

            </div>
            </form>

            <p className='text-center mb-1 fw-bold fs-3 '>{usuario.nombre}</p>
            <p className='text-center mb-3 fs-6 text-secondary'>@{usuario.username}</p>

            <div className="d-flex justify-content-center mt-2">
              <div className='d-flex mx-2'>
                <p className='mx-2 fs-5 text-secondary'><FontAwesomeIcon icon={faMap} /></p>
                <p className='fs-5 text-secondary'>{usuario.direccion}</p>
              </div>

              <div className='mx-2 d-flex'>
                <p className='fs-5 text-secondary'><FontAwesomeIcon icon={faPhone}></FontAwesomeIcon></p>
                <p className='fs-5 text-secondary'>+504 {usuario.telefono}</p>
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <div className='d-flex mx-2'>
                <p className='mx-2 fs-5 text-secondary'><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon></p>
                <p className='fs-5 text-secondary'>{usuario.correo}</p>
              </div>
            </div>

          </div>  
          <div className="d-flex justify-content-end mb-3 perfil-btn">
            <div className='me-3'>
              <Link to={'/perfil/publicar'} className='btn btn-outline-success mx-auto'>Publicar</Link>
            </div>
              <div className='me-3'>
                <Link to={'/perfil/editar'} className='btn btn-outline-success mx-auto'>Editar</Link>
              </div>
              <div>
                <Link  className='btn btn-outline-danger mx-auto' onClick={(handleShow)}>Eliminar Perfil</Link>
              </div>
            </div>     
      </div>
    </div>
  <div className="container-fluid bg-primary-light p-2 shadow">
        {publicacionesUser.map(publicacion => (
          <div key={publicacion.id}>
            <p>{publicacion.nombre}</p>
          </div>
        ))}
    </div> 
    <DeleteProfileModal show={show} handleClose={handleClose}/>
    </>
  )
}

export default PerfilPage