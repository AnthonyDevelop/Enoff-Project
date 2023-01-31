import React from 'react'
import { Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './footer.css'
import '../Navbar/navbar.css'
import { useMediaQuery } from 'react-responsive'
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
/*iconos*/
import { Icon } from '@rsuite/icons';
import { BsFillBarChartLineFill, BsCameraVideoFill } from 'react-icons/bs';
import { MdHelpOutline, MdOutlineMonetizationOn } from 'react-icons/md';
import { AiOutlineShareAlt, AiFillYoutube } from "react-icons/ai";  


function Footer({ active, setActive }) {

  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  const vistaMobile = useMediaQuery({
    query: '(max-width: 998px)'
  })
  let location = useLocation();
  
  return (
    <>
      {location.pathname === "/" && location.pathname === "https://enoff.com.ar/User/MercadoPago-validacion" && location.pathname === "https://auth.mercadopago.com.ar/authorization?client_id=3552619241756436&response_type=code&platform_id=mp&redirect_uri=https://enoff.com.ar/User/MercadoPago-validacion"? '' && location.pathname === "/registro" :
        <>
          {datosUser != null &&
            (
              <>
                {vistaMobile == true ?
                  <Nav  
                    className=" contenedor-footer justify-content-center"
                    //  activeKey="/home" 
                    fixed="bottom"
                    activeKey={active}
                    onSelect={(selectedKey) => setActive(selectedKey)}
                  >
                    <Nav.Item
                      className='item-footer titulo-footer'
                      // className={({ isActive }) => (isActive ? 'active item-footer titulo-footer' : 'item-footer titulo-footer')}
                      eventKey="/"
                      as={Link} to="/User">
                        <img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-videos-blanco_etlg9o.svg" />
                      Mis Videos
                    </Nav.Item>
                    <Nav.Item
                      className='item-footer titulo-footer'
                      // className={({ isActive }) => (isActive ? 'active item-footer titulo-footer' : 'item-footer titulo-footer')} 
                      eventKey="/Monetizados"  as={Link} to="/user/Monetizados"><img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-monetizados-blanco_qiycjy.svg" />Monetizados</Nav.Item>
                    <Nav.Item
                      className='item-footer titulo-footer'
                      // className={({ isActive }) => (isActive ? 'active item-footer titulo-footer' : 'item-footer titulo-footer')} 
                      eventKey="/Mis-finanzas" as={Link} to="/user/Mis-finanzas">{<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-finanzas-blanco_hu4va6.svg" />}Mis finanzas</Nav.Item>
                    <Nav.Item
                      className='item-footer titulo-footer'
                      // className={({ isActive }) => (isActive ? 'active item-footer titulo-footer' : 'item-footer titulo-footer')} 
                      target="_blank" rel="noreferrer"
                      href='https://www.youtube.com/c/ElEditorPlatense'
                      eventKey="Tutoriales"  as={Link} ><img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-tutoriales-blanco_rcegef.svg" />Tutoriales</Nav.Item>
                  </Nav>
                  :
                  ''
                }
              </>
            )
          }
        </>
      }

    </>
  )
}

export default Footer