import apiInstance from './api'

const enviarCodigoMP = (codigo) => {
  return  apiInstance.post('/api/mercadoPago/credencials/add',codigo)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default enviarCodigoMP;