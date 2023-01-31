import React, { useEffect, useState } from "react";
import "./misFinanzas.css";
import { useSelector, useDispatch } from "react-redux";
import { setEliminarCredencialMP } from "../../../../../Actions/AccionCredencialMercadoPago";
import { getDatosUsuario } from "../../../../../Actions/datosUsuario";
import { getDatosMercadoPago } from "../../../../../Actions/datosMercadoPago";

export default function MisFinanzas(props) {

  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  const dataVinculado = useSelector((state) => state.reducerCredencialMercadoPago.data);
  const datosMercadoPago = useSelector((state) => state.reducerMostrarDatosMercadoPago.data);

  const [ruta, setRuta] = useState();
  const notificacion= props.notificacion;
  const [dataMercadoPago, setDataMercadoPago] = useState([]);

  const dispatch = useDispatch();

  function CerrarSesionMercadoPago() {
    dispatch(setEliminarCredencialMP());
  }

  useEffect(() => {
    dispatch(getDatosMercadoPago());
  }, [dataVinculado, notificacion]);

  useEffect(() => {
    dispatch(getDatosUsuario());
  }, [dataVinculado, notificacion]);

  useEffect(() => { 
    if(datosMercadoPago!=null && datosMercadoPago.message==="Informacion de cuenta de Mercado Pago" && ruta!=null)
      setRuta(
        window.open(
          "https://auth.mercadopago.com.ar/authorization?client_id=3552619241756436&response_type=code&platform_id=mp&redirect_uri=https://enoff.com.ar/User/MercadoPago-validacion",
          "mercadopago",
          `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,  width=600, height=550`
        )
      );    
  }, [datosMercadoPago,ruta]);
  
  useEffect(() => {
    if(notificacion === 'Su cuenta de Mercado Pago se ha vinculado correctamente') {
      ruta.close();
    }
  }, [notificacion]);

  function popupWindow(url, windowName, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
    const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;
    return win.open(
      url,
      windowName,
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
    );
  }
  return (
    <>
      <div className="containerFinanzas">
        <div className="contenedor-buscador-adquirido-monetizados">
          <h1>Mis finanzas</h1>
        </div>

        <div className="containerBorder">
          <div className="containerBilleteraVirtual">
            {datosUser != null &&
              datosUser.userData.credenciales === "Desvinculado" ? (
              <>
                <h2>Billetera Desvinculada</h2>
                <p>
                  Para empezar a monetizar tu contenido, tenés que vincular una
                  billetera
                </p>
                <button
                  href="#"
                  // style={{ backgroundColor: "#DA643A" }}
                  onClick={() =>
                    popupWindow(
                      "https://auth.mercadopago.com.ar/authorization?client_id=3552619241756436&response_type=code&platform_id=mp&redirect_uri=https://enoff.com.ar/User/MercadoPago-validacion",
                      "mercadopago",
                      window,
                      600,
                      550
                    )
                  }
                >
                  Enlazar cuenta
                </button>
              </>
            ) : (
              <>
                <h2>Billetera vinculada</h2>

                {/* DATOS MP */}
                {datosMercadoPago != null && datosMercadoPago.data != null &&
                  <div className="box-info-mercado-pago">
                    <div className="info-mercado-pago">Nombre : <h5 className="mercado-pago-text">{datosMercadoPago.data.nombre_completo_mp}</h5></div>
                    <div className="info-mercado-pago">Email :  <h5 className="mercado-pago-text">{datosMercadoPago.data.email_mp}</h5></div>
                    <div className="info-mercado-pago">DNI : <h5 className="mercado-pago-text">{datosMercadoPago.data.number_document_mp}</h5></div>
                    <div className="info-mercado-pago">Telefono : <h5 className="mercado-pago-text">{datosMercadoPago.data.phone_mp}</h5></div>
                  </div>
                }

                <button
                  style={{ backgroundColor: "#131838" }}
                  href=""
                  onClick={CerrarSesionMercadoPago}
                >
                  Desvincular Cuenta
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
