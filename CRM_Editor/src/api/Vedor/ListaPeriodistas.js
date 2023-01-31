import apiInstance from '../api';

const apiListaPeriodista = (contenido) => {
  return  apiInstance.post('/api/vedor/listPeriodistasAsignados',contenido)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiListaPeriodista;