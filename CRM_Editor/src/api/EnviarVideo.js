import apiInstance from './api'

const EnviarVideo = (contenido) => {
  return  apiInstance.post('/api/addPost',contenido)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default EnviarVideo;