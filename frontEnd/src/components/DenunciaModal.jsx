/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { usarAutenticacion } from '../context/autenticacion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faCircleCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import {useForm} from 'react-hook-form';

function ModalDenuncia({ show, handleClose, usuario }) {
    const{tiposDenuncias, reportarUsuario} = usarAutenticacion()
    const {register,handleSubmit,formState:{errors},reset}= useForm()

    const[denunciasType,setDenunciasType]= useState([])
    const[render, setRender]= useState(true)
    const[reporte,setReporte]= useState(null)

    useEffect(()=>{
        if(show){
            const cargarDatos= async()=>{
                const response= await tiposDenuncias();
                setRender(true)
                setDenunciasType(response)
            }

            cargarDatos();
        }
    },[show])

    const renderDenuncia= async (data)=>{
        //console.log(data)
        setRender(false)
        setReporte(data)
        
    }

    const cerrar=()=>{
        handleClose()
    }

    const envioDenuncia= handleSubmit(async(data)=>{
        data['denuncia']=reporte.denuncia
        data['nombre']=reporte.nombre
        data['usuario']=reporte.usuario
        const response = await reportarUsuario(data)
        console.log(response)
        reset({
            detalle: ''
        })
        cerrar()
    })


    return (
        <Modal show={show} onHide={cerrar} backdrop='static'>
            <Modal.Body>
                {render ? (
                    <>
                        <h5>Cuéntanos qué sucede</h5>
                        <p className='text-secondary'>Dinos la razón por la que reportaras a este usuarios</p>
                        {denunciasType && denunciasType.map(tipo=>(
                            <div className='btn p-2 d-flex my-2 rounded shadow-sm justify-content-between'
                            key={tipo.id}
                            onClick={()=>{renderDenuncia({
                                denuncia: tipo.id,
                                nombre: tipo.nombre,
                                usuario
                            })}}>
                                <div className='text-bold'>{tipo.nombre}</div>
                                <div>
                                    <FontAwesomeIcon icon={faCircleArrowRight} />
                                </div>
                            </div>
                        ))}
                        <Modal.Footer className='mt-2'>
                            <Button className='btn bc-primary text-light' onClick={cerrar}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </>
                ) : (
                    <>
                        <button className='btn btn-danger mx-auto' title='Cancelar'
                        onClick={cerrar}>
                            <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                        </button>
                        <div className='text-center'>  
                            <div className='text-success fs-1'>
                                <FontAwesomeIcon icon={faCircleCheck} />
                            </div>
                            <p className='fs-3 fw-bold'>Gracias por ayudarnos</p>
                            <p className='text-secondary'>Tu problema a enviar es:</p>
                            <div className='text-light p-2 rounded bc-primary mx-auto' style={{ display:'inline-block',maxWidth:'80%'}}>
                                {reporte.nombre}
                            </div>
                            <form onSubmit={envioDenuncia}>
                                <div className="form-floating my-3">
                                    <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea"
                                    {... register('detalle',{required:true})}></textarea>
                                    <label htmlFor="floatingTextarea">Describa un poco mas su problema</label>
                                </div>
                                {
                                    errors.detalle && (
                                        <p className="text-danger">Necesitamos mas detalles del problema</p>
                                    )
                                }
                                <p className='fs-6 text-secondary my-1'>
                                    Tus reportes nos ayudan a crear un mejor ambiente entre la comunidad
                                    de compradores y vendedores en nuestro sistema. ¡Muchas Gracias! 
                                </p>

                                <button className='btn bc-secondary w-100 my-2'
                                type='submit'>
                                    Enviar Reporte
                                </button>
                            </form>                            
                        </div>
                    </>
                )}

            </Modal.Body>
        </Modal>
    );
}

export default ModalDenuncia;

