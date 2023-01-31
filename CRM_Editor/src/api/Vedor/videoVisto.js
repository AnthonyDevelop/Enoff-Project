import apiInstance from '../api';

const videoVisto = (params) => {
  return  apiInstance.get('/api/vistoPost/' + params)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default videoVisto;