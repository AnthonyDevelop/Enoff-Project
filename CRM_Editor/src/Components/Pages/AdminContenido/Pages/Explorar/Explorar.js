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
import VeedorReproductorDeVideo from "./VeedorReproductorDeVideo/VeedorReproductorDeVideo";
import { Rate } from "rsuite";
import Select from "react-select";
import { useMediaQuery } from "react-responsive";
import SearchIcon from "@rsuite/icons/Search";
import { HiLocationMarker } from "react-icons/hi";

import ModalEliminarVideo from "../../../User/Pages/MisVideos/ModalEliminarVideo/ModalEliminarVideo";
import { getVeedorRecibirMisVideos } from "../../../../../Actions/veedorRecibirVideos";
import { setReproductorVideoActualizarVista } from "../../../../../Actions/Veedor/actualizarVistaReproductorVideos";

import "./Explorar.css";
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
import { IoMdRefreshCircle } from "react-icons/io";
import { MdOutlineModeEdit } from "react-icons/md";

//Calendario styless
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Link } from "react-router-dom";

export default function Explorar(props) {
  //traer datos usuario
  const dispatch = useDispatch();
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  const videoEstadoRespuesta = useSelector(
    (state) => state.reducerActualizarVistaReproductor.data
  );

  const videosGuardados = props.videosGuardados;
  const misVideos = props.misVideos;
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

  //Preguntar si ya borro el video
  // useEffect(() => {
  //   if (videoEstadoRespuesta != null) {
  //     if (
  //       videoEstadoRespuesta.message == "Post descartado correctamente" ||
  //       videoEstadoRespuesta.message == "Post guardado correctamente" ||
  //       videoEstadoRespuesta.message == "Post calificado correctamente"
  //     ) {
  //       setVideoEliminado(true);
  //       dispatch(setReproductorVideoActualizarVista(false));
  //     }
  //   }
  // }, [videoEstadoRespuesta]);

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
    },
    [abrirModalSubirVideo]
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
        idestado: "",
        urgente: filtroEstadoUrgente,
        iduser: "",
      };
      if (filtrosActivados === true ) {
        dispatch(getVeedorRecibirMisVideos(dataVideo));
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
  const options = [
    {
      value: "",
      label: "Calificación",
    },
    {
      value: "1",
      label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={1}
            size="xs"
          />
        </div>
      ),
    },
    {
      value: "2",
      label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={2}
            size="xs"
          />
        </div>
      ),
    },
    {
      value: "3",
      label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={3}
            size="xs"
          />
        </div>
      ),
    },
    {
      value: "4",
      label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={4}
            size="xs"
          />
        </div>
      ),
    },
    {
      value: "5",
      label: (
        <div>
          <Rate className="sidebar-user-rate" readOnly value={5} size="xs" />
        </div>
      ),
    },
  ];

  const handleChange = (e) => {
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

  function handleActualizarVideo() {
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
      urgente: filtroEstadoUrgente,
      iduser: "",
    };
    if (filtrosActivados === true || videoEliminado == true) {
      dispatch(getVeedorRecibirMisVideos(dataVideo));
      setVideoEliminado(false);
      if (filtrosActivados === true) {
        setAbrirReproductor(false);
        setFiltrosActivados(false);
      }
    }
    dispatch(getVeedorRecibirMisVideos(dataVideo));
  }

  return (
    <>
      <div className="mis-videos-sin-videos">
        {categorias != null &&
          misVideos.data != null &&
          localidades != null &&
          provincias != null &&
          misVideos != null && (
            <>
              <div className="contenedor-filtros-titulo-buscador">
                <h1 className="titulo-explorar">Explorar</h1>

                <div className="box-input-buscador">
                  <InputGroup>
                    <Input
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

                  <button className="button-cerrar-calendario" onClick={handleActualizarVideo}><IoMdRefreshCircle fontSize={32} color='#131838' /></button>
                  {calendario === true ? (
                    <button  className="button-cerrar-calendario"  onClick={activarCalendario} >
                      <TiDelete fontSize={38} color="#DA643A" />
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
                    onChange={(value, e) => handleChangeCategoria(value)}
                    placeholder={"Seleccione una categoría"}
                    className="periodistas-select"
                    data={categorias}
                    style={{ width: 224 }}
                  />

                  <SelectPicker
                    searchable={false}
                    locale={locale}
                    onChange={(value, e) => handleChange(value)}
                    placeholder={"Calificación"}
                    className="periodistas-select"
                    data={options}
                    style={{ width: 224 }}
                  />

                  <SelectPicker
                    locale={locale}
                    placeholder={"Seleccione una localidad"}
                    onChange={(value, e) => handleChangeLocalidad(value)}
                    onClean={(value, e) => handleChangeLocalidad("")}
                    className="periodistas-select"
                    data={localidades}
                    style={{ width: 224 }}
                  />

                  <SelectPicker
                    locale={locale}
                    placeholder={"Provincia"}
                    onChange={(value, e) => handleChangeProvincia(value)}
                    onClean={(value, e) => handleChangeProvincia("")}
                    className="periodistas-select"
                    data={provincias}
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
              posCarrousel={0}
              setPosCarrousel={setPosCarrousel}
              estadoModalReproductor={abrirReproductor}
              setAbrirReproductor={setAbrirReproductor}
              misVideos={misVideos}
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
