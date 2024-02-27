import React from 'react'



export const Ingresar = () => {
  return (

    <div>
      <form class="px-4 py-3">
      <h2 style={{ textAlign: "center"}}>Mi Cuenta</h2>
      <div class="mb-3">
          <label for="correo" class="form-label">Correo</label>
          <input type="email" class="form-control" id="correo" placeholder="email@example.com" />
      </div>
      <div class="mb-3">
          <label for="pass" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="pass" placeholder="Password" />
      </div>
        <button type="submit" class="btn btn-primary">Iniciar sesión</button>
      </form>
      <div class="dropdown-divider"></div>
      <p style={{marginLeft: "30px"}}><a>Nuevo por aquí? </a><a href="/crear" class="link-light">Inscribirse</a></p>
      
      
    </div>
  )
}
