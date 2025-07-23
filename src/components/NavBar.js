import {Box, Container, Toolbar, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import IconButton from '@mui/material/IconButton';

import HomeIcon from '@mui/icons-material/Home';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import axios from 'axios';
import { blueGrey } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import React, { useState } from 'react';
import LoginPerfil from "./LoginPerfil" //new
import LoginLogoutBoton from "./LoginLogoutBoton" //new
import { useAuth0 } from '@auth0/auth0-react'; //new para cargar permisos luego de verificar registro en bd
import { useEffect } from "react"
//import { Button } from "reactstrap";

export default function NavBar(props) {
  const back_host = process.env.BACK_HOST || "https://xpertcont-backend-js-production-50e6.up.railway.app";  
  const navigate  = useNavigate();
  const [selectedButton, setSelectedButton] = useState(null);
  
  const {user, isAuthenticated } = useAuth0();
  
  const [periodo_trabajo, setPeriodoTrabajo] = useState("");
  const [periodo_select,setPeriodosSelect] = useState([]);

  const [contabilidad_trabajo, setContabilidadTrabajo] = useState("");
    
  const handleClick = (buttonId) => {
    setSelectedButton(buttonId);
  }

  const handleChange = e => {
    //Para todos los demas casos ;)
    if (e.target.name==="periodo"){
      setPeriodoTrabajo(e.target.value);
    }
    if (e.target.name==="contabilidad"){
      setContabilidadTrabajo(e.target.value);
    }

  }

  //////////////////////////////////////////////////////////
  useEffect(() => {
    if (isAuthenticated && user && user.email) {
      // cargar permisos de sistema
      console.log("idAnfitrion: ", props.idAnfitrion);
      console.log("idInvitado: ",props.idInvitado);
      
      //Verificar Estudios Contables registrados
      cargaPeriodosAnfitrion();

      /////////////////////////////
    }
  }, [isAuthenticated, user]);


  //////////////////////////////////////////////////////////
  
  const cargaPeriodosAnfitrion = () =>{
    axios
    .get(`${back_host}/usuario/periodos/${props.idAnfitrion}`)
    .then((response) => {
      setPeriodosSelect(response.data);
      //Establecer 1er elemento en select//////////////////////
      if (response.data.length > 0) {
        setPeriodoTrabajo(response.data[0].periodo); 
        console.log('setPeriodoTrabajo: ',response.data[0].periodo);
      }
      /////////////////////////////////////////////////////////
    })
    .catch((error) => {
        console.log(error);
    });
  }
  
  //////////////////////////////////////////////////////////
  
  return (
    <Box sx={{ flexGrow:1 }} >
        <Container>
            <Toolbar>

                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono00' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/${props.idAnfitrion}/${props.idInvitado}`);
                                  handleClick('icono00');
                                                }
                                }
                    >
                      <LoginPerfil></LoginPerfil>
                    </IconButton>

                    <IconButton  
                        sx={{
                          color: blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/${props.idAnfitrion}/${props.idInvitado}`);
                                                }
                                }
                    >
                    <LoginLogoutBoton></LoginLogoutBoton>
                    </IconButton>
                  
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono01' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/${props.idAnfitrion}/${props.idInvitado}`);
                                  handleClick('icono01');
                                                }
                                }
                    >
                      <HomeIcon />
                    </IconButton>


                    <Tooltip title="ADMIN Apuestas">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono02' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                    //el ventalist se encargara de verificar permisos Comandos, con email
                                    //cuidado estamos enviando el periodo y el ruc de la contabilidad inicial del anfitrion
                                    console.log(`/ad_venta/${props.idAnfitrion}/${props.idInvitado}/${periodo_trabajo}/${contabilidad_trabajo}`);
                                    navigate(`/ad_venta/${props.idAnfitrion}/${props.idInvitado}/${periodo_trabajo}/${contabilidad_trabajo}`);
                                    handleClick('icono02');
                                                }
                                }
                    >
                      <ShoppingCartIcon />
                    </IconButton>
                    </Tooltip>


                    <Tooltip title="REPORTES">
                    <IconButton  
                        sx={{
                          color: selectedButton === 'icono05' ? 'primary.main' : blueGrey[300],flexGrow:1
                        }}
                        color="primary" aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/reporte/${props.idAnfitrion}/${props.idInvitado}`);
                                  handleClick('icono05');
                                                }
                                }
                    >
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      R
                      </Typography>                    
                      <InsertChartIcon />
                    </IconButton>
                    </Tooltip>


            </Toolbar>


        </Container>
    </Box>
  );
}
