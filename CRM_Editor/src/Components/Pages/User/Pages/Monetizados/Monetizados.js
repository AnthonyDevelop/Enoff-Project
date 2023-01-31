import React, { useState, useEffect } from "react";
import { Rate, Pagination, Button } from "rsuite";
import { Link } from "react-router-dom";
import "./monetizado.css";
import { MdOutlineMonetizationOn } from 'react-icons/md';
import { AiFillStar } from 'react-icons/ai';
import Card from "react-bootstrap/Card";
import { useMediaQuery } from 'react-responsive'
//Acciones
import { getRecibirMisVideos } from "../../../../../Actions/MostrarVideos";

//UseSelector
import { useSelector, useDispatch } from "react-redux";

export default function Monetizados(props) {
  const videosGuardadosComprados = props.videosGuardadosComprados
  const [misVideosComprados, setMisVideosComprados] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [filtrosActivados, setFiltrosActivados] = useState(false);

  const videosComprados = useSelector((state) => state.reducerVideosComprados);
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);

  //Enviar datos de usuario logeado
  const dispatch = useDispatch();

  useEffect(() => {
    if (videosComprados != null && videosComprados.data != null)
      setMisVideosComprados(videosComprados.data.data);
  }, [videosComprados]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempUser = misVideosComprados.map((videoComprado) => {
        return { ...videoComprado, isChecked: checked };
      });
      setMisVideosComprados(tempUser);
    } else {
      let tempUser = misVideosComprados.map((videoComprado) =>
        String(videoComprado.idPublicacion) === name ? { ...videoComprado, isChecked: checked } : videoComprado
      );
      setMisVideosComprados(tempUser);
    }
  };

  //Paginacion useEffect
  useEffect(() => {
    if (datosUser != null) {
      const dataMonetizados = {
        idCategoria: "",
        page: activePage,
        fechaInicio: "",
        fechaFin: "",
        calificacion: "",
        estado: 1,
        urgente: "",
        userId: datosUser.userData.idUser,
      };
      if (filtrosActivados === true) {
        dispatch(getRecibirMisVideos(dataMonetizados));
        setFiltrosActivados(false);
      }
    }
  }, [filtrosActivados]);

  const vistaMobile = useMediaQuery({
    query: '(max-width: 998px)'
  })



  return (
    <div className="adquirido-principal">
      <div className="contenedor-buscador-adquirido">
        {/* <div className="box-buscador-explorar ">
          <h1 className="titulo-monetizados">Videos Monetizados</h1>
        </div> */}
        <div className="paginacion-monetizados">
          <h1 className="titulo-monetizados">Videos Monetizados</h1>
          {videosComprados.data != null && videosComprados != null && videosComprados.data.maxPages != null ?
           ''
            : 
            <Pagination
            prev
            next
            size="xs"
            // total={videosComprados.data.maxPages}
            limit={1}
            activePage={activePage}
            onChange={setActivePage}
            onChangePage={(e) => {
              setActivePage(e)
              setFiltrosActivados(true)
            }
            }
          />
          }
        </div>
      </div>
      <div className="contenedor-vistas-aquirido-user">
        {misVideosComprados != null ?
          <>
            {misVideosComprados.map((videoComprado, index) => (

                <div key={index} className="contenedor-card-adquirido-user">
                  <Card 
                  style={{ 
                    width: '100%', 
                  height: '180px', 
                  display: 'flex', 
                  flexDirection: 'row',
                  border:'2px solid #DA643A',
                  borderRadius:'10px'}}
                  className='card-adquirido'
                  // onClick={() => handleOpenReproductor(index)}
                  >
                    <Card.Img 
                    variant="top" 
                    style={{ width: '200px',borderRadius: '10px',objectFit:'cover' }} 
                    className="contenedor-foto-card"
                    src={videosGuardadosComprados[index]} />
                    <Card.Body 
                    style={{ 
                      width: '80%', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      alignItems: 'center' }}>
                      <div className="box-info-card">
                        <Card.Title className="card-title-adquirido">{videoComprado.titulo}</Card.Title>
                        <Card.Text className="parrafo-card-adquirido" >
                        {videoComprado.descripcion}
                        </Card.Text>
                      </div>
                      <div className="box-precio-estrellas-card">
                      {vistaMobile == true ?
                        <div className="box-precio-estrellas-card">
                          <p><AiFillStar color="yellow" />{videoComprado.calificacion}/5</p>
                          <p className="font-verde"><MdOutlineMonetizationOn />{videoComprado.precio}</p>
                        </div>
                        :
                        <div className="box-precio-estrellas-card">
                          <Rate
                           style={{color:':#FBD300!important'}}
                            className="rate-adquirido"
                            readOnly
                            defaultValue={videoComprado.calificacion}
                            size="m"
                          />
                          <p className="font-verde"><MdOutlineMonetizationOn />{videoComprado.precio}</p>
                        </div>
                      }
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              
            ))}

          </>
          :
          <div className="contenedor-sin-monetizados">
            <div>
              <p className="titulo-sin-monetizar">Por ahora, no tenés ningún video monetizado.
                Empezá a subir contenido para que los administradores puedan calificarlo.</p>
            </div>
            <div >
              <Link className="button-sin-videos" to='/user'>Cargar video</Link>
            </div>
          </div>
        }
      </div>
    </div>
  );
}