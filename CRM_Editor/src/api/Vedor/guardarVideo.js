import apiInstance from '../api';

const guardarVideo = (params) => {
  return  apiInstance.get('/api/guardarPostVedor/' + params)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default guardarVideo;