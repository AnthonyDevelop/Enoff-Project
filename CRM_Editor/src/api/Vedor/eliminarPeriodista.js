import apiInstance from '../api';

const apiEliminarPeriodista = (params) => {
  return  apiInstance.post('/api/vedor/deletePeriodista', params)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default apiEliminarPeriodista;