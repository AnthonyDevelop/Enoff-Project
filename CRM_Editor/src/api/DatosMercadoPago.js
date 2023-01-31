import apiInstance from './api'

const DatosMercadoPago = () => {
  return  apiInstance.get('/api/mercadopago/client/information')

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default DatosMercadoPago;