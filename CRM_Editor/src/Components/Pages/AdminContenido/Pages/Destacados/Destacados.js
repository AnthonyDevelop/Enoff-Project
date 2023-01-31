import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Input, InputGroup } from "rsuite";
import { Pagination, SelectPicker } from "rsuite";
import { DateRange } from "react-date-range";
import moment from "moment";
// import esLocale from "react-date-range/dist/locale/es";
import * as locales from "react-date-range/dist/locale";
import VeedorReproductorDeVideo from "../Explorar/VeedorReproductorDeVideo/VeedorReproductorDeVideo";
import { Rate } from "rsuite";
import Select from "react-select";
import { useMediaQuery } from "react-responsive";
import SearchIcon from "@rsuite/icons/Search";

import ModalEliminarVideo from "../../../User/Pages/MisVideos/ModalEliminarVideo/ModalEliminarVideo";
import { getVeedorRecibirVideosDestacados } from "../../../../../Actions/veedorRecibirVideos";
import { setReproductorVideoActualizarVista } from "../../../../../Actions/Veedor/actualizarVistaReproductorVideos";

// //Firebase
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
//   listAll,
// } from "firebase/storage";

//UseSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";

//React Icons
// import { AiFillPlusCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { GoCalendar } from "react-icons/go";
import { TiDelete } from "react-icons/ti";

// import { MdOutlineModeEdit } from "react-icons/md";

//Calendario styless
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// import { Link } from "react-router-dom";

export default function Destacados(props) {
  //traer datos usuario
  const dispatch = useDispatch();
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  const videoEstadoRespuesta = useSelector(
    (state) => state.reducerActualizarVistaReproductor.data
  );

  const locale = {
    noResultsText: "No existen resultados",
    placeholder: "",
    searchPlaceholder: "Buscar",
    checkAll: "",
  };

  const videosGuardados = props.videosGuardadosDestacados;
  const misVideos = props.misVideosDestacados;

  const [videoEliminado, setVideoEliminado] = useState(false);
  const [abrirReproductor, setAbrirReproductor] = useState(null);
  const [posCarrousel, setPosCarrousel] = useState();
  const [abrirModalSubirVideo, setAbrirModalSubirVideo] = useState(null);
  const [calendario, setCalendario] = useState(false);
  const [open, setOpen] = useState(false);
  const [filtrosActivados, setFiltrosActivados] = useState(false);
  const [data, setData] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [checked, setChecked] = useState([]);

  //CALENDARIO
  const now = useRef(new Date());
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");



  //Preguntar si ya borro el video
  useEffect(() => {
    if (videoEstadoRespuesta != null) {
      if (
        videoEstadoRespuesta.message === "Post descartado correctamente" ||
        videoEstadoRespuesta.message === "Post guardado correctamente" ||
        videoEstadoRespuesta.message === "Post calificado correctamente" || 
        videoEstadoRespuesta.message ==="Post comprado correctamente"
      ) {
        setFiltroCategoria("");
        setFiltroLocalidad("");
        setFiltroProvincia("");
        setFiltroCalificacion("");
        setVideoEliminado(true);
        dispatch(setReproductorVideoActualizarVista(false));
      }
    }
  }, [videoEstadoRespuesta]);

  /*SETEAR ESTADOS POR DEFECTO*/  
  useEffect(() => {
    if (misVideos.data != null) {  
      setBuscador(misVideos.data.titulo)
      if(misVideos.data.categorias!=null &&  misVideos.data.categorias.length == 1 ){
        setFiltroCategoria(misVideos.data.categorias[0].id)
      }
      if(misVideos.data.calificaciones!=null &&  misVideos.data.calificaciones.length == 1){
        setFiltroCalificacion(misVideos.data.calificaciones[0].calificacion)
      }
      else{         
        setFiltroCategoria("");
        setFiltroCalificacion("");
      }     
    }
}, []);

  const ranges = useMemo(() => {
    return [
      {
        startDate: from,
        endDate: to,
        key: "selection",
      },
    ];
  }, [from, to]);

  const handleSelect = useCallback(({ selection: { startDate, endDate } }) => {
    setFrom(startDate);
    setTo(endDate);
    setFiltrosActivados(true);
  });

  //FIN CALENDARIO

  const handleSubirVideo = () => {
    if (abrirModalSubirVideo == true) {
      setAbrirModalSubirVideo(false);
    } else {
      setAbrirModalSubirVideo(!abrirModalSubirVideo);
    }
  };

  const handleOpenReproductor = (idx) => {
    setPosCarrousel(idx);
    if (abrirReproductor == true) {
      setAbrirReproductor(false);
    } else {
      setAbrirReproductor(!abrirReproductor);
    }
  };

  useEffect(
    (idx) => {
      if (abrirModalSubirVideo == false) {
        setAbrirModalSubirVideo(!abrirModalSubirVideo);
      }
      // if (abrirReproductor == false) {
      //   setAbrirReproductor(!abrirReproductor);
      // }
    },
    [abrirModalSubirVideo,
      //  abrirReproductor
      ]
  );

  //Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroProvincia, setFiltroProvincia] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [filtroCalificacion, setFiltroCalificacion] = useState("");
  const [filtroEstadoUrgente, setFiltroEstadoUrgente] = useState(false);
  const [buscador, setBuscador] = useState("");

  useEffect(() => {
    if (datosUser != null) {
      let fechaFormateadaInicio = "";
      let fechaFormateadaFin = "";
      if (from != "" && to != "") {
        fechaFormateadaInicio = moment(from).format("YYYY-MM-DD");
        fechaFormateadaFin = moment(to).format("YYYY-MM-DD");
      }

      const dataVideo = {
        titulo: buscador,
        idCategoria: filtroCategoria,
        localidad: filtroLocalidad,
        provincia: filtroProvincia,
        page: activePage,
        fechaInicio: fechaFormateadaInicio,
        fechaFin: fechaFormateadaFin,
        calificacion: filtroCalificacion,
        idestado: 6,
        urgente: filtroEstadoUrgente,
        iduser: "",
      };
      if (filtrosActivados === true || videoEliminado == true) {
        dispatch(getVeedorRecibirVideosDestacados(dataVideo));
        setFiltrosActivados(false);
      }
    }
  }, [filtrosActivados, videoEliminado]);

  if (misVideos.data != null) {
    var categorias = [];
    const lc = misVideos.data.categorias;
    for (var i = 0; i < lc.length; i++) {
      categorias.push({
        value: lc[i].id,
        label: lc[i].nombre,
      });
    }
  }

  /*Calificacion*/
  if (misVideos.data != null) {
    var calificaciones = [];
    const ca = misVideos.data.calificaciones;
    for (var i = 0; i < ca.length; i++) {
      calificaciones.push({
        value: ca[i].calificacion,
              label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={ca[i].calificacion}
            size="xs"
          />
        </div>),
     
      });
    }
  }

  const handleChangeCalificacion = (e) => {
    setFiltroCalificacion(e);
    setFiltrosActivados(true);
  };

  const handleChangeCategoria = (e) => {
    setFiltroCategoria(e);
    setFiltrosActivados(true);
  };

  function activarCalendario() {
    setCalendario(!calendario);
  }

  const buscarPorTitulo = (e) => {
    setBuscador(e.target.value);
    setFiltrosActivados(true);
  };

  const vistaMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  // Return classes based on whether item is checked
  var isChecked = (item) => (checked.includes(item) ? "activar" : "");

  function abrirModalEliminar() {
    if (checked.length > 0) {
      setOpen(true);
    }
  }

  return (
    <>
      <div className="mis-videos-sin-videos">
        {categorias != null && misVideos.data != null && misVideos != null && (
          <>
            <div className="contenedor-filtros-titulo-buscador">
              <h1 className="titulo-explorar">Destacados</h1>

              <div className="box-input-buscador">
                <InputGroup>
                  <Input
                    value={buscador}
                    onChange={(value, e) => buscarPorTitulo(e)}
                    className="input-buscador-explorer"
                    placeholder="Buscar video por título"
                  />
                  <InputGroup.Addon className="background-buscador">
                    <SearchIcon color="white" fontSize="25px" />
                  </InputGroup.Addon>
                </InputGroup>
              </div>
              <div className="mis-videos-filtros-admin">
                <MdDelete
                color='#131838'
                  // className="filtro-icono"
                  className={`${
                    checked.length > 0 ? "filtro-icono activar" : "filtro-icono"
                  }`}
                  onClick={abrirModalEliminar}
                />
                {calendario === true ? (
                  <button
                    className="button-cerrar-calendario"
                    onClick={activarCalendario}
                  >
                    <TiDelete fontSize={30} color="#DA643A" />
                  </button>
                ) : (
                  <button
                  className="filtro-icono-calendario"
                    onClick={activarCalendario}
                    style={{ cursor: "pointer" }}
                    placement="bottomStart"
                  />
                )}
              <SelectPicker
                locale={locale}                
                value={filtroCategoria}
                onChange={(value, e) => handleChangeCategoria(value)}
                onClean={(value, e) => handleChangeCategoria("")}
                placeholder={"Seleccione una categoría"}
                className="periodistas-select"
                data={categorias}
                style={{ width: 224 }}
              />
              <SelectPicker
                searchable={false}
                locale={locale}
                value={filtroCalificacion}
                onChange={(value, e) => handleChangeCalificacion(value)}
                onClean={(value, e) => handleChangeCalificacion("")}
                placeholder={"Calificación"}
                className="periodistas-select"
                data={calificaciones}
                style={{ width: 224 }}
              />
                <div className="checkbox-urgente">
                  <input
                    type="checkbox"
                    id="urgente"
                    value="urgente"
                    onChange={() => {
                      setFiltrosActivados(true);
                      setFiltroEstadoUrgente(!filtroEstadoUrgente);
                    }}
                  />
                  <label className="urgente-text">URGENTE</label>
                </div>
                <Pagination
                  prev
                  next
                  size="xs"
                  total={misVideos.data.maxPages}
                  limit={1}
                  activePage={activePage}
                  onChangePage={(e) => {
                    setActivePage(e);
                    setFiltrosActivados(true);
                  }}
                />

                {calendario && (
                  <div className="calendario-container">
                    <DateRange
                      maxDate={new Date()}
                      minDate={new Date("01-11-2022")}
                      locale={locales["es"]}
                      dateDisplayFormat={"yyyy-MM-dd"}
                      className="calendario-filtro"
                      editableDateInputs={true}
                      onChange={handleSelect}
                      // onChange={(item) => setState([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={ranges}
                    />
                  </div>
                )}
                {/* <InputGroup className="mis-videos-filtro-buscador">
            <Input />
            <InputGroup.Button>
              <FaSearch />
            </InputGroup.Button>
          </InputGroup> */}
              </div>
            </div>
          </>
        )}
        {misVideos.data != null &&
        misVideos.data.data != null &&
        videosGuardados != null &&
        misVideos != null &&
        misVideos.data.maxPages != null ? (
          <>
            <div className="box-principal-mis-videos-container">
              <div className="mis-videos-container">
                {misVideos.data.data.map((img, idx) => (
                  <div
                    className={`video-miniatura ${isChecked(
                      String(img.idPublicacion)
                    )}`}
                  >
                    <div
                      className="capa-oscura-sobre-imagen"
                      onClick={() => handleOpenReproductor(idx)}
                    >
                      {videosGuardados[idx] != null && (
                        <img src={videosGuardados[idx]} />
                      )}
                      {videosGuardados[idx] == null && (
                        // <img
                        //   src={
                        //     "https://res.cloudinary.com/grupo-delsud/image/upload/v1667489390/EditorPlus/pixels-animados-100px_wbleih.gif"
                        //   }
                        // />
                        <div class="loader"></div>
                      )}
                    </div>
                    <div className="video-datos-ocultos">
                      <div className="categoria-video-izquierda">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value={String(img.idPublicacion)}
                          name="check"
                          onChange={handleCheck}
                        />
                      </div>
                      <p className="categoria-video-veedor">{img.categoria}</p>
                      <p className="titulo-video-veedor">{img.titulo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <VeedorReproductorDeVideo
              imagenCarrousel={videosGuardados}
              posCarrousel={posCarrousel}
              estadoModalReproductor={abrirReproductor}
              misVideos={misVideos}
              setAbrirReproductor={setAbrirReproductor}
            />
            <ModalEliminarVideo
              data={checked}
              open={open}
              setOpen={setOpen}
              info={misVideos}
            />
          </>
        ) : (
          <>
            <div className="box-principal-mis-videos-container-sin-nada"></div>
          </>
        )}
      </div>
    </>
  );
}
