import {React, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import { usarAutenticacion } from "../context/autenticacion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import EditpasswordModal from '../components/editpasswordModal';


function EditPerfilPage() {

    const {register, handleSubmit, formState:{errors}} = useForm();
    const {usuario,autenticado,erroresAut,actualizarUsuario,passw} = usarAutenticacion();
    const navegacion = useNavigate();
    const [pass,setpass]= useState('');

    //funcionalidades para el modal de cambiar contraseña
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log(show)

    //Peticion Al Backend
    const peticion= handleSubmit(async (values) => {
      const mover = await actualizarUsuario(values);

      if(mover){
        navegacion('/perfil')
      }
    })

    useEffect(()=>{
        setpass(usuario.pass)
    },[])
  
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-md-8 mx-auto align-middle ">
            <div className="card text-light bc-degrate shadow">
              <div className="card-body">
              {
                erroresAut.map((error, i)=>(
                  <div className="bg-danger p-2 text-light" key={i}>
                    {error}
                  </div>
                ))
            }
                <form className="row g-3 px-4 py-3" 
                  onSubmit={peticion}
                >
                    <h2 className='text-center fw-bold'>Editar</h2>
                    <div className="row g-3">
                      
                      <div className="col">
                        <label className="form-label">Nombre Completo</label>
                        <input type="text" className="form-control" defaultValue={usuario.nombre} 
                        placeholder="Nombre Completo" aria-label="Nombre" {... register ('nombre', {required:true})}/>
                      </div>
                      
                      {
                        errors.nombre && (
                          <p className="text-danger">El Nombre es Obligatorio</p>
                        )
                      }
                      
                      <div className="col-12">
                      <label className="form-label">Dirección</label>
                        <input type="text" className="form-control" defaultValue={usuario.direccion}
                        placeholder="colonia, calle principal Ave 123" {... register('direccion',{required:true})} />
                      </div>
  
                      {
                        errors.direccion && (
                          <p className="text-danger">La Direccion es Obligatorio</p>
                        )
                      }
  
                      <div className="col-12">
                        <label className="form-label">Número de teléfono:</label>
                        <input className="form-control" maxLength={8} type="tel" placeholder="Número de teléfono"  defaultValue={usuario.telefono}
                        {... register('telefono', {required:true, maxLength:8})} />
                      </div>
  
                      {
                        errors.telefono && (
                          <p className="text-danger">El Telefono es Obligatorio </p>
                        )
                      }
  
                      <div className="col">
                        <label className="form-label">Nombre de Usuario: </label>
                        <div className="input-group">
                          <div className="input-group-text">@</div>
                          <input style={{width:"345px"}} type="text" className="form-control" defaultValue={usuario.username}
                          placeholder="Username" {... register('username', {required:true})} />
                        </div>
                      </div>
  
                      {
                        errors.username && (
                          <p className="text-danger">El Username es Obligatorio</p>
                        )
                      }
  
                      </div>
  
                    <div className="d-flex justify-content-between">
                      <div className="w-100">
                        <label className="form-label">Correo</label>
                        <input type="email" className="form-control" defaultValue={usuario.correo}
                        {...register('correo',{required:true})} />
                      </div>
  
                      <div className='w-100 ms-3'>
                        <label className="form-label">Contraseña</label>
                        <button type="button" className="btn btn-outline-primary" onClick={handleShow}>Cambiar Contraseña</button>
                        <EditpasswordModal show={show} handleClose={handleClose} />

                      </div>
  
                    </div>
                    {
                        errors.correo && (
                          <p className="text-danger">El Correo es Obligatorio</p>
                        )
                    }
                    
                    {
                        errors.pass && (
                          <p className="text-danger">Debes cambiar tu Contraseña y que tenga mas de 5 Caracteres</p>
                        )
                    }



                    <div className="col-12 d-flex">
                      <button type="submit" className="btn btn-outline-success ">Actualizar</button>
                      <Link to={'/perfil'} className='btn btn-outline-danger ms-3'>Cancelar</Link>
                    </div>
                    
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default EditPerfilPage