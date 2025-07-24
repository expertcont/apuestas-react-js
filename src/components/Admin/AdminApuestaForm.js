import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl} from '@mui/material'
//import { padding } from '@mui/system'
import {useState,useEffect} from 'react';
import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

export default function ApuestaForm() {
  const back_host = process.env.REACT_APP_BACK_HOST;  
  //Select(Combos) para llenar, desde tabla
  const [unidad_select,setUnidadSelect] = useState([]);
  
  //Estado para variables del formulario
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

  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    console.log('antes:', apuesta);

    //Cambiooo para controlar Edicion
    if (editando){
      await fetch(`${back_host}/apuesta/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(apuesta),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      apuesta.id_anfitrion = params.id_anfitrion;
      console.log('antes de grabar:', apuesta);

      await fetch(`${back_host}/apuesta`, {
        method: "POST",
        body: JSON.stringify(apuesta),
        headers: {"Content-Type":"application/json"}
      });
    }

    setCargando(false);
    navigate(`/apuesta/${params.id_anfitrion}`);
    //navigate(`/ad_equipo`);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    //console.log('aaaa ',params.id_anfitrion,params.id_invitado,params.documento_id,params.id_equipo);
    //cargaUnidad();

    if (params.id){
      mostrarApuesta(params.id_anfitrion,params.id);
      setEditando(true);
    }
    else{
      setEditando(false);
    }
    
    //////////////////////////////////////////
    //////////////////////////////////////////
    //////////////////////////////////////////

  },[]);

  //Rico evento change
  const handleChange = e => {
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

  //funcion para mostrar data de formulario, modo edicion
  const mostrarApuesta = async (sIdAnfitrion, sIdApuesta) => {
    const res = await fetch(`${back_host}/apuesta/${sIdAnfitrion}/${sIdApuesta}`);
    const data = await res.json();
    console.log(data);
    //Actualiza datos para enlace con controles, al momento de modo editar
    setApuesta({
                    id:data.id, 
                    evento:data.evento, 
                    liga:data.liga, 
                    pais:data.pais,
                    monto:data.monto, 
                    fecha_apuesta:data.fecha_apuesta, 
                    apuesta_estado:data.apuesta_estado,
                    apuesta_resultado:data.apuesta_resultado,
                  });
    //console.log(data.relacionado);
    setEditando(true);
  };

  const cargaUnidad = () =>{
    //console.log(`${back_host}/unidadmedida`);
    axios
    .get(`${back_host}/unidadmedida`)
    .then((response) => {
        setUnidadSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  };

  return (
    <Grid container
          direction="column"
          alignItems="center"
          justifyContent="center"
    >
        <Grid item xs={12} >
            <Card //sx={{mt:1}}
                  sx={{ minWidth: 275 }}            
                  style={{
                    background:'#1e272e',
                    padding:'.1rem'
                  }}
                  >
                <Typography variant='subtitle2' color='white' textAlign='center'>
                    {editando ? "EDITAR APUESTA" : "CREAR APUESTA"}
                </Typography>
                <CardContent >
                    <form onSubmit={handleSubmit} autoComplete="off">

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
                                   onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                   onChange={handleChange}
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
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white', textTransform: 'uppercase'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                        />

                        <Select
                                  labelId="apuesta_estado"
                                  size='small'
                                  autoFocus
                                  id={apuesta.apuesta_estado}
                                  value={apuesta.apuesta_estado}
                                  name="apuesta_estado"
                                  sx={{display:'block',
                                  margin:'.5rem 0', color:"white"}}
                                  label="Zona"
                                  onChange={handleChange}
                                  inputProps={{ style:{color:'white'} }}
                                  InputLabelProps={{ style:{color:'white'} }}
                                >
                            <MenuItem value="LOCAL">LOCAL</MenuItem>
                            <MenuItem value="VISITA">VISITA</MenuItem>
                            <MenuItem value="EMPATE">EMPATE</MenuItem>
                        </Select>


                        <Button variant='contained' 
                                color='primary' 
                                type='submit'
                                disabled={!apuesta.liga || 
                                          !apuesta.monto ||
                                          !apuesta.fecha_apuesta || !apuesta.apuesta_estado}
                                >
                                { cargando ? (
                                <CircularProgress color="inherit" size={24} />
                                ) : (
                                  editando ?
                                'Modificar' : 'Grabar')
                                }
                        </Button>

                        <Button variant='contained' 
                                    color='success' 
                                    //sx={{mt:1}}
                                    onClick={ ()=>{
                                      navigate(-1, { replace: true });
                                      //window.location.reload();
                                      }
                                    }
                                    >
                              ANTERIOR
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
  )
}
