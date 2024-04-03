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
import PublicarArticulo from './pages/publicaciones/PublicarArticulo';
import Vista_del_articulo from './pages/publicaciones/VistaArticulo';
import MisPublicaciones from './pages/publicaciones/MisPublicaciones';
import SearchResultsPage from './pages/publicaciones/searchPage';
import ListaDeseosPage from './pages/publicaciones/ListaDeseosPage';
import CentroChat from './pages/Chat/CentroChat';
import Editar_Articulo from './pages/publicaciones/EditarArticulo';
import { ChatProvider } from './context/chatContext';


function App(){
  return (
    <AutenticacionProvider>
      <ProductosProvider>
        <ChatProvider>
          <BrowserRouter>
          <NavBar />
            <Routes>
              <Route path='/' element={<HomePage/>} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/registro' element={<RegistroPage />} />
              <Route path='/Vista_del_articulo/:nombre/:id' element={<Vista_del_articulo/>}/>
              <Route path='/Editar_articulo/:nombre/:id' element={<Editar_Articulo/>} />
              <Route path='/search' element={<SearchResultsPage/>}/>
              
            <Route element={<ProteccionRoute/>}>
              <Route path='/perfil' element={<PerfilPage/>} />
              <Route path='/perfil/editar' element={<EditPerfilPage/>} />
              <Route path='/perfil/publicar' element={<PublicarArticulo/>} />
              <Route path='/perfil/publicaciones' element={<MisPublicaciones/>} />
              <Route path='/perfil/lista_deseos' element={<ListaDeseosPage/>} />
              <Route path='/perfil/chat' element={<CentroChat/>} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ChatProvider>
      </ProductosProvider>
    </AutenticacionProvider>
  );
}

export default App