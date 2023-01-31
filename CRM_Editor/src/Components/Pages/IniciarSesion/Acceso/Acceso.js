import React,{useState,useEffect} from 'react'
import { Link, Navigate, Routes, Route,useLocation} from "react-router-dom";
import {resultVerificar} from '../../../../Actions/login'
import { Button, Navbar } from 'rsuite';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector, useDispatch } from 'react-redux';
import { getDatosUsuario } from '../../../../Actions/datosUsuario';

import "./acceso.css"
import 'swiper/css';

import { Input, InputGroup } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';


export default function Acceso() {
  const [visible, setVisible] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const token = useSelector(state => state.reducerLogin.user_data);
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  const userLogin = localStorage.getItem('token');
  const dispatch = useDispatch();  
  const [errorLogin, setErrorLogin] = useState(false);

  const [login, setLogin] = useState({
    nameuser: '',
    clave: ''
  });


  /*SACAR USUARIO SI LA RUTA NO EXISTE */
  let location = useLocation();

    if(datosUser==null){
      if(location.pathname=="/User/*" || location.pathname=="/User" || location.pathname=="/AdminContenido/*" || location.pathname=="/SuperAdmin/*"){
        window.location = "/";
      }
    }  




  const handleLogin = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value});
  }

  const handleSubmitLogin = () => {    
    setLoadingButton(true);
    const user = {
      username: login.nameuser,
      password:login.clave
    }
    dispatch(resultVerificar(user));
    setTimeout(() => {
      setLoadingButton(false);
      if (userLogin === null || userLogin === "undefined") {
        setErrorLogin(true);
      }
    }, 1000);
  }

  useEffect(() => {
    dispatch(getDatosUsuario());
  }, [token])

  if (userLogin && datosUser != null){ 
    
        if(datosUser.userData.roles[0] === "ROLE_USER"){
          return(
              <>  
                <Routes>
                  <Route path="/" element={<Navigate to="/User" />}/> 
                </Routes>
              </>
          );
        }  
        if(datosUser.userData.roles[0] === "ROLE_VEDOR"){
          return(
              <>  
                <Routes>
                  <Route path="/" element={<Navigate to="/AdminContenido/Explorar" />}/> 
                </Routes>
              </>
          );
        }      
        if(datosUser.userData.roles[0] === "ROLE_ADMIN"){
          return(
              <>  
                <Routes>
                  <Route path="/" element={<Navigate to="/SuperAdmin/Explorar" />}/> 
                </Routes>
              </>
          );
        }   
  }

  const pressEnter = (e) => {
    if(e.key === 'Enter') { 
      handleSubmitLogin();
     }
  }  



  const handleChange = () => {
    setVisible(!visible);
  };
 




  return (
    <div className='acceso-container'>
      <div className='col-section-slider'>
          <Navbar className='navbar-top'>
              <Navbar.Brand href="#"><img alt='logo' className="logoEditor" src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670859147/EditorPlus/logoEnOff_jj0d3g.svg"/></Navbar.Brand>
          </Navbar>
          <Swiper
           spaceBetween={0}
            slidesPerView={1}
            className="slider-login"
          >
            <SwiperSlide>
              <img alt='22' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1671558787/eleditorNoticias/1080_10802_pvwzme.jpg'/>
            </SwiperSlide>
          </Swiper>

      </div>
    <div className='col-section-login'>
      <div className='box-login'>
         <form>
         
            <input 
            className='input-acceso' 
            type="text" 
            placeholder="Email" 
            autoComplete="user" 
            value={login.nameuser} 
            name="nameuser" 
            onKeyPress={(e) => pressEnter(e)} onChange={handleLogin} 
            />
            
            {/* <input 
            className='input-acceso' 
            type="password" 
            placeholder="Contraseña" 
            autoComplete="new-password"  
            value={login.clave} 
            name="clave" 
            onKeyPress={(e) => pressEnter(e)} 
            onChange={handleLogin} 
            /> */}
            
            <InputGroup style={{outline:'none',border:'0'}} >
            <input 
            className='input-acceso-password' 
            type={visible ? 'text' : 'password'} 
            placeholder="Contraseña" 
            autoComplete="new-password"  
            value={login.clave} 
            name="clave" 
            onKeyPress={(e) => pressEnter(e)} 
            onChange={handleLogin} 
            />
              <InputGroup.Button onClick={handleChange} >
                {visible ? <EyeIcon /> : <EyeSlashIcon />}
              </InputGroup.Button>
            </InputGroup>

            { errorLogin === true ? <p className='errorAcceso'>Revise su usuario y/o contraseña</p>:""}
            <div className='containerOlvidarContrasena'>
            <Link to="/RecordarContrasena" className='tittle-iniciar'>¿Olvidaste tu contraseña?</Link>
            </div>
            <Button className='boton-iniciar-sesion' loading={loadingButton} onClick={handleSubmitLogin}>Iniciar sesión</Button>
          </form>  
          <div className='container-button-crear'>
            <Link to="/registro" className='boton-crear-cuenta'>Crear cuenta</Link> 
          </div>
          <div className='position-derechos'>
              <p className='derechos-de-autor'> EnOff, todos los derechos reservados.</p>  
          </div>
      </div>

    </div>
      {/* <div className='acceso-formulario'>        
            <form>
                <input className='input-acceso' type="text" placeholder="Usuario" value={login.nameuser} name="nameuser" onChange={handleLogin} />
                <input className='input-acceso' type="password" placeholder="Contraseña" value={login.clave} name="clave" onChange={handleLogin} />
                <div className='enviar-formulario-acceso'>
                    <p className='sin-cuenta'>
                    ¿Aún no tienes una cuenta? Registrate <Link to="/registro">aquí</Link>
                    </p>
                    <input type="button" value="Iniciar Sesión" onClick={handleSubmitLogin}/>
                </div>
            </form>                       
            <p className='derechos-de-autor'>
              © Eleditor, todos los derechos reservados.
            </p>            
      </div> */}

    </div>
  )
}

