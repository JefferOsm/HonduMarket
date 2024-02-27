
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import {Ingresar} from './pages/Ingresar';
import {Crear} from './pages/Crear';
import {Layout} from './pages/Layout';

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Home/>} />


        <Route path="/" element={<Layout/>}>
         <Route path="/ingresar" element={<Ingresar/>} />
         <Route path="/crear" element={<Crear/>} />

          
        </Route>
       

      </Routes>

      
    </div>
  );
}

export default App;
