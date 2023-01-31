import apiInstance from './api'

const RecibirMisVideos = (user) => {
  return  apiInstance.post('/api/listPosts',user)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default RecibirMisVideos;