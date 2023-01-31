import apiInstance from './api'

const listCategorias = (datos) => {
  return  apiInstance.get('/api/listCategoria',datos)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default listCategorias;