import React from 'react';
import { useEffect, useState, useMemo, useCallback } from "react"
import { Modal,Grid, Button,useMediaQuery,Select, MenuItem, Dialog, DialogTitle} from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import FindIcon from '@mui/icons-material/FindInPage';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { blueGrey } from '@mui/material/colors';

import DaySelector from "./AdminDias";

//import PrintIcon from '@mui/icons-material/Print';

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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';

import { useAuth0 } from '@auth0/auth0-react'; //new para cargar permisos luego de verificar registro en bd
import { Warning } from '@mui/icons-material';

import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'; // LOCAL
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'; // VISITA
import SyncAltIcon from '@mui/icons-material/SyncAlt'; // EMPATE



export default function AdminVentaList() {
  //Control de useffect en retroceso de formularios
  //verificamos si es pantalla pequeña y arreglamos el grid de fechas
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  //Seccion Dialog
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [showModalEmite, setShowModalEmite] = useState(false);

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

  //Seccion carga de archivos
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////


  const back_host = process.env.REACT_APP_BACK_HOST;
  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
	//const [data, setData] = useState(tableDataItems);
  const [registrosdet,setRegistrosdet] = useState([]);
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado
  const [valorBusqueda, setValorBusqueda] = useState(""); //txt: rico filtrado
  const [valorVista, setValorVista] = useState("ventas");
  const {user, isAuthenticated } = useAuth0();
  
  const [periodo_trabajo, setPeriodoTrabajo] = useState("");
  const [periodo_select,setPeriodosSelect] = useState([]);
     
  const [datosPopUp,setDatosPopUp] = useState([]);
  let [diaSel, setDiaSel] = useState("");
  const [apuesta,setApuesta] = useState({
      id:'',
      id_usuario:'',
      evento:'',
      liga:'',
      pais:'',
      fecha_apuesta:'',
      monto:'',
      apuesta_estado:'',
  })


  const handleChange = e => {
    //Para todos los demas casos ;)
    if (e.target.name==="periodo"){
      console.log('cambiando en periodo');
      setPeriodoTrabajo(e.target.value);
      //En cada cambio, actualizar ultimo periodo seleccionado 
      sessionStorage.setItem('periodo_trabajo', e.target.value);
      //console.log('handleChange periodo_trabajo', e.target.value);
    }
    setUpdateTrigger(Math.random());//experimento para actualizar el dom
  }
  
  // Agrega íconos al inicio de cada columna
  
    const columnas = [
    { name:'ID', 
      selector:row => row.id_evento,
      width: '100px',
      sortable: true
    },

{
  name: 'APOSTAR POR ',
  width: '150px',
  cell: (row) => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Tooltip title="Apostar por LOCAL">
        <IconButton
          color="success"
          onClick={() => handleApuesta(row, 'LOCAL')}
        >
          <SportsSoccerIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Apostar por VISITA">
        <IconButton
          color="primary"
          onClick={() => handleApuesta(row, 'VISITA')}
        >
          <FlightTakeoffIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Apostar por EMPATE">
        <IconButton
          color="warning"
          onClick={() => handleApuesta(row, 'EMPATE')}
        >
          <SyncAltIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </div>
  ),
  allowOverflow: true,
  button: true,
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
    { name:'FECHA', 
      selector:row => row.fecha,
      width: '150px',
      sortable: true
    },
    { name:'ESTADO', 
      selector:row => row.estado,
      width: '150px',
      sortable: true
    },

    ];
  
  

  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

  
 
  const handleApuesta = (elemento,estado) => {
    //LLenar datos useState apuesta
    setApuesta({
      id_evento: elemento.id_evento,
      id_anfitrion: params.id_anfitrion,
      evento: elemento.evento,
      liga: elemento.liga,
      pais: elemento.pais,
      fecha_apuesta: elemento.fecha,
      monto: 0,
      apuesta_estado: estado,
    });
    setShowModalEmite(true);
    console.log('apuesta de prueba');
  };
  
  

  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  const cargaRegistro = async (sFechaPartido) => {
    console.log("fecha de consulta de partidos: ", sFechaPartido);
    let response;
    //Cargamos asientos correspondientes al id_usuario,contabilidad y periodo
    //usamos los historiales
    response = await fetch(`${back_host}/partidos/${sFechaPartido}`);
    
    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
    console.log("data de partidos: ", data);
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
      const sEvento = elemento.evento?.toString().toLowerCase() || '';
      const sPais = elemento.pais?.toString().toLowerCase() || '';
  
      if (sEvento.includes(strBusca.toLowerCase()) || sPais.includes(strBusca.toLowerCase())) {
        return elemento;
      }
      return null; // Agrega esta línea para manejar el caso en que no haya coincidencia
    });
  
    resultadosBusqueda = resultadosBusqueda.filter(Boolean); // Filtra los elementos nulos
  
    setRegistrosdet(resultadosBusqueda);
  };
  
  
  //////////////////////////////////////////////////////////
  useEffect( ()=> {
      
    // Realiza acciones cuando isAuthenticated cambia
    const sPeriodos = cargaPeriodosAnfitrion();

  },[isAuthenticated, user]) //Aumentamos IsAuthenticated y user


  useEffect( ()=> {
    //Carga de Registros API EXTERNA DE deportes
    if (periodo_trabajo !== "" && diaSel !== "") {
    cargaRegistro(periodo_trabajo+'-'+diaSel); }
    
  },[diaSel]) //Solo cuando este completo estado


  //////////////////////////////////////////////////////////
  
  const cargaPeriodosAnfitrion = () => {
    // Fecha actual (puedes reemplazar por una fija para pruebas si deseas)
    const fechaActual = new Date(); // Ejemplo fijo: new Date("2025-07-24")
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth() + 1; // getMonth() devuelve 0-11

    // Generar periodos desde enero hasta el mes actual en formato "YYYY-MM"
    const periodos = [];
    for (let mes = 1; mes <= mesActual; mes++) {
        const mesStr = mes.toString().padStart(2, '0');
        periodos.push({ periodo: `${anioActual}-${mesStr}` });
    }

    setPeriodosSelect(periodos);

    if (periodos.length > 0) {
    //setPeriodoTrabajo(periodos[0].periodo);
    setPeriodoTrabajo(periodos[periodos.length - 1].periodo);
    sessionStorage.setItem('periodo_trabajo', periodos[periodos.length - 1].periodo);
    }
    return periodos;
  };

  //////////////////////////////////////////////////////////
  const abrirCerrarModal = ()=>{
    setAbierto(!abierto);
  };
  const [abierto,setAbierto] = useState(false);
  const modalStyles={
    position:'absolute',
    top:'0%',
    left:'0%',
    background:'gray',
    border:'2px solid #000',
    padding:'16px 32px 24px',
    width:'100',
    minHeight: '50px'
    //transform:'translate(0%,0%)'
  };
  const handleCerrar = (updatedData) => {
    setDatosPopUp(updatedData); // Actualiza los datos con los datos modificados
    setAbierto(false); // Cierra el modal
  };
  //////////////////////////////////////////////////////
  
  const handleDayFilter = (selectedDay) => {
    const dia = selectedDay.toString().padStart(2, '0');
    setDiaSel(dia);
  };
  const handleChangeApuesta = e => {
    setApuesta({...apuesta, [e.target.name]: devuelveValor(e)});
    //console.log(e.target.name, e.target.value);
  }
  const devuelveValor = e =>{
      let strNombre;
      strNombre = e.target.name;
      strNombre = strNombre.substring(0,3);
      console.log(e.target.name);  
      if (strNombre === "chk"){
        console.log(e.target.checked);  
        return(e.target.checked);
      }else{
        console.log(e.target.value);
        return(e.target.value);
      }
  }

   const handleSaveApuesta = () =>{
    //Consumir API grabar
    confirmaGrabarComprobante();
    console.log('handleSaveApuesta', apuesta);
    //Quitar modal emitir
    setShowModalEmite(false);

    //actualizar params, renderizado automatico
  }
  const confirmaGrabarComprobante = async()=>{
  
    //Alimentar useState venta
    const estadoFinal = {
        id_anfitrion:params.id_anfitrion,
        evento:apuesta.evento,
        liga:apuesta.liga,
        pais:apuesta.pais,
        fecha_apuesta:apuesta.fecha_apuesta,
        monto:apuesta.monto,
        apuesta_estado:apuesta.apuesta_estado,
    };

    console.log(estadoFinal);

    const sRuta = `${back_host}/apuesta`;
    fetch(sRuta, {
      method: "POST",
      body: JSON.stringify(estadoFinal), //cambiazo de elementosSeleccionados por soloNumAsientos, tamaño minimo json para evitar rechazo en backend railway
      headers: {"Content-Type":"application/json"}
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            //console.log('La operación fue exitosa');
            swal({
              text:"Detalle registrado con exito",
              icon:"success",
              timer:"2000"
            });
            
            //setUpdateTrigger(Math.random());//actualizad vista detalle

        } else {
            console.log('La operación falló');
            // Aquí puedes agregar lógica adicional para manejar una respuesta fallida
            swal({
              text:"La Operacion fallo, intentelo nuevamente",
              icon:"warning",
              timer:"2000"
            });
        }
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud fetch:', error);
        //ahora si
        // Aquí puedes agregar lógica adicional para manejar errores en la solicitud
    });
    
  }


 return (
  <>

  <Grid container
        direction={isSmallScreen ? 'column' : 'row'}
        //alignItems={isSmallScreen ? 'center' : 'center'}
        justifyContent={isSmallScreen ? 'center' : 'center'}
  >

      <Grid container spacing={0}
          direction={isSmallScreen ? 'column' : 'row'}
          alignItems={isSmallScreen ? 'center' : 'center'}
          justifyContent={isSmallScreen ? 'center' : 'center'}
      >
          <Grid item xs={1.5} sm={1.5}>
              <Select
                    labelId="periodo"
                    //id={periodo_select.periodo}
                    size='small'
                    value={periodo_trabajo}
                    name="periodo"
                    sx={{display:'block',
                    margin:'.1rem 0', color:"skyblue", fontSize: '13px' }}
                    label="Periodo Cont"
                    onChange={handleChange}
                    >
                      <MenuItem value="default">SELECCIONA </MenuItem>
                    {   
                        periodo_select.map(elemento => (
                        <MenuItem key={elemento.periodo} value={elemento.periodo}>
                          {elemento.periodo}
                        </MenuItem>)) 
                    }
              </Select>
          </Grid>
          <Grid item xs={4} sm={4}>

          </Grid>
      </Grid>

  </Grid>
  
  <DaySelector period={periodo_trabajo} onDaySelect={handleDayFilter} />
  
                { (showModalEmite) ?
                (   <>
                            {/* Seccion para mostrar Dialog tipo Modal, para busqueda incremental cuentas */}
                            <Dialog
                                open={showModalEmite}
                                onClose={() => setShowModalEmite(false)}
                                maxWidth="md" // Valor predeterminado de 960px
                                //fullWidth
                                disableScrollLock // Evita que se modifique el overflow del body
                                PaperProps={{
                                style: {
                                    top: isSmallScreen ? "-40vh" : "0vh", // Ajusta la distancia desde arriba
                                    left: isSmallScreen ? "-25%" : "0%", // Centrado horizontal
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginTop: '10vh', // Ajusta este valor según tus necesidades
                                    //background:'#1e272e',
                                    background: 'rgba(30, 39, 46, 0.95)', // Plomo transparencia                              
                                    //background: 'rgba(16, 27, 61, 0.95)', // Azul transparencia                              
                                    color:'white',
                                    width: isSmallScreen ? ('40%') : ('20%'), // Ajusta este valor según tus necesidades
                                    //width: isSmallScreen ? ('100%') : ('40%'), // Ajusta este valor según tus necesidades
                                    //maxWidth: 'none' // Esto es importante para permitir que el valor de width funcione
                                },
                                }}
                            >
                            <DialogTitle>Datos - Apuesta</DialogTitle>

                                <TextField variant="outlined" 
                                        //label="Fecha Apuesta"
                                        fullWidth
                                        size='small'
                                        type='date'
                                        //multiline
                                        sx={{display:'block',
                                                margin:'.5rem 1'}}
                                        name="fecha_apuesta"
                                        value={apuesta.fecha_apuesta}
                                        onChange={handleChangeApuesta}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                />

                                <TextField variant="outlined" 
                                        label="Evento"
                                        fullWidth
                                        size='small'
                                        //multiline
                                        sx={{display:'block',margin:'.5rem 0'}}
                                        name="evento"
                                        value={apuesta.evento}
                                        onChange={handleChangeApuesta}
                                        inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                />
                                <TextField variant="outlined" 
                                        label="Liga"
                                        fullWidth
                                        size='small'
                                        //multiline
                                        sx={{display:'block',margin:'.5rem 0'}}
                                        name="liga"
                                        value={apuesta.liga}
                                        onChange={handleChangeApuesta}
                                        inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                />
                                
                                <TextField variant="outlined" 
                                        label="Pais"
                                        fullWidth
                                        size='small'
                                        //multiline
                                        sx={{display:'block',
                                                margin:'.5rem 1'}}
                                        name="pais"
                                        value={apuesta.pais}
                                        onChange={handleChangeApuesta}
                                        inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                />

                                <TextField variant="outlined" 
                                        label="Monto Apostado S/."
                                        fullWidth
                                        size='small'
                                        //multiline
                                        sx={{display:'block',
                                                margin:'.5rem 1'}}
                                        name="monto"
                                        value={apuesta.monto}
                                        onChange={handleChangeApuesta}
                                        inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                />

                                <Select
                                        labelId="apuesta_estado"
                                        size='small'
                                        fullWidth
                                        autoFocus
                                        id={apuesta.apuesta_estado}
                                        value={apuesta.apuesta_estado}
                                        name="apuesta_estado"
                                        sx={{display:'block',
                                        margin:'.5rem 0', color:"white"}}
                                        label="Zona"
                                        onChange={handleChangeApuesta}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                        >
                                    <MenuItem value="LOCAL">LOCAL</MenuItem>
                                    <MenuItem value="VISITA">VISITA</MenuItem>
                                    <MenuItem value="EMPATE">EMPATE</MenuItem>
                                </Select>


                                <Button variant='contained' 
                                            color='primary' 
                                            fullWidth
                                            //size='small'
                                            onClick={handleSaveApuesta}
                                            sx={{display:'block',margin:'.5rem 0', width: 270}}
                                            >
                                            GRABAR
                                </Button>
                                <Button variant='contained' 
                                            //color='warning' 
                                            //size='small'
                                            fullWidth
                                            onClick={()=>{
                                                    setShowModalEmite(false);
                                                }
                                            }
                                            sx={{display:'block',
                                                    margin:'.5rem 0',
                                                    width: 270, 
                                                    backgroundColor: 'rgba(30, 39, 46)', // Plomo 
                                                '&:hover': {
                                                        backgroundColor: 'rgba(30, 39, 46, 0.1)', // Color de fondo en hover: Plomo transparente
                                                    },                                                             
                                                    mt:-0.5}}
                                            >
                                            ESC - CERRAR
                                </Button>

                            </Dialog>
                            {/* FIN Seccion para mostrar Dialog tipo Modal */}
                    </>
                )
                :
                (   
                    <>
                    </>
                )
                }

  <div>
  <ToggleButtonGroup
    color="success"
    value={valorVista}
    exclusive
    //onChange={actualizaValorVista}
    aria-label="Platform"
  >
    <ToggleButton value="ventas"
                style={{
                    backgroundColor: valorVista === 'ventas' ? 'gray' : 'transparent',
                    color: valorVista === 'ventas' ? "orange" : "gray"
                }}
    >Partidos de Futbol Mundial - SportsDB
    </ToggleButton>

  </ToggleButtonGroup>      
  </div>
    
  <Grid container spacing={0}
      direction={isSmallScreen ? 'row' : 'row'}
      alignItems={isSmallScreen ? 'center' : 'left'}
      justifyContent={isSmallScreen ? 'left' : 'left'}
  >


        <Grid item xs={isSmallScreen ? 1.2 : 0.5}  >    

        </Grid>

        <Grid item xs={isSmallScreen ? 1.2 : 0.5} >

        </Grid>

        <Grid item xs={isSmallScreen ? 1.2 : 0.5} >

        </Grid>

        <Grid item xs={isSmallScreen ? 1.2 : 0.5} >

        </Grid>

        <Grid item xs={isSmallScreen ? 1.2 : 0.5} >    

        </Grid>

        <Grid item xs={isSmallScreen ? 2 : 0.7}>    

        </Grid>
        
        {/* El componente del cuadro de diálogo */}
        {isDialogOpen && (
        
        <Grid item xs={isSmallScreen ? 12 : 8.8}>

        </Grid>

        )}

    <Grid item xs={isSmallScreen ? 12 : 8.3}>

    </Grid>


    <Grid item xs={isSmallScreen ? 12 : 12} >
        <TextField fullWidth variant="outlined" color="success" size="small"
                                    //label="FILTRAR"
                                    sx={{display:'block',
                                          margin:'.0rem 0'}}
                                    name="busqueda"
                                    autoComplete="off"
                                    placeholder='FILTRAR:  EQUIPOS DE FUTBOL, PAIS'
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
