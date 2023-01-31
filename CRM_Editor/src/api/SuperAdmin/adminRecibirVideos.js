import apiInstance from '../api'

const adminRecibirVideos = (user) => {
  return  apiInstance.post('/api/admin/listPostAdmin',user)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default adminRecibirVideos;