import React,{useState,useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import { useSelector, useDispatch } from 'react-redux';
import Carousel from './Carousel';
import VideoEnReproductor from './VideoEnReproductor/VideoEnReproductor'
import VideoEnReproductorMobile from './VideoEnReproductor/VideoEnReproductorMobile';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { EffectFlip, Pagination, Navigation } from "swiper";
import { AiFillCloseCircle } from 'react-icons/ai';
// Import styles
import './reproductorDeVideos.css';
import { useMediaQuery } from 'react-responsive'
import { EffectCreative } from "swiper";

import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();


export default function ReproductorDeVideos(props) {   

    const dataImg = props.imagenCarrousel;
    const posCarrousel=props.posCarrousel;
    const estadoModal=props.estadoModalReproductor; 
    const videoData=props.dataModal; 
    const [show, setShow] = useState(estadoModal!=null); 
    const setAbrirReproductor = props.setAbrirReproductor;
    const [voltearCaja, setVoltearCaja] = useState(null);   
    const handleClose = () => setAbrirReproductor(false);
    const listaVideosReproductor = useSelector(state => state.reducerVideosReproductor);
    const misVideos = props.misVideos;
    

    const [indicatorStyle, setIndicatorStyle] = useState("dots");
    const [showIndicators, setShowIndicators] = useState(true);

    var arregloVideos = [];  
    if (misVideos != null && misVideos.data!=null && misVideos.data.data!=null) {        
      const infoVideo = misVideos.data.data;

      for (var i = 0; i < infoVideo.length; i++) {     
            arregloVideos.push( 
            <VideoEnReproductor show={show} setAbrirReproductor={setAbrirReproductor} pos={i} data={infoVideo[i]} dataImg={dataImg} posCarrousel={posCarrousel}/>)
      }
    }

    useEffect(()=>{
        if(estadoModal != null  ){
          setShow(estadoModal);
        }
        
      },[estadoModal]);

      // const [imageIndex, setImageIndex] = useState(0);

      const vistaMobile = useMediaQuery({
        query: '(max-width: 998px)'
      })

      var arregloVideosMobile = [];  
      if (misVideos != null && misVideos.data!=null) {        
        const infoVideoMobile = misVideos.data.data;
        for (var i = 0; i < infoVideoMobile.length; i++) {     
             arregloVideosMobile.push( 
              <SwiperSlide> 
                <VideoEnReproductorMobile setAbrirReproductor={setAbrirReproductor}  pos={i} data={infoVideoMobile[i]} dataImg={dataImg} posCarrousel={posCarrousel}/>
              </SwiperSlide>
             )
        }
      }
     
  return (
    <>  
    {(show) &&       
    <Modal
     size="xl"
     show={show}
     onHide={handleClose}
     backdrop="static"
     keyboard={false}
     centered
     className='modal-reproductor-videos'
     >
    <Modal.Body className={`${misVideos.data.data.length==1 && misVideos!=null ? "un-solo-video" : ""}`} >
    {/* {vistaMobile == true ?
    <AiFillCloseCircle color='white' fontSize={30} onClick={handleClose} className='cerrar-modal-button-mobile' style={{cursor:'pointer'}}/>
    :
    <AiFillCloseCircle color='#474545' fontSize={30} onClick={handleClose} className='cerrar-modal-button' style={{cursor:'pointer'}}/>
    } */}
    {vistaMobile == true ?
    <>
     <Swiper
        grabCursor={true}
        effect={"creative"}
        initialSlide={posCarrousel}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400]
          },
          next: {
            translate: ["100%", 0, 0]
          }
        }}
        modules={[EffectCreative]}
        className="slider-dos-videos"
      >
         
        {arregloVideosMobile}
      </Swiper>
    </>
    :
    <>
    {misVideos.data.data.length!=2 && misVideos!=null &&
    <div data-aos="zoom-in" data-aos-duration="1500">
      <Carousel   
        panels={[3]} // array of React Elements or React Components, [, elementType]
        autoPlay={false} // Boolean
        maxWidth={800} // PX value of max-width panel, Number
        maxHeight={850} // PX value of max height, Number
        gap={0} // PX space between panels, Number
        navButtons={true} // Presence of carousel navigation, Boolean
        carouselIndicators={false} // Presence of carousel location dots, Boolean
        indicators={indicatorStyle} // style of indicators, String, "dots" "numbers" "sliders"
        playSpeed={7000} // MS duration of autoplay interval, Number
        transitionDuration={500} // MS duration of transition, Number
        timingFunction={'ease'} // CSS Timing function or Cubic-Bezier, String
        panelStyles={null} // Object of JS style declarations, {, property: 'value'}
        value={posCarrousel}
      >
        {arregloVideos}
      </Carousel>   
      </div> 
}
{misVideos.data.data.length==2 && misVideos!=null &&
          <Swiper
          effect={"flip"}
          grabCursor={true}
          centeredSlides={true}
          initialSlide={posCarrousel}
          navigation={true}
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
        }
        </>
    }
    </Modal.Body>
  </Modal>}





    </>
  )
}
