/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { usarAutenticacion } from '../context/autenticacion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function ModalDenuncia({ show, handleClose, usuario }) {
    const{tiposDenuncias, reportarUsuario} = usarAutenticacion()

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

    const envioDenuncia= async (data)=>{
        const response = await reportarUsuario(data)
        console.log(response)
        setRender(false)
        setReporte(data)
    }

    const cerrar=()=>{
        handleClose()
    }

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
                            onClick={()=>{envioDenuncia({
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
                        <div className='text-center'>
                            <div className='text-success fs-1'>
                                <FontAwesomeIcon icon={faCircleCheck} />
                            </div>
                            <p className='fs-3 fw-bold'>Gracias por ayudarnos</p>
                            <p className='text-secondary'>Tu problema fue enviado</p>
                            <div className='text-light p-2 rounded bc-primary mx-auto' style={{ display:'inline-block',maxWidth:'80%'}}>
                                {reporte.nombre}
                            </div>
                            <p className='fs-6 text-secondary my-1'>
                                Tus reportes nos ayudan a crear un mejor ambiente entre la comunidad
                                de compradores y vendedores en nuestro sistema. ¡Muchas Gracias! 
                            </p>

                            <button className='btn bc-secondary w-100 my-2'
                            onClick={cerrar}>
                                Listo
                            </button>
                            
                        </div>
                    </>
                )}

            </Modal.Body>
        </Modal>
    );
}

export default ModalDenuncia;

