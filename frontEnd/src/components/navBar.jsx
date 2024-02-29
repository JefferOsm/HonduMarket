import React from 'react'
import { Link } from 'react-router-dom'
import { usarAutenticacion } from '../context/autenticacion'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRightFromBracket, faCircleUser, faBars} from '@fortawesome/free-solid-svg-icons'

function NavBar() {


  const{autenticado,logout,usuario}=  usarAutenticacion();


  return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top py-2 bc-primary  ">
        <div className="container-fluid">
          <Link className="navbar-brand text-light me-3 px-3" to={'/'}>HonduMarket</Link>
          <button className="navbar-toggler text-light border" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span ><FontAwesomeIcon icon={faBars}/></span>
          </button>
          {/* Cambiar navgar si esta o no autenticado */}
          {autenticado ? (
            <>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 justify-content-center px-3">
                    <li className="nav-item ">
                      <Link className="nav-link active text-light me-2">Bienvenido {usuario.username}</Link>
                    </li>

                    <li className="nav-item me-2">
                      <Link className="nav-link text-light fs-5" to={'/perfil'} title='Ver Perfil'>
                        <FontAwesomeIcon icon={faCircleUser} />
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link text-light fs-5" to={'/'} onClick={()=>{logout()}} title='Cerrar Sesion'>
                        <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#ab296a",}} />
                      </Link> 
                    </li>




                </ul>
              </div>         
            </>
          ):(
            <>
              <div className="collapse navbar-collapse w-400" id="navbarSupportedContent">
              
              <form className="d-flex mx-auto me-5 my-2" role="search">
                  <button className="btn bc-secondary-body text-light me-2" type="submit">Buscar</button>
                  <input className="form-control me-2 w-280" type="search" placeholder="Search" aria-label="Search" />
              </form>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                  <li className="nav-item p-1 btn-nav rounded-3 my-2">
                    <Link className="nav-link active text-light" to={'/registro'}>Registrate</Link>
                  </li>

                  <li className="nav-item p-1 btn-nav my-2  rounded-3">
                    <Link className="nav-link text-light" to={'/login'}>Inicia Sesion</Link>
                  </li>

                </ul>

              </div>
            </>
          )}
        </div>
      </nav>
  )
}

export default NavBar