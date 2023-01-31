import apiInstance from '../api'

const listaUsuariosConVideos = (user) => {
  return  apiInstance.post('/api/listNombreUsers',user)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default listaUsuariosConVideos;