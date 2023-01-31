import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useSelector, useDispatch } from 'react-redux';
import Carousel from '../../../../User/Pages/MisVideos/VideoReproductor/Carousel';
import VeedorVideoEnReproductor from './VeedorVideoEnReproductor/VeedorVideoEnReproductor';
import { getVeedorRecibirMisVideos } from '../../../../../../Actions/veedorRecibirVideos';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Swiper, SwiperSlide,useSwiper  } from "swiper/react";
import { useLocation } from 'react-router-dom';
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { EffectFlip, Pagination, Navigation } from "swiper";

import AOS from 'aos';
import 'aos/dist/aos.css';
import { avanzarVideoPostCompra } from '../../../../../../Actions/Veedor/avanzarVideoPostCompra';
AOS.init();



export default function VeedorReproductorDeVideo(props) {

    const dataImg = props.imagenCarrousel;
    const setPosCarrousel=props.setPosCarrousel;
    let posCarrousel=props.posCarrousel;
    const estadoModal=props.estadoModalReproductor; 
    const setAbrirReproductor=props.setAbrirReproductor;
    const imagenUserPerfil=props.imagenUserPerfil;
    const videoData=props.dataModal; 
    const [show, setShow] = useState(estadoModal!=null); 
    const [voltearCaja, setVoltearCaja] = useState(null);   
    const handleClose = () => setAbrirReproductor(false);
    const listaVideosReproductor = useSelector(state => state.reducerVideosReproductor);
    const respuestaBotones = useSelector(
      (state) => state.reducerActualizarVistaReproductor.data
    );

    const respuestaAvanzarVideo = useSelector(
      (state) => state.reducerAvanzarVideoPostCompra.data
    );
  
    const misVideos = props.misVideos;
    const dispatch = useDispatch();
  const [indicatorStyle, setIndicatorStyle] = useState("dots");
  const [showIndicators, setShowIndicators] = useState(true);
  const [my_swiper, set_my_swiper] = useState({});

  const swiper = useSwiper();
  
  let location = useLocation();
  const [cambio, setCambio] = useState(false);

    var arregloVideos = [];  
    if (misVideos != null && misVideos.data != null ) {        
      const infoVideo = misVideos.data.data;
      for (var i = 0; i < infoVideo.length; i++) {     
            arregloVideos.push( 
            <VeedorVideoEnReproductor  show={show} setAbrirReproductor={setAbrirReproductor}  imagenUserPerfil={imagenUserPerfil}  pos={i} data={infoVideo[i]} dataImg={dataImg} posCarrousel={posCarrousel} setPosCarrousel={setPosCarrousel}/>)
      }
    }


/*Respuesta de compra*/
useEffect(() => {   
  if ( posCarrousel!=null && respuestaBotones != null && misVideos.data.data.length==2) {
    if(respuestaBotones.message === "Post descartado correctamente" ||  respuestaBotones.message === "Post guardado correctamente" || respuestaBotones.message === "Post calificado correctamente" || respuestaBotones.message ==="Post comprado correctamente"){
      my_swiper.slideNext()
    }
 }
}, [respuestaBotones]);

/*Respuesta de compra*/
useEffect(() => {   
  if ( posCarrousel!=null && respuestaAvanzarVideo != null && misVideos.data.data.length==2) {
      my_swiper.slideNext();
      dispatch(avanzarVideoPostCompra(null));    
 }
}, [respuestaAvanzarVideo]);



    useEffect(()=>{
      if (misVideos != null && misVideos.data != null ) {     
        setCambio(!cambio);
      }
      
    },[misVideos]);


    


  useEffect(() => {
    if (estadoModal != null) {
      setShow(estadoModal);
    }

  }, [estadoModal]);

  // const [imageIndex, setImageIndex] = useState(0);

  return (
    <>
      {(show) && misVideos != null &&
        <Modal
          size="xl"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
          className='modal-reproductor-videos'
        >

          <Modal.Body className={`${misVideos.data.data.length == 1 ? "un-solo-video" : ""}`} >
            {misVideos.data.data.length != 2 &&
              <div data-aos="zoom-in" data-aos-duration="1500">
                <Carousel
                  panels={misVideos.data.data} // array of React Elements or React Components, [, elementType]
                  autoPlay={false} // Boolean
                  maxWidth={800} // PX value of max-width panel, Number
                  maxHeight={850} // PX value of max height, Number
                  gap={0} // PX space between panels, Number
                  
                  navButtons={ location.pathname != "/AdminContenido/Explorar" && misVideos.data.data.length !==1 ? true :  false} // Presence of carousel navigation, Boolean
          
                  carouselIndicators={false} // Presence of carousel location dots, Boolean
                  indicators={indicatorStyle} // style of indicators, String, "dots" "numbers" "sliders"
                  playSpeed={7000} // MS duration of autoplay interval, Number
                  transitionDuration={500} // MS duration of transition, Number
                  timingFunction={'ease'} // CSS Timing function or Cubic-Bezier, String
                  panelStyles={null} // Object of JS style declarations, {, property: 'value'}
                  value={posCarrousel}
                  cambio={cambio}
                  cantVideos={misVideos.data.data.length}
                  setAbrirReproductor={setAbrirReproductor} 
                >
                  {arregloVideos}
                </Carousel>
              </div>
            }
            {misVideos.data.data.length == 2 &&
            <div data-aos="zoom-in" data-aos-duration="1500">
              <Swiper
                  onInit={(ev) => {
                    set_my_swiper(ev)
                }}
                effect={"flip"}
                allowTouchMove={ location.pathname != "/AdminContenido/Explorar" ? true : false}
                grabCursor={true}
                centeredSlides={true}
                initialSlide={posCarrousel}
                navigation={location.pathname != "/AdminContenido/Explorar" ? true : false}
                modules={[EffectFlip, Pagination, Navigation]}
                className="slider-dos-videos"
              >
                <SwiperSlide >
                  {arregloVideos[0]}
                </SwiperSlide>
                <SwiperSlide >
                  {arregloVideos[1]}
                </SwiperSlide>
              </Swiper>
              </div>
            }
          </Modal.Body>
        </Modal>}
    </>
  )
}
