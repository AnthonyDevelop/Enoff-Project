import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { avanzarVideoPostCompra } from "../../../../../../Actions/Veedor/avanzarVideoPostCompra";
let autoPlayInterval;

const Carousel = (props) => {
  const {
    gap = 0,
    playSpeed = 7000,
    autoPlay = true,
    transitionDuration = 500,
    timingFunction = "ease",
    navButtons = true,
    carouselIndicators = true,
    indicators = "dots",
    setAbrirReproductor={setAbrirReproductor},
  } = props;

  const valores = props.value;
  const cambio = props.cambio;
  let cantVideos = props.cantVideos;
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  useEffect(() => {
    rotateCarousel(activePanel - valores);
  }, [cambio]);



  const pi = 3.14159;
  const panels = props.children || props.panels;
  const theta = (2 * pi) / panels.length;
  const [apothem, setApothem] = useState(findApothem());
  const [activePanel, setActivePanel] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({});
  const [ejecutar, setEjecutar] = useState(false);
  const [cantidadDeVideos, setCantidadDeVideos] = useState(cantVideos);
  const dispatch = useDispatch();
  const respuestaBotones = useSelector(
    (state) => state.reducerActualizarVistaReproductor.data
  );
  
  const respuestaAvanzarVideo = useSelector(
    (state) => state.reducerAvanzarVideoPostCompra.data
  );

  useEffect(() => {
    if (cantidadDeVideos == 0) {
      setAbrirReproductor(false);
    }
  }, [cantidadDeVideos]);

  useEffect(() => {
    if (ejecutar == true) {
      setApothem(findApothem());
      setActivePanel(0);
      setRotation(0);
      setPosition({});
    }
  }, [panels.length]);

  const rotateCarousel = (value) => {
    disableAutoPlay();
    setRotation(rotation + theta * value);
    updateActivePanel(value);
    enableAutoPlay();
    setEjecutar(true);
  };

  const updateActivePanel = useCallback(
    (increment) => {
      setActivePanel(
        (prev) => (prev + panels.length - increment) % panels.length
      );
    },
    [panels.length]
  );

  function avanzar(e) {
    setCantidadDeVideos(cantidadDeVideos - 1);
    rotateCarousel(e);
    const videoActivo = Array.from(
      document.querySelectorAll(".panel.activo .video")
    );
    for (var i = 0; i < videoActivo.length; i++) {
      videoActivo[0].pause();
    }
  }

  useEffect(() => {
    if (respuestaBotones != null) {
      if (
        respuestaBotones.message === "Post descartado correctamente" ||
        respuestaBotones.message === "Post guardado correctamente" ||
        respuestaBotones.message === "Post calificado correctamente" || 
        respuestaBotones.message ==="Post comprado correctamente"
      ) {
        setRotation(rotation + theta * -1);
        updateActivePanel(-1);
        enableAutoPlay();
        setEjecutar(true);
        dispatch(avanzarVideoPostCompra(null));    
      }
    }
  }, [respuestaBotones]);

  useEffect(() => {
    if (respuestaAvanzarVideo != null) {
        setRotation(rotation + theta * -1);
        updateActivePanel(-1);
        enableAutoPlay();
        setEjecutar(true);         
    }
  }, [respuestaAvanzarVideo]);

  

  const enableAutoPlay = useCallback(() => {
    if (!autoPlay) return;
    autoPlayInterval = setInterval(() => {
      setRotation((prevRotation) => prevRotation - theta);
      updateActivePanel(-1);
    }, playSpeed);
  }, [theta, playSpeed, autoPlay, updateActivePanel]);

  const disableAutoPlay = () => clearInterval(autoPlayInterval);

  useEffect(() => {
    enableAutoPlay();
    return () => disableAutoPlay();
  }, [enableAutoPlay]);

  useEffect(() => {
    setPosition((prevPosition) => ({
      ...prevPosition,
      transformOrigin: `50% 50% -${apothem}px`,
      transform: `rotateY(${rotation}rad) translateZ(-${apothem}px)`,
    }));
  }, [rotation, apothem, cambio]);

  useEffect(() => {
    setTimeout(
      () =>
        setPosition((prevPos) => ({
          ...prevPos,
          transition: `transform ${transitionDuration}ms ${timingFunction}`,
        })),
      0
    );
  }, [transitionDuration, timingFunction, cambio]);

  function getIdealWidth() {
    const html = document.querySelector("html");
    const viewPortWidth = parseFloat(window.getComputedStyle(html).width);
    return Math.min(viewPortWidth * 0.85, props.maxWidth);
  }

  function findApothem() {
    return (getIdealWidth() + gap * 2) / (2 * Math.tan(pi / panels.length));
  }

  window.addEventListener("resize", () => {
    setApothem(findApothem());
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      setApothem(findApothem());
    });
  }, [panels.length, cambio]);

  const getPanelStyle = (i) => {
    return {
      transform: `rotateY(${i * theta}rad) translateZ(${apothem}px)`,
      position: i ? "absolute" : "static",
      width: `${getIdealWidth()}px`,
      height: `${getIdealWidth() * (props.maxHeight / props.maxWidth)}px`,
      ...props.panelStyles,
    };
  };

  const indicatorStyle = (i) => {
    switch (indicators) {
      case "dots":
        return {
          backgroundColor: activePanel === i ? "black" : "gray",
        };
      case "numbers":
        return {
          fontWeight: activePanel === i ? "bold" : "",
        };
      default:
        return;
    }
  };

  return (
    <div className="carousel-wrapper">
      <div
        className="carousel-container"
        onMouseOver={disableAutoPlay}
        onMouseLeave={enableAutoPlay}
        style={{
          minHeight: `${
            getIdealWidth() * (props.maxHeight / props.maxWidth)
          }px`,
          perspective: `${1000 + panels.length * 50}px`,
        }}
      >
        <div className="panel-container" style={position}>
          {panels.map((panel, i) => (
            <div
              className={`panel ${activePanel == i ? "activo" : ""}`}
              style={getPanelStyle(i)}
              key={i}
            >
              {React.cloneElement(panel)}
            </div>
          ))}
        </div>
      </div>
      {carouselIndicators &&
        (indicators === "slider" ? (
          <div className="slider-container">
            <div className="slider-indicators__container">
              {panels.map((p, i) => (
                <span key={i} className="slider-indicators"></span>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max={panels.length - 1}
              value={activePanel}
              onChange={(e) => rotateCarousel(activePanel - e.target.value)}
              className={`${indicators} carousel-indicators`}
            ></input>
          </div>
        ) : (
          <div className="carousel-indicators">
            {panels.map((panel, i) => (
              <span
                style={indicatorStyle(i)}
                key={2}
                className={`carousel-indicator ${indicators}`}
                onClick={() => rotateCarousel(-1 * (i - activePanel))}
              >
                {indicators === "numbers" ? i + 1 : null}
              </span>
            ))}
          </div>
        ))}
      {navButtons && (
        <>
          <button
            className="carousel-navigation-izquierda"
            onClick={(e) => rotateCarousel(e.target.value)}
            value={1}
          >{`<<`}</button>
          {cantidadDeVideos >= 1 && (
            <button
              className="carousel-navigation-derecha"
              // onClick={(e) => rotateCarousel(e.target.value)}
              onClick={(e) => avanzar(e.target.value)}
              value={-1}
            >{`>>`}</button>
          )}

          {datosUser.userData.roles[0] === "ROLE_USER" && (
            <button
              className="carousel-navigation-derecha"
              onClick={(e) => rotateCarousel(e.target.value)}
              value={-1}
            >{`>>`}</button>
          )}
        </>
      )}
    </div>
  );
};

export default Carousel;
