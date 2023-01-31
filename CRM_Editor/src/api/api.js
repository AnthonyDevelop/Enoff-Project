import axios from "axios";
import { toast } from 'react-toastify';

//const BASE_URL = "https://enoff.com.ar/server/public";
// const BASE_URL = "http://127.0.0.1:8000";

const apiInstance = axios.create({baseURL: BASE_URL})

apiInstance.interceptors.request.use(
  (request) => {
    request.headers = { 
      Authorization: `Bearer `+ localStorage.getItem('token')
    }
    return request;
  }
)

apiInstance.interceptors.response.use(
  (response) => response,
  (err) => {
    if(err.response.data.message === "Expired JWT Token"){
      localStorage.clear()
      window.location= '/'

      toast.success('Hasta pronto!', {
      });
    }
    if(err.response.data.message === "Invalid credentials."){
      toast.error('Revise su mail y/o contraseña', {
      });
    };
    if(err.response.data.message === "Access Denied"){
      toast.error('Su cuenta ha sido inhabilitada', {
      });
    }
    return Promise.reject(err.response.data);
  }
);

export default apiInstance;