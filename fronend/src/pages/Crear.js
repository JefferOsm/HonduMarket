import React from 'react'

export const Crear = () => {
  return (
    <div>
      <form class="row g-3 px-4 py-3">
      <h2 style= {{textAlign: "center"}}>Crear cuenta</h2>
      <div class="row g-3">
        <div class="col">
          <input type="text" class="form-control" placeholder="Nombre Completo" aria-label="Nombre"/>
        </div>
        
        <div class="col-12">
        <label for="inputAddress" class="form-label">Dirección</label>
           <input type="text" class="form-control" id="inputAddress" placeholder="colonia, calle principal Ave 123"/>
        </div>
        <div class="col-12">
           <label for="telefono">Número de teléfono:</label>
           <input type="tel" name="telefono" id="telefono" placeholder="Número de teléfono" pattern="^[0-9]+$"/>
        </div>
        <div class="col">
          <label class="visually-hidden" for="autoSizingInputGroup">Username</label>
          <div class="input-group">
            <div class="input-group-text">@</div>
            <input style={{width:"345px"}} type="text" class="form-control" id="autoSizingInputGroup" placeholder="Username"/>
          </div>
        </div>
        </div>
      <div class="col-md-6">
      <label for="inputEmail4" class="form-label">Email</label>
      <input style={{width:"345px"}} type="email" class="form-control" id="inputEmail4"/>
      </div>
     <div class="col-md-6">
      <label for="inputPassword4" class="form-label">Password</label>
      <input style={{width:"330px"}} type="password" class="form-control" id="inputPassword4"/>
     </div>
     <div class="form-check">
        <input type="checkbox" class="form-check-input" id="dropdownCheck"/>
        <label class="form-check-label"  for="dropdownCheck">
        <a href="#" class="link-light">Acepta los terminos y condiciones</a>  
        </label>
      </div>
     <div class="col-12">
      <button  type="submit" class="btn btn-primary">Crear Cuenta</button>
    </div>
      </form>
      <div class="dropdown-divider"></div>
      <p style={{marginLeft: "30px"}}><a>Ya tienes cuenta? </a><a href="/ingresar" class="link-light">Ingresa ahora</a></p>
    </div>
  )
}
