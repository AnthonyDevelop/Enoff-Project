import apiInstance from '../api';

const eliminarVideo = (params) => {
  return  apiInstance.post('/api/descartarPostVedor', params)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default eliminarVideo;