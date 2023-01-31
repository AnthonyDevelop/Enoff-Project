import apiInstance from './api'

const eliminarVideoUser = (idVideo) => {
  return  apiInstance.post('/api/deletePostClient', idVideo)
  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default eliminarVideoUser;