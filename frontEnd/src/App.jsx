import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Home Page</h1>} />
        <Route path='/login' element={<h1>login</h1>} />
        <Route path='/registro' element={<h1>registro</h1>} />
        <Route path='/editar' element={<h1>editar</h1>} />
        <Route path='/perfil' element={<h1>perfil</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App