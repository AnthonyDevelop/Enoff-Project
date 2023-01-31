import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import "./misVideos.css";
import { Pagination, SelectPicker } from "rsuite";
import { DateRange } from "react-date-range";

import moment from "moment";
// import esLocale from "react-date-range/dist/locale/es";
import * as locales from "react-date-range/dist/locale";
import SubirVideo from "./SubirVideo/SubirVideo";
import ReproductorDeVideos from "./VideoReproductor/ReproductorDeVideos";
import { Rate } from "rsuite";
import Select from "react-select";
import { useMediaQuery } from "react-responsive";

import ModalEliminarVideo from "./ModalEliminarVideo/ModalEliminarVideo";
import { getRecibirMisVideos } from "../../../../../Actions/MostrarVideos";
import { getCategorias } from "../../../../../Actions/categorias";

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

export default function MisVideos(props) {
  //traer datos usuario
  const dispatch = useDispatch();
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);

  const videosGuardados = props.videosGuardados;
  const misVideos = props.misVideos;
console.log(videosGuardados)
  const [abrirReproductor, setAbrirReproductor] = useState(null);
  const [posCarrousel, setPosCarrousel] = useState();
  const [abrirModalSubirVideo, setAbrirModalSubirVideo] = useState(null);
  const [calendario, setCalendario] = useState(false);
  const [open, setOpen] = useState(false);
  const [filtrosActivados, setFiltrosActivados] = useState(false);
  const [data, setData] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [checked, setChecked] = useState([]);
  const [activarHoverMobile, setActivarHoverMobile] = useState(false);

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

  const locale = {
    noResultsText: "No existen resultados",
    placeholder: "",
    searchPlaceholder: "Buscar",
    checkAll: "",
  };

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

  // useEffect(
  //   (idx) => {
  //     if (abrirModalSubirVideo == false) {
  //       setAbrirModalSubirVideo(!abrirModalSubirVideo);
  //     }
  //   },
  //   [abrirModalSubirVideo]
  // );

  //Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroCalificacion, setFiltroCalificacion] = useState("");
  const [filtroEstadoUrgente, setFiltroEstadoUrgente] = useState(false);

  useEffect(() => {
    if (datosUser != null) {
      let fechaFormateadaInicio = "";
      let fechaFormateadaFin = "";
      if (from != "" && to != "") {
        fechaFormateadaInicio = moment(from).format("YYYY-MM-DD");
        fechaFormateadaFin = moment(to).format("YYYY-MM-DD");
      }

      const data = {
        // busqueda: "",
        idCategoria: filtroCategoria,
        // localidad:"",
        // provincia:"",
        page: activePage,
        fechaInicio: fechaFormateadaInicio,
        fechaFin: fechaFormateadaFin,
        calificacion: filtroCalificacion,
        estado: "",
        urgente: filtroEstadoUrgente,
        userId: datosUser.userData.idUser,
      };
      if (filtrosActivados === true) {
        dispatch(getRecibirMisVideos(data));
        setFiltrosActivados(false);
        setAbrirReproductor(false);
        
      }
      console.log(data)
    }
  }, [filtrosActivados]);

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
            // style={{ color: "#DDE100!important" }}
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
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={5}
            size="xs"
          />
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

  function activarCalendario() {
    setCalendario(!calendario);
  }

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
      <div
        className={
          misVideos.data != null &&
            misVideos.data.data != null &&
            misVideos != null &&
            misVideos.data.filter != null
            ? "mis-videos-sin-videos"
            : "mis-videos-sin-videos-centrado"
        }
      >
        <div className="mis-videos-subir-video">
          {/* <div className="container-nuevo">
            <div className="pulse">
              <i className="fa fa-phone"></i> */}
          <button className="fa fa-phone" onClick={handleSubirVideo}>
            <AiFillPlusCircle />
            Cargar video
          </button>
          {/* </div>
          </div> */}

        </div>
        {misVideos.data != null &&
          misVideos.data.data != null &&
          videosGuardados != null &&
          misVideos != null &&
          categorias != null &&
          misVideos.data.maxPages != null ? (
          <>
            {vistaMobile === true ?
              (
                <div className="mis-videos-filtros">
                  <div className="flex-mobile-subnavbar">
                    <SelectPicker
                      locale={locale}
                      onChange={(value, e) => handleChangeCategoria(value)}
                      placeholder={"Categoría"}
                      className="periodistas-select"
                      data={categorias}
                      style={{ width: 160, heigth: 38 }}
                    />
                    {/* <Select
                    className="select-usuarios"
                    isSearchable={false}
                    options={options}
                    // placeholder={"Calificación"}
                    onChange={handleChange}
                    value={options.filter(function (option) {
                      return option.value === filtroCalificacion;
                    })}
                  /> */}
                    <SelectPicker
                      searchable={false}
                      locale={locale}
                      onChange={(value, e) => handleChange(value)}
                      placeholder={"Calificación"}
                      className="periodistas-select"
                      data={options}
                      style={{ width: 160, heigth: 38 }}
                    />
                  </div>

                  <div className=" flex-mobile-subnavbar-2">
                    {checked.length > 0 ? (
                      <MdDelete
                        color='#131838'
                        fontSize={10}
                        // className="filtro-icono"
                        style={{ cursor: "pointer" }}
                        className={`${checked.length > 0
                          ? "filtro-icono activar"
                          : "filtro-icono"
                          }`}
                        onClick={abrirModalEliminar}
                      />
                    ) : (
                      <MdDelete
                        color='rgb(19, 24, 56)'
                        fontSize={10}
                        // className="filtro-icono"
                        style={{ cursor: "pointer" }}
                        className={`${checked.length > 0
                          ? "filtro-icono activar"
                          : "filtro-icono"
                          }`}
                        onClick={() => setActivarHoverMobile(!activarHoverMobile)}
                      />
                    )}

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
                        style={{ cursor: "pointer", padding: '0px' }}
                        placement="bottomStart"
                      />
                    )}
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
                      <Pagination
                        prev
                        next
                        style={{ width: "130px" }}
                        total={misVideos.data.maxPages}
                        limit={1}
                        activePage={activePage}
                        onChangePage={(e) => {
                          setActivePage(e);
                          setFiltrosActivados(true);
                        }}
                      />
                    </div>
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
              ) :
              (
                <div className="mis-videos-filtros">
                  <MdDelete
                    color='#131838'
                    // className="filtro-icono"
                    className={`${checked.length > 0 ? "filtro-icono activar" : "filtro-icono"
                      }`}
                    onClick={abrirModalEliminar}
                    style={{ cursor: "pointer" }}
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
                      style={{ cursor: "pointer", padding: '0px' }}
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
              )}
            <div className="box-principal-mis-videos-container">
              <div className="mis-videos-container">
                {misVideos.data != null &&
                  misVideos.data.data != null &&
                  videosGuardados != null &&
                  misVideos != null &&
                  misVideos.data.maxPages != null
                  ? misVideos.data.data.map((img, idx) => (
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
                      {vistaMobile === true ? (
                        <div
                          className={
                            activarHoverMobile === true
                              ? ""
                              : "video-datos-ocultos"
                          }
                        >
                          <div className="categoria-video-izquierda-mobile">
                            {img.idComprador == "Sin Comprador" && (
                              <input
                                type="checkbox"
                                className="form-check-input"
                                value={String(img.idPublicacion)}
                                name="check"
                                onChange={handleCheck}
                              />
                            )}
                          </div>
                          {/* <p className="titulo-video">{img.titulo}</p> */}
                          <p className="categoria-video-mobile">
                            {img.categoria}
                          </p>
                        </div>
                      ) : (
                        <div className="video-datos-ocultos">
                          <p className="categoria-video">{img.categoria}</p>
                          <div className="categoria-video-izquierda">
                            {img.idComprador == "Sin Comprador" && (
                              <input
                                type="checkbox"
                                className="form-check-input"
                                value={String(img.idPublicacion)}
                                name="check"
                                onChange={handleCheck}
                              />
                            )}
                          </div>
                          <p className="titulo-video">{img.titulo}</p>
                        </div>
                      )}
                    </div>
                  ))
                  : ""}
                {/* {mostrarVideos != null ? mostrarVideos : "No hay videos"} */}
              </div>
            </div>
            <ReproductorDeVideos
              imagenCarrousel={videosGuardados}
              posCarrousel={posCarrousel}
              estadoModalReproductor={abrirReproductor}
              misVideos={misVideos}
              setAbrirReproductor={setAbrirReproductor}
            />
            <ModalEliminarVideo
              data={checked}
              setChecked={setChecked}
              open={open}
              setOpen={setOpen}
              info={misVideos}
            />
          </>
        ) : (
          <>
            {misVideos.data != null &&
              misVideos != null &&
              misVideos.data.filter != null ?
              (
                <>
                  {misVideos.data.filter === false ?
                    (
                      <div className="mis-videos-text-container">
                        <h5>¡Compartí contenido para empezar a monetizarlo!</h5>
                        <p>
                          Nuestros administradores lo evaluarán.
                          <br />
                          <span>
                            {" "}
                            Recordá leer las recomendaciones para generar contenido
                            <br /> destacado y aumentar tu reputación.
                          </span>
                        </p>
                      </div>
                    ) :
                    (
                      <div className="mis-videos-filtros">
                        {vistaMobile === true ?
                          (
                            <>
                              <div className="flex-mobile-subnavbar">
                                <SelectPicker
                                  locale={locale}
                                  onChange={(value, e) => handleChangeCategoria(value)}
                                  placeholder={"Categoría"}
                                  className="periodistas-select"
                                  data={categorias}
                                  style={{ width: 150, heigth: 38 }}
                                />
                                <SelectPicker
                                  searchable={false}
                                  locale={locale}
                                  onChange={(value, e) => handleChange(value)}
                                  placeholder={"Calificación"}
                                  className="select-usuarios"
                                  data={options}
                                  style={{ width: 150, heigth: 38 }}
                                />
                              </div>

                              <div className=" flex-mobile-subnavbar-2">
                                <MdDelete
                                  color='#131838'
                                  // className="filtro-icono"
                                  className={`${checked.length > 0
                                    ? "filtro-icono activar"
                                    : "filtro-icono"
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

                                </div>


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
                              <div className="sin-videos-mobile">
                              </div>
                            </>


                          ) :
                          (
                            <div className="mis-videos-filtros">
                              <MdDelete
                                color='#131838'
                                // className="filtro-icono"
                                className={`${checked.length > 0
                                  ? "filtro-icono activar"
                                  : "filtro-icono"
                                  }`}
                                onClick={abrirModalEliminar}
                              />

                              {calendario === true ? (
                                <button
                                  className="button-cerrar-calendario"
                                  onClick={activarCalendario}
                                >
                                  <TiDelete fontSize={25} color="#DA643A" />

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
                                value={filtroCalificacion}
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
                          )}
                      </div>
                    )}
                </>
              ) : (
                ""
              )}
          </>
        )}
        <SubirVideo setEstadoModal={setAbrirModalSubirVideo} estadoModal={abrirModalSubirVideo} />

        {datosUser != null &&
          datosUser.userData.credenciales === "Desvinculado" ? (
          <Link
            className="container-vincular-billetera-no-vinculada"
            to="/User/Mis-finanzas"
          ></Link>
        ) : (
          <Link
            className="container-vincular-billetera"
            to="/User/Mis-finanzas"
          ></Link>
        )}
      </div>
    </>
  );
}
