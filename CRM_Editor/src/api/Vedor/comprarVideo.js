import apiInstance from '../api';

const comprarVideo = (params) => {
  return  apiInstance.post('/api/comprarPostVedor', params)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default comprarVideo;