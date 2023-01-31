import apiInstance from './api';

const apiEstadoNotificacion = (contenido) => {
  return  apiInstance.get('/api/switchNotificacion',contenido)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiEstadoNotificacion;