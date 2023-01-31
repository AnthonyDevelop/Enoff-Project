import apiInstance from '../api'

const sumarStrike = (idUser) => {
  return  apiInstance.get('/api/vedor/handlerStrikes/' + idUser)
  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default sumarStrike;