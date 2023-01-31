import apiInstance from './api'

const eliminarCredencialMP = () => {
  return  apiInstance.get('/api/mercadoPago/credencials/delete')
  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default eliminarCredencialMP;