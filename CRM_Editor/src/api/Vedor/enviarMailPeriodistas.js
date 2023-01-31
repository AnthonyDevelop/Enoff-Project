import apiInstance from '../api';

const enviarMailPeriodista = (params) => {
    return  apiInstance.post('/api/vedor/enviovideocomprado', params)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default enviarMailPeriodista;