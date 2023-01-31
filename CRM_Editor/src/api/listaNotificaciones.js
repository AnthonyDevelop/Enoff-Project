import apiInstance from './api';

const apiListaNotificacionesUser = (contenido) => {
  return  apiInstance.post('/api/listNotificacion',contenido)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiListaNotificacionesUser;