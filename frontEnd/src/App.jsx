import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginPage';
import RegistroPage from './pages/registroPage';
import PerfilPage from './pages/perfilPage';
import { AutenticacionProvider } from './context/autenticacion';
import { ProductosProvider } from './context/productosContext';
import ProteccionRoute from './proteccionRoute';
import NavBar from './components/navBar';
import EditPerfilPage from './pages/editPerfilPage';
import PublicarArticulo from './pages/PublicarArticulo';


function App(){
  return (
    <AutenticacionProvider>
      <ProductosProvider>
          <BrowserRouter>
          <NavBar />
            <Routes>
              <Route path='/' element={<HomePage/>} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/registro' element={<RegistroPage />} />

            <Route element={<ProteccionRoute/>}>
            <Route path='/publicar' element={<h1>PublicarArticulo</h1>} />
              <Route path='/editar' element={<h1>editar</h1>} />
              <Route path='/perfil' element={<PerfilPage/>} />
              <Route path='/perfil/editar' element={<EditPerfilPage/>} />
              <Route path='/perfil/publicar' element={<PublicarArticulo/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProductosProvider>
    </AutenticacionProvider>
  );
}

export default App