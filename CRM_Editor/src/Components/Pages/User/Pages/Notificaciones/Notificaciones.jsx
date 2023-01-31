import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Pagination } from "rsuite";
import { getListaNotificacionesUser } from "../../../../../Actions/listaNotificacionesUser";
import { setEstadoNotificaciones } from "../../../../../Actions/estadoNotificaciones";

import './notificaciones.css'

export default function Notificaciones() {
  const dispatch = useDispatch();

  const listaNotificaciones = useSelector(state => state.reducerListaNotificacionUser.data);

  const respuestaNotificacion = useSelector(state => state.reducerRespuestaNotificaciones.data);
  // console.log(respuestaNotificacion)
  
  
  //NOTIFICACIONES
  const datosUser = useSelector(state => state.reducerUsuarioDatos.data);
  const [pageNotificaciones, setPageNotificaciones] = useState(1);
  
  useEffect(() => {
    const data = {
      page: pageNotificaciones,
      iduser: datosUser.userData.idUser,
    }
    dispatch(getListaNotificacionesUser(data));
  }, [respuestaNotificacion, pageNotificaciones]);

  useEffect(() => {
    dispatch(setEstadoNotificaciones());
  }, []);

  //LISTA NOTIFICACIONES
  if (listaNotificaciones != null) {
    var arrayListaNotificaciones = [];
    const notificaciones = listaNotificaciones.data;

    if (listaNotificaciones.totalRegisters != 0) {
      for (var i = 0; i < notificaciones.length; i++) {
        arrayListaNotificaciones.push(
          <>

            <div className="container-notificaciones">
              {notificaciones[i].estado == "Visto" ?
                <p className="text-contenido-visto">{notificaciones[i].contenido}</p>
                
                :
                <p className="text-contenido">{notificaciones[i].contenido}</p>
              }
              <div className="container-fecha">
                <p className="text-fecha">{notificaciones[i].fecha.substring(0, 10)}</p>
                <p className="text-fecha">{notificaciones[i].fecha.substring(11, 19)}</p>
              </div>
            </div>
            <hr className="linea-color"></hr>
          </>
        );
      }
    } else {
      arrayListaNotificaciones.push(
        <>
          <div className="containerBorderGreen">
            <div className="container-notificaciones">
              <p className="text-contenido-visto">Sin notificaciones</p>
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <>
      <div className="contenedor-filtros-titulo-buscador">
        <div className="containerHeader">
          <h1 className="titulo-explorar">Notificaciones</h1>
        </div>
        <div className="child-container-notificacion">

          <div className="container-border-notificacion">
            {arrayListaNotificaciones}
          </div>

          {listaNotificaciones != null && listaNotificaciones.totalRegisters != 0 ?
            <Pagination className="container-pagination"
              prev
              next
              size="xs"
              total={listaNotificaciones != null ? listaNotificaciones.totalRegisters : ''}
              limit={6}
              activePage={pageNotificaciones}
              onChangePage={setPageNotificaciones}
            />
            :
            ''
          }
        </div>
      </div>
    </>
  );
}
