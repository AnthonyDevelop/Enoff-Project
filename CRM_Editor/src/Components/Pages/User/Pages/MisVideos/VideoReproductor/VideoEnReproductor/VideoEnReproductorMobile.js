import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Rate } from "rsuite";
import { Notification, Popover, Whisper, Button, ButtonToolbar } from "rsuite";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

//React Icons
import { FaPlay } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { BiCommentDetail } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineMonetizationOn } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { AiFillCloseCircle } from 'react-icons/ai';



export default function VideoEnReproductorMobile(props) {
  const [videoUrl, setVideoUrl] = useState();
  const [imageUrl, setImageUrl] = useState();
  const posCarrousel = props.posCarrousel;
  const [activarVideo, setActivarVideo] = useState(false);
  const storage = getStorage();
  const storageImg = getStorage();
  const pos = props.pos;
  const dispatch = useDispatch();
  const setAbrirReproductor = props.setAbrirReproductor;
  const data = props.data;
  // console.log("soy data edu" + data.comentarios)
  const dataImg = props.dataImg;
  const [ocultarPlay, setOcultarPlay] = useState(false);
  // const handleClose = props.handleClose;
  const [activarComentario, setActivarComentario] = useState(true);
  const [mostrarInformacion, setMostrarInformacion] = useState(true);

  console.log("esto es mostrando info" + mostrarInformacion);

  function pauseVideo() {
    setOcultarPlay(!ocultarPlay);
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
    setMostrarInformacion(!mostrarInformacion);
    setActivarComentario(!activarComentario);
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
    <div className="video-en-reproductor-container">
      <div className="col-video-section">
      <AiFillCloseCircle color='#474545' fontSize={30} onClick={()=>{setAbrirReproductor(false)}} className='cerrar-modal-button' style={{cursor:'pointer'}}/>
        <p className="categoria-video">{data.categoria}</p>
        <button
          className={`video-play-icon ${
            ocultarPlay == true ? "playActivo" : ""
          }`}
          onClick={playVideo}
        >
          <FaPlay />
        </button>
        {activarVideo ? (
          <video
            mute
            className="video"
            id="video"
            autoPlay
            onClick={pauseVideo}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img className="video" src={dataImg[pos]} />
        )}

        {mostrarInformacion != true ? (
          ""
        ) : (
          <IoIosArrowUp
            className="box-flecha"
            fontSize={30}
            color="white"
            onClick={() => setMostrarInformacion(!mostrarInformacion)}
          />
        )}

        {mostrarInformacion != true ? (
          <IoIosArrowDown
            className="box-flecha"
            fontSize={30}
            color="white"
            onClick={() => setMostrarInformacion(!mostrarInformacion)}
          />
        ) : (
          ""
        )}

        {mostrarInformacion === false ? (
          <div
            className="box-info-reproductor-mobile"
            style={{ position: "relative !important" }}
          >
            <div className="contenedor-ubicacion-reproductorMobile">
              <HiLocationMarker color="white" fontSize={18} />
              <p className="font-descripcion-reproductor-mobile">
                {data.localidad + " ," + data.provincia}
              </p>
            </div>
            <div className="box-titulo-descripcion-reproductor-mobile">
              <h4 className="font-reproductor-mobile">{data.titulo}</h4>
              <p className="font-descripcion-reproductor-mobile">
                {data.descripcion}
              </p>
            </div>
            <div className="box-calificacion-precio-reproductor-mobile">
              <div className="contenedor-ubicacion-reproductorMobile">
                <p className="font-reproductor-mobile">
                  <AiFillStar color="yellow" />
                  {data.calificacion}/5
                </p>
                <p className="font-reproductor-mobile">
                  <MdOutlineMonetizationOn />
                  {data.precio}
                </p>
              </div>
              <div>
                {
                  data.comentarios[0].contenido === "Sin Comentarios"  ?
                  ''
                  :
                  <Whisper
                  placement="autoVerticalEnd"
                  trigger="click"
                  speaker={
                    <Popover arrow={true} className="popper-comentario-mobile">
                      <div className="contenedor-ubicacion-reproductorMobile">
                        <p className="">Mensaje del Administrador: </p>
                      </div>
                      <div className="contenedor-ubicacion-reproductorMobile">
                        <BiCommentDetail color="#DA643A" fontSize={30} />
                        <p className="font-descripcion-reproductor-mobile-2">
                          "{data.comentarios[0].contenido}
                          "
                        </p>
                      </div>
                    </Popover>
                  }
                >
                  <Button style={{ background: "transparent", padding: "0px" }}>
                    <BiCommentDetail color="white" fontSize={25} />
                  </Button>
                </Whisper>
                }
                {/* <BiCommentDetail color="white" fontSize={25} onClick={() => setActivarComentario(!activarComentario)} /> */}

              </div>
            </div>
            {/* {activarComentario != true ?
                            <Notification type="info" className="contenedor-comentarios-reproductorMobile" rows={3}>
                                <div className="contenedor-ubicacion-reproductorMobile">
                                    <p className="">Mensaje del Administrador: </p>
                                </div>
                                <div className="contenedor-ubicacion-reproductorMobile" >
                                    <BiCommentDetail color="#DA643A" fontSize={30} />
                                    <p className="font-descripcion-reproductor-mobile">"{data.comentarios[0].contenido}"</p>
                                </div>
                            </Notification>
                            :
                            ''
                        } */}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
