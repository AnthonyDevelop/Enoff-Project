import apiInstance from '../api';

const apiAddPeriodista = (contenido) => {
  return  apiInstance.post('/api/vedor/addPeriodista',contenido)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiAddPeriodista;