import apiInstance from '../api';

const apiDeletePeriodista = (contenido) => {
  return  apiInstance.get('/api/vedor/deletePeriodista',contenido)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiDeletePeriodista;