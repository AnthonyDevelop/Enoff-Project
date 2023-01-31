import apiInstance from '../api';

const apiListaPeriodistasDisponibles = (contenido) => {
  return  apiInstance.get('/api/vedor/listPeriodistasDisponibles',contenido)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiListaPeriodistasDisponibles;