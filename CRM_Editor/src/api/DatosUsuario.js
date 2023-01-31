import apiInstance from './api'

const DatosUsuario = (datos) => {
  return  apiInstance.get('/api/perfilUsuario',datos)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default DatosUsuario;