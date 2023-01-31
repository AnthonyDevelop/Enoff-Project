import apiInstance from './api'

const veedorRecibirVideos = (user) => {
  return  apiInstance.post('/api/vedor/listPostVedor',user)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default veedorRecibirVideos;