import React from "react";
import "./sobreNosotros.css";
export default function SobreNosotros() {
  return (
    <>
      <div className="containerWhoUs">
        <div className="containerContent">
          <div className="containerTitle">
            <h1 className="titleWhoUs">
            <b style={{color:'#DA643A'}} >#EnOFF</b>, la plataforma pensada para un <b style={{color:'#131838;'}}>periodismo libre</b> e <b style={{color:'#131838;'}}>independiente.</b> 
            </h1>
          </div>
        </div>
        <div className="containerContent">
          <div className="containerH4">
            <h4>
            Donde cada periodista del país tiene un lugar para contar la realidad de su ciudad, donde elegimos *contar y no ser contados*.
            </h4>
          </div>
        </div>
        <div className="askAndResponse">
          <div className="containerAskAndResponse">
            <h2 className="font-verde">¿De qué se trata #EnOFF?</h2>
            <p>
            Sabemos que la llegada de la era digital es EL/UN desafío para la actividad periodística, los grandes medios de comunicación sacan provecho del trabajo realizado por nuestros colegas a cambio de una simple mención sin monetizar el contenido realizado a lo largo y ancho de nuestro país.
            Somos comunicadores, como vos, que buscan reivindicar el contenido periodístico de primera mano y la información verídica, con nosotros es diferente.
            </p>
          </div>
        </div>
        <div className="askAndResponse">
          <div className="containerAskAndResponse">
            <h2 className="font-verde" >¿Qué nos motivó?</h2>
            <p>
            Escuchar nuevas voces, periodismo hecho por periodista que ama la profesión, la velocidad de la primicia, pagar el contenido periodístico de cada colega, dar masividad a la información de diferentes puntos de nuestro país. Al fin y al cabo,  tenemos “ el mejor oficio del mundo”.

            </p>
          </div>
        </div>
      </div>
    </>
  );
}
