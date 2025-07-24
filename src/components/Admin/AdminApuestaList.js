import React from 'react';
import { useEffect, useState, useMemo, useCallback } from "react"
import { Modal,Grid, Button,useMediaQuery,Select, MenuItem} from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import FindIcon from '@mui/icons-material/FindInPage';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { blueGrey } from '@mui/material/colors';

import IconButton from '@mui/material/IconButton';
import swal from 'sweetalert';
import swal2 from 'sweetalert2'
import Datatable, {createTheme} from 'react-data-table-component';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import '../../App.css';
import 'styled-components';
//import axios from 'axios';

//import { utils, writeFile } from 'xlsx';
import Tooltip from '@mui/material/Tooltip';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import axios from 'axios';

import { useAuth0 } from '@auth0/auth0-react'; //new para cargar permisos luego de verificar registro en bd
import BotonExcelVentas from '../BotonExcelVentas';
import { saveAs } from 'file-saver';


export default function AdminApuestaList() {
  //Control de useffect en retroceso de formularios
  //verificamos si es pantalla pequeña y arreglamos el grid de fechas
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  createTheme('solarized', {
    text: {
      //primary: '#268bd2',
      primary: '#ffffff',
      secondary: '#2aa198',
    },
    background: {
      //default: '#002b36',
      default: '#1e272e'
    },
    context: {
      background: '#cb4b16',
      //background: '#1e272e',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, 'dark');

  const back_host = process.env.REACT_APP_BACK_HOST;
  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const [registrosdet,setRegistrosdet] = useState([]);
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado
  const [valorBusqueda, setValorBusqueda] = useState(""); //txt: rico filtrado
  const {user, isAuthenticated } = useAuth0();

  // Agrega íconos al inicio de cada columna
  const columnas = [
    {
      name: '',
      width: '40px',
      cell: (row) => (
        
          <DriveFileRenameOutlineIcon
            onClick={() => handleUpdate(row.id)}
            style={{
              cursor: 'pointer',
              color: 'skyblue',
              transition: 'color 0.3s ease',
            }}
          />
        
      ),
      allowOverflow: true,
      button: true,
    },
    {
      name: '',
      width: '40px',
      cell: (row) => (
          <DeleteIcon
            onClick={() => handleDelete(row.id)}
            style={{
              cursor: 'pointer',
              color: 'orange',
              transition: 'color 0.3s ease',
            }}
          />
      ),
      allowOverflow: true,
      button: true,
    },
    { name:'ID', 
      selector:row => row.id,
      sortable: true,
      width: '110px'
      //key:true
    },
    { name:'EVENTO', 
      selector:row => row.evento,
      width: '200px',
      sortable: true
    },
    { name:'LIGA', 
      selector:row => row.liga,
      width: '150px',
      sortable: true
    },
    { name:'PAIS', 
      selector:row => row.pais,
      width: '150px',
      sortable: true
    },

    { name:'MONTO', 
      selector:row => row.monto,
      width: '100px',
      sortable: true
    },
    { name:'FECHA APUESTA', 
      selector:row => row.fecha_apuesta,
      width: '150px',
      sortable: true
    },
    { name:'APUESTA POR', 
      selector:row => row.apuesta_estado,
      width: '150px',
      sortable: true
    },
    { name:'RESULTADO', 
        selector:row => row.apuesta_resultado,
        width: '150px',
        sortable: true
    },
    
  ];

  // valores adicionales para Carga Archivo
  const [datosCarga, setDatosCarga] = useState({
    id_anfitrion: '',
    documento_id: ''
  });  

  const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

  const handleUpdate = (id) => {
    //Mostrar formulario para edicion
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        console.log("Estás usando un dispositivo móvil!!");
        //Validamos si es movil, para que no falle el enlace
        navigate(`/apuesta/${params.id_anfitrion}/${id}`);
    } else {
        navigate(`/apuesta/${params.id_anfitrion}/${id}`);
    }    
  };
  const handleDelete = (id) => {
    //console.log(num_asiento);
    confirmaEliminacion(id);
  };
  const confirmaEliminacion = async(sId)=>{
    await swal({
      title:"Eliminar Registro",
      text:"Seguro ?",
      icon:"warning",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          eliminarRegistroSeleccionado(sId);
          setToggleCleared(!toggleCleared);
          setRegistrosdet(registrosdet.filter(
                          registrosdet => registrosdet.id !== sId
                          ));
          setTimeout(() => { // Agrega una función para que se ejecute después del tiempo de espera
              setUpdateTrigger(Math.random());//experimento
          }, 200);
                        
          swal({
            text:"Producto se ha eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  };
  const eliminarRegistroSeleccionado = async (sId) => {
    //En ventas solo se eliminan, detalle-cabecera
    await fetch(`${back_host}/apuesta/${sId}`, {
        method:"DELETE"
    });
  };

  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  const cargaRegistro = async () => {
    //Cargamos productos
    const response = await fetch(`${back_host}/apuesta/${params.id_anfitrion}`);
    
    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
    //console.log("data", data);
  }
  //////////////////////////////////////
  
  const navigate = useNavigate();
  //Para recibir parametros desde afuera
  const params = useParams();

  const actualizaValorFiltro = e => {
    setValorBusqueda(e.target.value);
    filtrar(e.target.value);
  }
  const filtrar = (strBusca) => {
    var resultadosBusqueda = tabladet.filter((elemento) => {
      //verifica nulls para evitar error de busqueda
      const razonSocial = elemento.nombre?.toString().toLowerCase() || '';
  
      if (razonSocial.includes(strBusca.toLowerCase()) ) {
        return elemento;
      }
      return null; // Agrega esta línea para manejar el caso en que no haya coincidencia
    });
  
    resultadosBusqueda = resultadosBusqueda.filter(Boolean); // Filtra los elementos nulos
  
    setRegistrosdet(resultadosBusqueda);
  };
  
  
 
  //////////////////////////////////////////////////////////
  useEffect( ()=> {
        //cargar registro
        console.log("process.env.REACT_APP_BACK_HOST: ",process.env.REACT_APP_BACK_HOST);

        cargaRegistro();
      /////////////////////////////
      //NEW codigo para autenticacion y permisos de BD
      if (isAuthenticated && user && user.email) {
        
      }
      setDatosCarga(prevState => ({ ...prevState, id_anfitrion: params.id_anfitrion }));
      setDatosCarga(prevState => ({ ...prevState, documento_id: params.documento_id }));
  
  },[isAuthenticated, user, updateTrigger]) //Aumentamos IsAuthenticated y user

  const handleDescargarExcelVacio = async () => {
    // Question view id_libro
    let filePath;
    let fileName;

    filePath = '/equipos_prueba.xlsx';
    // Nombre del archivo para la descarga
    fileName = 'equipos_prueba.xlsx';

    // URL completa del archivo
    const fileUrl = process.env.PUBLIC_URL + filePath;

    try {
      // Realizar la solicitud para obtener el archivo usando axios
      const response = await axios.get(fileUrl, { responseType: 'blob' });

      // Utilizar file-saver para descargar el archivo
      saveAs(response.data, fileName);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  
 return (
  <>

  <div>
  </div>
    
  <Grid container spacing={0}
      direction={isSmallScreen ? 'row' : 'row'}
      alignItems={isSmallScreen ? 'center' : 'left'}
      justifyContent={isSmallScreen ? 'left' : 'left'}
  >
      <Grid item xs={isSmallScreen ? 1.2 : 0.5} >
        <Tooltip title='AGREGAR NUEVO' >
          <IconButton color="primary" 
                          //style={{ padding: '0px'}}
                          style={{ padding: '0px', color: blueGrey[700] }}
                          onClick={() => {
                            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
                              //version movil, esperando ... ;) 
                                navigate(`/apuesta/${params.id_anfitrion}/new`);
                            } else {
                                navigate(`/apuesta/${params.id_anfitrion}/new`);
                            }
                          }}
          >
                <AddBoxIcon style={{ fontSize: '40px' }}/>
          </IconButton>
        </Tooltip>
      </Grid>

      <Grid item xs={isSmallScreen ? 1.2 : 0.5}  >    
        <Tooltip title='EXPORTAR XLS' >
            <BotonExcelVentas registrosdet={registrosdet} 
            />
        </Tooltip>
      </Grid>
      
      <Grid item xs={isSmallScreen ? 1.2 : 0.5}  >    

      </Grid>
      
      <Grid item xs={isSmallScreen ? 1.2 : 0.5}  >    

      </Grid>


      <Grid item xs={isSmallScreen ? 12 : 12} >
          <TextField fullWidth variant="outlined" color="success" size="small"
                                      //label="FILTRAR"
                                      sx={{display:'block',
                                            margin:'.0rem 0'}}
                                      name="busqueda"
                                      placeholder='FILTRAR: EQUIPO DE FUTBOL'
                                      onChange={actualizaValorFiltro}
                                      inputProps={{ style:{color:'white'} }}
                                      InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              <FindIcon />
                                            </InputAdornment>
                                          ),
                                          style:{color:'white'},
                                          // Estilo para el placeholder
                                          inputProps: { style: { fontSize: '14px', color: 'gray' } }                                         
                                      }}
          />
      </Grid>

  </Grid>

  <Datatable
      //title="Registro - Pedidos"
      theme="solarized"
      columns={columnas}
      data={registrosdet}
      //selectableRows
      //selectableRowsSingle 
      //contextActions={contextActions}
      //actions={actions}
      onSelectedRowsChange={handleRowSelected}
      clearSelectedRows={toggleCleared}
      pagination
      paginationPerPage={15}
      paginationRowsPerPageOptions={[15, 50, 100]}

      selectableRowsComponent={Checkbox} // Pass the function only
      sortIcon={<ArrowDownward />}  
      dense={true}
  >
  </Datatable>

  </>
  );
}
