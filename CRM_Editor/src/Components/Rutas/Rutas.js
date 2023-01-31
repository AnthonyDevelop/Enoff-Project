import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";

import User from "../Pages/User/User";
import Registro from "../Pages/Registro/Registro";
import MercadoPagoApi from "../Pages/MercadoPago/MercadoPagoApi";
import RecordarContrasena from "../Pages/IniciarSesion/RecordarContraseña/RecordarContrasena";
import CodigoSeguridad from "../Pages/Registro/RegistroExitoso/CodigoSeguridad/CodigoSeguridad";
import AdminContenido from "../Pages/AdminContenido/AdminContenido";
import SuperAdmin from "../Pages/SuperAdmin/SuperAdmin";
import Acceso from "../Pages/IniciarSesion/Acceso/Acceso";
import Ruta404 from "./Ruta404/ruta404";
import MercadoPagoCredencial from "../Pages/MercadoPago/MercadoPagoCredencial";

import { useSelector, useDispatch } from "react-redux";
import { getDatosUsuario } from "../../Actions/datosUsuario";
import IngresarContraseñaNueva from "../Pages/IniciarSesion/RecordarContraseña/IngresarContraseñaNueva";



export default function Rutas() {
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDatosUsuario());
  }, []);

  return (
    <>
      <BrowserRouter>

        {/* <Navbar />  */}

        <Routes>
          <Route path="/" element={<Acceso />} />
          <Route path="/User/*" element={<User />} />
          
          {datosUser != null && datosUser.userData.roles[0] === "ROLE_VEDOR" ?
            <>
              <Route path="/AdminContenido/*" element={<AdminContenido />} />
            </> : ''
          }
          {datosUser != null && datosUser.userData.roles[0] === "ROLE_ADMIN" ?
            <>
              <Route path="/SuperAdmin/*" element={<SuperAdmin />} />
            </> : ''
          }
          <Route path="/registro" element={<Registro />} />
          <Route path="/RecordarContrasena" element={<RecordarContrasena />} />
          <Route path="/NuevaContrasena" element={<IngresarContraseñaNueva />} />
          
          <Route path="/CodigoSeguridad" element={<CodigoSeguridad />} />
          {/* <Route path="/mercadopagoapi" element={<MercadoPagoApi />} />
          <Route path="/mercadopagocode" element={<MercadoPagoCredencial />} /> */}

          <Route path="*" element={<Ruta404 />} />

        </Routes>
        {datosUser != null ?
          <Footer /> : ''
        }
      </BrowserRouter>
    </>
  );
}
