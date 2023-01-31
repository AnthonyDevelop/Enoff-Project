import React,{useState,useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import {Carousel} from '3d-react-carousal';
import { useSelector, useDispatch } from 'react-redux';
import './videoReproductor.css'
import VideoEnReproductor from './VideoEnReproductor/VideoEnReproductor'
import Slider from "react-slick";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import 'swiper/css';
import "swiper/css/effect-cards";
// import required modules
import { EffectCards } from "swiper";

import { FaArrowRight, FaArrowLeft } from "react-icons/fa";




// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ReproductorDeVideos(props) {   
     var arregloVideos = [];   
    const estadoModal=props.estadoModal; 
    const [show, setShow] = useState(estadoModal!=null);  
    const handleClose = () => setShow(false);

    const listaVideosReproductor = useSelector(state => state.reducerVideosReproductor);
    //const images = ["https://res.cloudinary.com/grupo-delsud/image/upload/v1648061717/EUGENIE/galeria/galeria-7-min_ohdph3.jpg", "https://res.cloudinary.com/grupo-delsud/image/upload/v1648061717/EUGENIE/galeria/galeria-7-min_ohdph3.jpg", "https://res.cloudinary.com/grupo-delsud/image/upload/v1648061717/EUGENIE/galeria/galeria-7-min_ohdph3.jpg", "https://res.cloudinary.com/grupo-delsud/image/upload/v1648061717/EUGENIE/galeria/galeria-7-min_ohdph3.jpg"];

    if (listaVideosReproductor != null) {        
      const infoVideo = listaVideosReproductor.data;
      for (var i = 0; i < infoVideo.length; i++) {                 
            arregloVideos.push( <VideoEnReproductor data={infoVideo[i]}/>)
      }

      }

    useEffect(()=>{
        if(estadoModal != null  ){
          setShow(estadoModal);
        }
        
      },[estadoModal]);

      /*Slider*/

      const NextArrow = ({ onClick }) => {
        return (
          <div className="arrow next" onClick={onClick}>
            <FaArrowRight />
          </div>
        );
      };
    
      const PrevArrow = ({ onClick }) => {
        return (
          <div className="arrow prev" onClick={onClick}>
            <FaArrowLeft />
          </div>
        );
      };
    
      const [imageIndex, setImageIndex] = useState(0);
    
      var settings = {
        centerMode: true,
        infinite: true,
        dots: false,
        speed: 300,
        slidesToShow: 3,
        centerPadding: "0",
        swipeToSlide: true,
        nextArrow: <NextArrow onClick />,
        prevArrow: <PrevArrow onClick />,
        beforeChange: (current, next) => setImageIndex(next),       
      };



  return (
    <>  
    {(show) &&       
    <Modal
     size="xl"
     show={show}
     onHide={handleClose}
     backdrop="true"
     centered
     className='modal-reproductor-videos'
     >
    <Modal.Body>

        <div className='reproductor-videos-container'>
            {/* <Carousel arrows={true} slides={arregloVideos} interval={1000} preventScrollOnSwipe={true} trackTouch={true}/>  */}
          {/* <Slider {...settings}>               
                      {arregloVideos}          
            
            </Slider>  */}
        <Slider {...settings}>
        {arregloVideos.map((img, idx) => (
          <div className={idx === imageIndex ? "slide activeSlide" : "slide"}>
            {img}
          </div>
        ))}
      </Slider> 
           {/* <Swiper
          slideShadows={true}
          slidesPerView={1}
          spaceBetween={80}
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            cardsEffect={{
              rotate:false, 
              slideShadows:true,   
              prev: {
                // will set `translateZ(-400px)` on previous slides
                translate: [0, 0, -400],
              },
              next: {
                // will set `translateX(100%)` on next slides
                translate: ['100%', 0, 0],
              },    
            }}
            className="Slider-videos-reproductor"           

          >
            {arregloVideos}
          </Swiper>  */}
              {/* <Slider {...settings}>
                  {arregloVideos}
              </Slider> */}
        </div>
    </Modal.Body>
  </Modal>}


    </>
  )
}
