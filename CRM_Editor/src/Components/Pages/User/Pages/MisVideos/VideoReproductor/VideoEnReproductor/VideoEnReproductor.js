import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Rate, Input } from "rsuite";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

//React Icons
import { HiLocationMarker } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { AiFillCloseCircle } from 'react-icons/ai';



export default function VideoEnReproductor(props) {
  const [videoUrl, setVideoUrl] = useState();
  const [imageUrl, setImageUrl] = useState();
  const posCarrousel = props.posCarrousel;
  const [activarVideo, setActivarVideo] = useState(false);
  const storage = getStorage();
  const storageImg = getStorage();
  const pos = props.pos;
  const dispatch = useDispatch();
  const data = props.data;
  const dataImg = props.dataImg;
  const setAbrirReproductor = props.setAbrirReproductor;
  const [ocultarPlay, setOcultarPlay] = useState(false);
  // const handleClose = props.handleClose;





  function pauseVideo() {
    setOcultarPlay(!ocultarPlay);
    const videoActivo = Array.from(
      document.querySelectorAll(".panel.activo .video")
    );
    for (var i = 0; i < videoActivo.length; i++) {
      if (videoActivo[0].paused == true) {
        videoActivo[0].play();
      } else {
        videoActivo[0].pause();
      }
    }

    const videoActivoSwipper = Array.from(
      document.querySelectorAll(".swiper-slide-active .video")
    );
    for (var i = 0; i < videoActivoSwipper.length; i++) {
      if (videoActivoSwipper[0].paused == true) {
        videoActivoSwipper[0].play();
      } else {
        videoActivoSwipper[0].pause();
      }
    }
  }



  function playVideo() {
    setOcultarPlay(!ocultarPlay);
    let gsReference = ref(
      storage,
      "gs://sistemas-delsud.appspot.com/" + data.path + "video-noticia.mp4"
    );
    getDownloadURL(gsReference).then((url) => {
      setVideoUrl(url);
      setActivarVideo(true);
    });



  }



  var arregloFecha = data.fecha.date.split(" ");
  var hora = new Date(data.fecha.date);
  var horaPublicacion = hora.getHours() + " : " + hora.getMinutes();



  return (
    <div className="video-en-reproductor-container" >
      <div className="col-video-section">
        <button
          className={`video-play-icon ${ocultarPlay == true ? "playActivo" : ""
            }`}
          onClick={playVideo}
        >
          <FaPlay />
        </button>
        {activarVideo ? (
          <video mute disablePictureInPicture controlslist="nodownload noplaybackrate" className="video" id="video" autoPlay onClick={pauseVideo}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img className="video" src={dataImg[pos]} />
        )}
      </div>
      <div className="col-description-video-section">
        <AiFillCloseCircle color='#474545' fontSize={30} onClick={() => { setAbrirReproductor(false) }} className='cerrar-modal-button' style={{ cursor: 'pointer' }} />
        <p className="categoria-video">
          {data.categoria}
        </p>
        <div className="location-video-description-section">
          <div className="contenedor-ubicacion-reproductor">
            <div className="localidad">
              <HiLocationMarker className="icon-cerrar-modal" color="#DA643A" fontSize={25} />
              <p className="ubicacion-font">{data.localidad + ", " + data.provincia}</p>
            </div>
            <h4 className="video-en-reproductor-titulo">{data.titulo}</h4>
            <p className="video-en-reproductor-descripcion">{data.descripcion}</p>
          </div>
          <div className="box-comentario-user">
            <div className="box-titulos-reproductor">
              <p className="subtitulo-calificacion">Calificación</p>
              <Rate
                className="rate-adquirido"
                readOnly
                allowHalf
                defaultValue={data.calificacion}
                size="xs"
                style={{
                  display: 'flex', flexDirection: 'row'
                  , justifyContente: 'center', columnGap: '20px',
                  color: '#DDE100!important'
                }}
              />
            </div>
            {data.comentarios === "Sin Comentarios" ?
              ''
              :
              <div className="box-titulos-reproductor">
                <p style={{ color: 'black' }}>Te dejamos este comentario:</p>
                <div className="contenedor-comentarios-reproductor">
                  <p className="texto-comentario">"{data.comentarios}"</p>
                </div>
              </div>
            }

          </div>
          <div>
            <p style={{ textAlign: 'center' }} className="valor-video-font">Valor del video - ARS ${data.precio}</p>
          </div>
          <div className="video-date-section">
            <p>{arregloFecha[0]}</p>
            <p>{horaPublicacion}hs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
