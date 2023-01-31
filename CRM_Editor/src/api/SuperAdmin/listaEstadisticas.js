import apiInstance from '../api';

const apiListaEstadisticas = (contenido) => {
  return  apiInstance.get('/api/admin/listEstadisticas',contenido)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiListaEstadisticas;