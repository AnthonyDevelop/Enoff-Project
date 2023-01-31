import apiInstance from './api'

const reenviarCodigoUser = (user) => {
  return  apiInstance.post('/reenviarCodigoUser',user)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default reenviarCodigoUser;