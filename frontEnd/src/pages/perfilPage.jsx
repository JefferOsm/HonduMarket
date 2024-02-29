import React, { useState } from 'react'
import { usarAutenticacion } from '../context/autenticacion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faPhone, faEnvelope, faImage, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {useForm} from 'react-hook-form';


function PerfilPage() {
const {usuario,eliminarUsuario,fotoPerfil}= usarAutenticacion();
const {register, handleSubmit, formState:{errors}} = useForm();
const [imagen,setImagen] = useState(false)

const onSubmit= async(data)=>{
  const conf= window.confirm('Desa subir esta imagen?')
  if(conf){
    const formData= new FormData();
    formData.append('image',data.imagen[0])
    console.log(formData)
  
    await fotoPerfil(formData)
  
      setImagen(false)
  }
}


//Funcion para habilitar boton de save
const comprobarImg= ()=>{
  setImagen(true)
}



  return (
    <div className='container-md bg-primary-light my-7 rounded shadow contenedor-perfil p-2' style={{ height:'30rem', backgroundColor:'white',}}> 
      <div className="row ">
        {/* Imagen */}
        <Link to={usuario.url_imagen} target='_blank' className='foto-perfil rounded-circle mx-auto shadow' style={{width:'160px', 
        height:'160px', backgroundImage:`url(${usuario.url_imagen})`, backgroundRepeat:'no-repeat', backgroundSize:'cover'}} >
          
        </Link>


            
          <div className="content-perfil">
            {/* Formulario para subir la imagen */}
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className='input-group d-flex justify-content-center'>
              <label htmlFor="imagen" className='btn btn-outline-secondary rounded-1' onClick={comprobarImg} title='Subir Foto'>
                <FontAwesomeIcon icon={faImage}/>
              </label>

              <input 
                type='file' className='form-control' accept='image/*'
                {... register('imagen',{ required: 'Selecciona una imagen' })} id='imagen' style={{ display: 'none' }}
                onChange={(event) => onSubmit({ imagen: event.target.files })} />
                
                {/* Mostar boton para subir imagen */}
                {/* {imagen &&(
                  <> <button  className='btn btn-outline-success' type='submit'><FontAwesomeIcon icon={faCheck} /></button></>
                )} */}
             
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
                <Link to={'/perfil/editar'} className='btn btn-outline-success mx-auto'>Editar</Link>
              </div>
              <div>
                <Link to={'/'} className='btn btn-outline-danger mx-auto' onClick={()=>{eliminarUsuario()}}>Eliminar Perfil</Link>
              </div>
            </div>     
      </div>
    </div>
  )
}

export default PerfilPage