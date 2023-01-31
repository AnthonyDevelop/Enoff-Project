import apiInstance from './api'

const enviarMailAyuda = (params) => {
  return  apiInstance.post('/api/correoConsultasDeUsuario',params)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default enviarMailAyuda;