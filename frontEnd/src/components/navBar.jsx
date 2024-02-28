import React from 'react'
import { Link } from 'react-router-dom'
import { usarAutenticacion } from '../context/autenticacion'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRightFromBracket, faCircleUser} from '@fortawesome/free-solid-svg-icons'

function NavBar() {


  const{autenticado,logout,usuario}=  usarAutenticacion();


  return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary py-2 bc-primary ">
        <div className="container-fluid">
          <Link className="navbar-brand text-light me-auto px-3" to={'/'}>Navbar</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Cambiar navgar si esta o no autenticado */}
          {autenticado ? (
            <>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 justify-content-center px-3">
                    <li className="nav-item ">
                      <Link className="nav-link active text-light">Bienvenido {usuario.username}</Link>
                    </li>

                    <li className="nav-item mx-2">
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
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                  <li className="nav-item p-1 bc-primary-2 rounded-3 ms-3">
                    <Link className="nav-link active text-light" to={'/registro'}>Registrate</Link>
                  </li>

                  <li className="nav-item p-1 bc-primary-2 ms-2 rounded-3">
                    <Link className="nav-link text-light" to={'/login'}>Inicia Sesion</Link>
                  </li>

                </ul>
                <form className="d-flex" role="search">
                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                  <button className="btn bc-secondary" type="submit">Buscar</button>
                </form>
              </div>
            </>
          )}
        </div>
      </nav>
  )
}

export default NavBar