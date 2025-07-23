import {BrowserRouter,Routes,Route} from "react-router-dom";
import {Container} from "@mui/material";
import NavBar from "./components/NavBar";
import { useAuth0 } from '@auth0/auth0-react'; //new para cargar permisos luego de verificar registro en bd
import Inicio from "./components/Inicio";
import { useEffect } from 'react';

import ReportesList from "./components/ReportesList";

import AdminApuestaList from "./components/Admin/AdminApuestaList";
import AdminApuestaForm from "./components/Admin/AdminApuestaForm";

function App(props) {
  //Aqui los props, seran: id_usuario(correo anfitrion),id_login(correo usuario)
  //los props llegan desde BienvenidaExpert.js
  
  //verificamos si es pantalla pequeña y arreglamos el grid de fechas
  const {user, isAuthenticated } = useAuth0();


  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (isAuthenticated && user && user.email) {
      //Verificar Estudios Contables registrados
      //Solo carga ultima contabilidad habilitada
      //todo esto fue a parar al NavBar
    }  

  },[isAuthenticated, user]);

  return (
    <BrowserRouter>

      <div>
      <NavBar idAnfitrion = {props.idAnfitrion}
              idInvitado = {props.idInvitado}
              //periodo_trabajo = {periodo_trabajo}
              //contabilidad_trabajo = {contabilidad_trabajo}
      >
      </NavBar>
      
      <Container>
        <Routes>
          
         { /* Agregar desde Panel (un registro01 Libre)
               Agregar Clonado desde Panel (un registro01 con Numero Orden y datos adicionales)
               Agregar desde Form Orden (un registro01 con Numero Orden)   */ }

          <Route path="/apuesta/:id_anfitrion" element={<AdminApuestaList />} />
          <Route path="/apuesta/:id_anfitrion/new" element={<AdminApuestaForm />} />
          <Route path="/apuesta/:id_anfitrion/:id" element={<AdminApuestaForm />} />

          <Route path="/reporte/:id_anfitrion" element={<ReportesList />} />


          <Route path="/:id_anfitrion" element={<Inicio />} />


          {/*Edit Route */}
        </Routes>
      </Container>
      
      </div>
    </BrowserRouter>


    );
}

export default App;
