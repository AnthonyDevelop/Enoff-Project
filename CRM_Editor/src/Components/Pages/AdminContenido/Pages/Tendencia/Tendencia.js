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
import { HiLocationMarker } from "react-icons/hi";

import ModalEliminarVideo from "../../../User/Pages/MisVideos/ModalEliminarVideo/ModalEliminarVideo";
import { getVeedorRecibirVideosTendencias } from "../../../../../Actions/veedorRecibirVideos";

//Firebase
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

//UseSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";

//React Icons
import { AiFillPlusCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { GoCalendar } from "react-icons/go";
import { TiDelete } from "react-icons/ti";
import { MdOutlineModeEdit } from "react-icons/md";

//Calendario styless
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Link } from "react-router-dom";
import { setReproductorVideoActualizarVista } from "../../../../../Actions/Veedor/actualizarVistaReproductorVideos";

export default function Tendencia(props) {
  //traer datos usuario
  const dispatch = useDispatch();
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  const videoEstadoRespuesta = useSelector(
    (state) => state.reducerActualizarVistaReproductor.data
  );

  const videosGuardados = props.videosGuardadosGuardados;
  const misVideos = props.misVideosTendencia;
  const imagenUserPerfil = props.fotoPerfilesPeriodistas;

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
    if (idx != null) {
      setPosCarrousel(idx);
    }
    if (abrirReproductor == true) {
      setAbrirReproductor(false);
    } else {
      setAbrirReproductor(!abrirReproductor);
    }
  };

  useEffect(() => {
    if (abrirModalSubirVideo == false) {
      setAbrirModalSubirVideo(!abrirModalSubirVideo);
    }
  }, [abrirModalSubirVideo]);

  //Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroProvincia, setFiltroProvincia] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [filtroCalificacion, setFiltroCalificacion] = useState("");
  const [buscador, setBuscador] = useState("");


      /*SETEAR ESTADOS POR DEFECTO*/  
      useEffect(() => {
        if (misVideos.data != null) {  
          setBuscador(misVideos.data.titulo)
          if(misVideos.data.categorias!=null &&  misVideos.data.categorias.length == 1 ){
            setFiltroCategoria(misVideos.data.categorias[0].id)
          }
          if(misVideos.data.localidades!=null &&  misVideos.data.localidades.length == 1 ){
            setFiltroLocalidad(misVideos.data.localidades [0].localidad)
          }
          if(misVideos.data.provincias!=null &&  misVideos.data.provincias.length == 1){
            setFiltroProvincia(misVideos.data.provincias [0].provincia)
          }
          if(misVideos.data.calificaciones!=null &&  misVideos.data.calificaciones.length == 1){
            setFiltroCalificacion(misVideos.data.calificaciones[0].calificacion)
          }
          else{         
            setFiltroCategoria("");
            setFiltroLocalidad("");
            setFiltroProvincia("");
            setFiltroCalificacion("");
          }     
        }
    }, []); 
  

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
        idestado: "",
        urgente: true,
        iduser: "",
      };
      if (filtrosActivados === true) {
        dispatch(getVeedorRecibirVideosTendencias(dataVideo));
        if (filtrosActivados === true) {
          setAbrirReproductor(false);
          setFiltrosActivados(false);
        }
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

  if (misVideos.data != null) {
    var localidades = [];
    const lo = misVideos.data.localidades;
    for (var i = 0; i < lo.length; i++) {
      localidades.push({
        value: lo[i].localidad,
        label: lo[i].localidad,
      });
    }
  }

  if (misVideos.data != null) {
    var provincias = [];
    const pr = misVideos.data.provincias;
    for (var i = 0; i < pr.length; i++) {
      provincias.push({
        value: pr[i].provincia,
        label: pr[i].provincia,
      });
    }
  }

  const locale = {
    noResultsText: "No existen resultados",
    placeholder: "",
    searchPlaceholder: "Buscar",
    checkAll: "",
  };

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

  const handleChangeProvincia = (e) => {
    setFiltroProvincia(e);
    setFiltrosActivados(true);
  };

  const handleChangeLocalidad = (e) => {
    setFiltroLocalidad(e);
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
        {misVideos.data != null && misVideos != null && (
          <>
            <div className="contenedor-filtros-titulo-buscador">
              <h1 className="titulo-explorar">Tendencia</h1>
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
                {/* <MdDelete
                  // className="filtro-icono"
                  className={`${checked.length > 0 ? "filtro-icono activar" : "filtro-icono"
                    }`}
                  onClick={abrirModalEliminar}
                /> */}
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
                    placeholder={"Seleecione una categoría"}
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

                <SelectPicker
                locale={locale}
                placeholder={"Seleccione una localidad"}
                value={filtroLocalidad}
                onChange={(value, e) => handleChangeLocalidad(value)}
                onClean={(value, e) => handleChangeLocalidad("")}
                className="periodistas-select"
                data={localidades}
                style={{ width: 224 }}
                />

                <SelectPicker
                locale={locale}
                placeholder={"Provincia"}
                value={filtroProvincia}
                onChange={(value, e) => handleChangeProvincia(value)}
                className="periodistas-select"
                onClean={(value, e) => handleChangeProvincia("")}
                data={provincias}
                style={{ width: 224 }}
                />

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
                      <div className="vista-admin-sin-hover-video  ">
                        <p className="text-localidad-video">
                          <HiLocationMarker
                            color="rgb(37 37 35 / 55%)"
                            fontSize="20"
                            style={{ marginBottom: "5px" }}
                          />{" "}
                          {img.localidad}, {img.provincia}
                        </p>
                        <div className="box-hora-fecha-video">
                          <p className="fecha-video-admin">
                            {moment(img.fecha.date).format("L")}
                          </p>
                          <p className="fecha-video-admin">
                            {moment(img.fecha.date).format("LT")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="video-datos-ocultos ">
                      <div className="categoria-video-izquierda">
                        {/* <input
                        type="checkbox"
                        className="form-check-input"
                        value={String(img.idPublicacion)}
                        name="check"
                        onChange={handleCheck}
                      /> */}
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
              imagenUserPerfil={imagenUserPerfil}
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
