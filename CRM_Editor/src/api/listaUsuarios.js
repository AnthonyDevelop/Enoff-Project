import apiInstance from './api'

const listaUsuarios = (user) => {
  return  apiInstance.post('/api/listUsers',user)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default listaUsuarios;