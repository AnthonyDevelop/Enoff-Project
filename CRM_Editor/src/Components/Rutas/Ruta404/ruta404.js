import React, { useState, useEffect } from "react";
import Loading from "../../Loading/Loading";
import { Link } from "react-router-dom";
import "./ruta404.css";


import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

export default function Ruta404() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [])



  return (
    <>
      <div className="container-page404"
        data-aos="fade-zoom-in"
        data-aos-easing="ease-in-back"
        data-aos-duration="1000"
        data-aos-offset="0">
        {loading ?
          <div className='loading'>
            <Loading  data-aos="fade-zoom-in"
        data-aos-easing="ease-in-back"
        data-aos-duration="2000"
        data-aos-offset="0"/>
          </div>
          :
          <div className="child-container-page404">
            <div>
              <h1 className="titulo-404">404</h1>
              <p className="text-404">La URL que intenta acceder no existe.</p>
            </div>
            <div className="container-button-404">
              <Link className="button-url" to="/">Ir al home</Link>
            </div>
          </div>}
      </div>
    </>
  );
}
