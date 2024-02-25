import React from 'react'
import Helmet from 'react-helmet'
import { Outlet } from  "react-router-dom"
import '../static/estilo_layout.css';

export const Layout = () => {
  return (
     
    <div class="plantilla">
        <Helmet>
        <meta charset="utf-8" />
        <title>Encuentralo ya!</title>
        

        //link para css de bootstrap
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
        <link rel="stylesheet" href="/static/estilo_layout.css"/>

        </Helmet>
        <header><h1> Encuentralo ya! </h1></header>

        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/">INICIO</a>
                </li>
                </ul>
            </div>
            </div>
        </nav>

        <div class="clearfix"></div>

        <hr />
        <div class ="contenido">
        <Outlet />
        </div>
        

      <div class="clearfix"></div>

      <footer>
      Grupo #2 &copy; 2024
      </footer>
       


    </div>
  )
}
