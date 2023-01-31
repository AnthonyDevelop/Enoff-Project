import apiInstance from './api'

const loginService = (user) => {
  return  apiInstance.post('/api/login_check',user)

  .then(res => { 
    return res.data;
    
  }).catch(error => {
    console.error(error.response);
    throw error.response
  });
}

export default loginService;