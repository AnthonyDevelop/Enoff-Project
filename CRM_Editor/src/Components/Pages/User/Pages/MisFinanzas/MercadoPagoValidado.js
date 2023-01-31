import React, { useEffect, useState, useMemo } from "react";
import { Navigate, Routes, Route, } from "react-router-dom";
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { getRecibirCredenciales } from "../../../../../Actions/AccionCredencialMercadoPago";

import { useDispatch } from "react-redux";

export default function MercadoPagoValidado() {
  const [loading, setLoading] = useState(true);
  const [autentificado, setAutentificado] = useState(null);
  const [cerrarVentana, setCerrarVentana] = useState(false);

  const dispatch = useDispatch();
  const valoresURL = window.location.search;
  const urlParams = new URLSearchParams(valoresURL);
  const [codeEstado, setCodeEstado] = useState(
    {
      code: "",
    }
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setAutentificado(true);

    }, 1500);

    setTimeout(() => {
      setAutentificado(false);
    }, 2500);

    setTimeout(() => {
      setCerrarVentana(true);
      window.close();
    }, 3000);

  }, [])

  useEffect(() => {
    setCodeEstado({ code: urlParams.get('code') });
  }, []);

  useEffect(() => {
    if (codeEstado.code != null && codeEstado.code != "") {
      dispatch(getRecibirCredenciales(codeEstado));

    }

  }, [codeEstado]);


  return (
    <>
      <div className='containerLoading'>
        {loading &&
          <>
            <h1 className='titleLoading' style={{color:'#DA643A !important'}}>Validando datos...</h1>
            <button className='buttonLoading' />
          </>
        }
        {autentificado == true && loading == false &&
          <>
            <h1 className='titleLoading' style={{color:'#DA643A !important'}}>Datos validados correctamente</h1>
            <AiOutlineCheckCircle className="icono-check-verde" color="#DA643A" />
          </>
        }


      </div>
      {/* <MisFinanzas cerrarVentana={cerrarVentana} /> */}
    </>
  )
}
