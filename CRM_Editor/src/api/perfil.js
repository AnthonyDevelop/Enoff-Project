import apiInstance from './api'

const apiEditarPerfil = (datos) => {
  return  apiInstance.post('/api/editarPerfil',datos)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiEditarPerfil;