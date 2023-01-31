import apiInstance from './api'

const Registro = (user) => {
  return  apiInstance.post('/register',user)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default Registro;