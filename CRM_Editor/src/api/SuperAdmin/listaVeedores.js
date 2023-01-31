import apiInstance from '../api';

const apiListaVeedores = (contenido) => {
  return  apiInstance.post('/api/admin/listVedores',contenido)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiListaVeedores;