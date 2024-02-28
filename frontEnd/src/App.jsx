import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginPage';
import RegistroPage from './pages/registroPage';
import PerfilPage from './pages/perfilPage';
import { AutenticacionProvider } from './context/autenticacion';
import ProteccionRoute from './proteccionRoute';
import NavBar from './components/navBar';
import EditPerfilPage from './pages/editPerfilPage';


function App(){
  return (
    <AutenticacionProvider>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/registro' element={<RegistroPage />} />

          <Route element={<ProteccionRoute/>}>
            <Route path='/editar' element={<h1>editar</h1>} />
            <Route path='/perfil' element={<PerfilPage/>} />
            <Route path='/perfil/editar' element={<EditPerfilPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AutenticacionProvider>
  );
}

export default App