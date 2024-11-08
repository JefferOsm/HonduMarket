import React, { useState, useRef, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { usarAutenticacion } from '../context/autenticacion';
import { usarProductosContex } from '../context/productosContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faCircleUser, faBars, faFileArrowUp, faStore, faSearch, faBookmark, faSignal, faMessage, faClipboard, faFileCsv, faTable, faUpDown, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import ModalBusqueda from './modalBusqueda';
import ModalChat from "../pages/Chat/ModalChat";

function NavBar() {

  const { detailProduct, obtenerUsuario, obtenerPublicacionesSearch,
     obtenerCategorias, categorias, productosCategoria } = usarProductosContex();
  const { autenticado, logout, usuario } = usarAutenticacion();

  //funcionalidades para el modal de Busqueda

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    obtenerPublicacionesSearch();
    document.activeElement.blur();
  };



  //Funcionalidades para el modal del Chat
  const [Chat, setChat] = useState(false);
  const ChatClose = () => setChat(false);
  const handleChat = () => {
    obtenerUsuario(detailProduct.idUsuario)
    setChat(true)
  };

  const navegarCategoria= async(data)=>{
    await productosCategoria(data.id)
    navigate(`/Categorias/${data.nombre}/${data.id}`)
  }



  useEffect(() => {
    obtenerCategorias();
  }, [])

  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top py-2 bc-primary  ">
        <div className="container-fluid">
          <Link className="navbar-brand text-light me-3 px-3" to={'/'} 
          > <img src="../../public/logo.png" style={{width:'100px', height:'50px',objectFit: 'contain'}} /></Link>
          <button className="navbar-toggler text-light border" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span ><FontAwesomeIcon icon={faBars} /></span>
          </button>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className='text-light fs-6 bc-drop-home'>
              Categorías
            </Dropdown.Toggle>

            <Dropdown.Menu className='bc-primary'>
              {categorias.map((categoria) => (
                <Dropdown.Item key={categoria.categoria_id} className='drop-home-item text-light fw-bold p-2'
                onClick={()=>{navegarCategoria({id:categoria.categoria_id, nombre:categoria.nombre_categoria })}} >
                  {categoria.nombre_categoria}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Cambiar navgar si esta o no autenticado */}
          {autenticado ? (
            <>
              {/* Mostrar Cuando el Usuario esta Autenticado */}
              <div className="collapse navbar-collapse w-340" id="navbarSupportedContent">

                <form className="d-flex mx-auto me-5 my-2 w-340" role="search">
                  <div className="btn bc-secondary-body text-light me-2" onClick={handleShow}><FontAwesomeIcon icon={faSearch} /></div>
                  <input className="form-control me-2 w-340" type="search" placeholder="Buscar" aria-label="Search"
                    onClick={handleShow} />
                </form>

                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 justify-content-center px-3">
                  <li className="nav-item ">
                    <Link className="nav-link active text-light me-2">Bienvenido {usuario.username}</Link>
                  </li>

                  <li className="nav-item me-2">

                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic" className='text-light fs-5 bc-drop-home'>
                        <FontAwesomeIcon icon={faCircleUser} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className='bc-primary'>
                        <Dropdown.Item className='drop-home-item text-light fw-bold p-2' href="/perfil">
                          <FontAwesomeIcon icon={faCircleUser} />  Perfil
                        </Dropdown.Item>

                       
                          <li>
                            <div className="accordion-item">
                              <h5 className="accordion-header bc-primary d-flex text-center text-light">
                                
                                <button className="accordion-button bc-primary text-light fw-bold p-2" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                 <FontAwesomeIcon icon={faCloudUpload} style={{ marginRight: '6px' }}/>  Publicar
                                </button>
                              </h5>
                              <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body px-3">
                                  <Dropdown.Item className='drop-home-item text-light fw-bold p-2' href="/perfil/publicar">
                                    <FontAwesomeIcon icon={faClipboard} />  Publicar manualmente
                                  </Dropdown.Item>

                                  <Dropdown.Item className='drop-home-item text-light fw-bold p-2' href="/perfil/CSV_publicar">
                                    <FontAwesomeIcon icon={faTable} />  Publicar con CSV
                                  </Dropdown.Item>

                                </div>
                              </div>
                            </div>
                          </li>
                       
                        

                        <Dropdown.Item className='drop-home-item text-light fw-bold p-2' href="/perfil/publicaciones">
                          <FontAwesomeIcon icon={faStore} />  Mis Publicaciones
                        </Dropdown.Item>

                        <Dropdown.Item className='drop-home-item text-light fw-bold p-2' href="/perfil/lista-deseos">
                          <FontAwesomeIcon icon={faBookmark} />  Lista de Deseos
                        </Dropdown.Item>

                        <Dropdown.Item className='drop-home-item text-light fw-bold p-2' href="/perfil/mensajes" >
                          <FontAwesomeIcon icon={faMessage} /> Mensajes
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link text-light fs-5" to={'/'} onClick={() => { logout() }} title='Cerrar Sesion'>
                      <FontAwesomeIcon icon={faRightFromBracket} style={{ color: "#ab296a", }} />
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Mostrar Cuando no hay Usuario Logueado */}
              <div className="collapse navbar-collapse w-340" id="navbarSupportedContent">

                <form className="d-flex mx-auto me-5 my-2 w-340" role="search">
                  <div className="btn bc-secondary-body text-light me-2" onClick={handleShow}><FontAwesomeIcon icon={faSearch} /></div>
                  <input className="form-control me-2 w-340" type="search" placeholder="Buscar" aria-label="Search" onClick={handleShow} />
                </form>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                  <li className="nav-item p-1 btn-nav rounded-3 my-2 text-center">
                    <Link className="nav-link active text-light" to={'/registro'}>Registrate</Link>
                  </li>

                  <li className="nav-item p-1 btn-nav my-2 rounded-3 text-center">
                    <Link className="nav-link text-light" to={'/login'}>Inicia Sesion</Link>
                  </li>

                </ul>

              </div>
            </>
          )}
        </div>
      </nav>
      <ModalBusqueda show={show} handleClose={handleClose} />
      <ModalChat show={Chat} handleClose={ChatClose} />
    </>
  )
}

export default NavBar