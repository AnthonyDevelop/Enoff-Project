import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Select from "react-select";
import { DateRange } from "react-date-range";
import moment from "moment";
import * as locales from "react-date-range/dist/locale";
import SearchIcon from "@rsuite/icons/Search";
import { MdDelete } from "react-icons/md";
import { GoCalendar } from "react-icons/go";
import { Rate, SelectPicker } from "rsuite";
import "./adquirido.css";
import Card from "react-bootstrap/Card";
import { Icon } from "@rsuite/icons";
import { MdOutlineMonetizationOn } from "react-icons/md";
import { Checkbox, CheckboxGroup, Pagination } from "rsuite";
import VeedorReproductorDeVideo from "../Explorar/VeedorReproductorDeVideo/VeedorReproductorDeVideo";
import { TiDelete } from "react-icons/ti";
//Acciones
import { getVeedorRecibirVideosComprados } from "../../../../../Actions/veedorRecibirVideos";

//UseSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";
import { set } from "react-hook-form";
import { setReproductorVideoActualizarVista } from "../../../../../Actions/Veedor/actualizarVistaReproductorVideos";
import ModalEliminarVideo from "../../../User/Pages/MisVideos/ModalEliminarVideo/ModalEliminarVideo";
const data = ["A", "B", "C"];

function Adquirido(props) {
  const videosGuardadosComprados = props.videosGuardadosComprados;
  const misVideosComprados = props.videosComprados;
  const imagenUserPerfil = props.fotoPerfilesPeriodistas;
  const videoEstadoRespuesta = useSelector(
    (state) => state.reducerActualizarVistaReproductor.data
  );

  const misVideos = props.misVideosDestacados;

  const [calendario, setCalendario] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [activePage, setActivePage] = useState(1);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  //Filtros
  const [checked, setChecked] = useState([]);
  const [videoComprado, setVideoComprado] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroProvincia, setFiltroProvincia] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [filtrosActivados, setFiltrosActivados] = useState(false);
  const [filtroCalificacion, setFiltroCalificacion] = useState("");
  const [filtroEstadoUrgente, setFiltroEstadoUrgente] = useState(false);
  const [abrirReproductor, setAbrirReproductor] = useState(null);
  const [posCarrousel, setPosCarrousel] = useState();
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const dispatch = useDispatch();

  const locale = {
    noResultsText: "No existen resultados",
    placeholder: "",
    searchPlaceholder: "Buscar",
    checkAll: "",
  };


  /*SETEAR ESTADOS POR DEFECTO*/
  useEffect(() => {
    if (misVideosComprados.data != null) {
      if (misVideosComprados.data.categorias != null && misVideosComprados.data.categorias.length == 1) {
        setFiltroCategoria(misVideosComprados.data.categorias[0].id)
      }
      if (misVideosComprados.data.localidades != null && misVideosComprados.data.localidades.length == 1) {
        setFiltroLocalidad(misVideosComprados.data.localidades[0].localidad)
      }
      if (misVideosComprados.data.provincias != null && misVideosComprados.data.provincias.length == 1) {
        setFiltroProvincia(misVideosComprados.data.provincias[0].provincia)
      }
      if (misVideosComprados.data.calificaciones != null && misVideosComprados.data.calificaciones.length == 1) {
        setFiltroCalificacion(misVideosComprados.data.calificaciones[0].calificacion)
      }
      else {
        setFiltroCategoria("");
        setFiltroLocalidad("");
        setFiltroProvincia("");
        setFiltroCalificacion("");
      }
    }
  }, []);

  //Preguntar si ya borro el video
  useEffect(() => {
    if (videoEstadoRespuesta != null) {
      if (videoEstadoRespuesta.message === "Post comprado correctamente") {
        setFiltroCategoria("");
        setFiltroLocalidad("");
        setFiltroProvincia("");
        setFiltroCalificacion("");
        setVideoComprado(true);
        dispatch(setReproductorVideoActualizarVista(false));
      }
    }
  }, [videoEstadoRespuesta]);


  /*Calificacion*/
  if (misVideosComprados.data != null) {
    var calificaciones = [];
    const ca = misVideosComprados.data.calificaciones;
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

  if (misVideosComprados.data != null) {
    var categorias = [];
    const lc = misVideosComprados.data.categorias;
    for (var i = 0; i < lc.length; i++) {
      categorias.push({
        value: lc[i].id,
        label: lc[i].nombre,
      });
    }
  }

  if (misVideosComprados.data != null) {
    var localidades = [];
    const lo = misVideosComprados.data.localidades;
    for (var i = 0; i < lo.length; i++) {
      localidades.push({
        value: lo[i].localidad,
        label: lo[i].localidad,
      });
    }
  }

  if (misVideosComprados.data != null) {
    var provincias = [];
    const pr = misVideosComprados.data.provincias;
    for (var i = 0; i < pr.length; i++) {
      provincias.push({
        value: pr[i].provincia,
        label: pr[i].provincia,
      });
    }
  }

  const handleTypeSelect = (e) => {
    setSelectedOption(e.value);
  };

  function activarCalendario() {
    setCalendario(!calendario);
  }

  const [value, setValue] = useState([""]);
  const handleCheckAll = (value, checked) => setValue(checked ? data : []);

  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (misVideosComprados != null && misVideosComprados.data != null)
      setUsers(misVideosComprados.data.data);
    // setUsers(userData);
  }, [misVideosComprados]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempUser = users.map((user) => {
        return { ...user, isChecked: checked };
      });
      setUsers(tempUser);
    } else {
      let tempUser = users.map((user) =>
        String(user.idPublicacion) === name
          ? { ...user, isChecked: checked }
          : user
      );
      setUsers(tempUser);
    }
  };

  function abrirModalEliminar() {
    if (checked.length > 0) {
      setOpen(true);
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

  const handleSelect = useCallback(({ selection: { startDate, endDate } }) => {
    setFrom(startDate);
    setTo(endDate);
    setFiltrosActivados(true);
  });

  const ranges = useMemo(() => {
    return [
      {
        startDate: from,
        endDate: to,
        key: "selection",
      },
    ];
  }, [from, to]);

  //Disparar Filtros
  useEffect(() => {
    let fechaFormateadaInicio = "";
    let fechaFormateadaFin = "";
    if (from != "" && to != "") {
      fechaFormateadaInicio = moment(from).format("YYYY-MM-DD");
      fechaFormateadaFin = moment(to).format("YYYY-MM-DD");
    }
    const data = {
      // busqueda: "",
      idCategoria: filtroCategoria,
      localidad: "",
      provincia: "",
      titulo: "",
      page: activePage,
      fechaInicio: fechaFormateadaInicio,
      fechaFin: fechaFormateadaFin,
      calificacion: filtroCalificacion,
      idestado: 1,
      urgente: filtroEstadoUrgente,
      iduser: "",
    };
    if (videoComprado == true || filtrosActivados === true) {
      dispatch(getVeedorRecibirVideosComprados(data));
      setFiltrosActivados(false);
      setAbrirReproductor(false);
    }
  }, [filtrosActivados, videoComprado]);

  const handleOpenReproductor = (index) => {
    setPosCarrousel(index);
    if (abrirReproductor == true) {
      setAbrirReproductor(false);
    } else {
      setAbrirReproductor(!abrirReproductor);
    }
  };

  return (
    <>
      <div className="mis-videos-sin-videos">
        {misVideosComprados.data != null &&
          misVideosComprados.data.data != null &&
          videosGuardadosComprados != null &&
          misVideosComprados != null &&
          users != null &&
          categorias != null &&
          misVideosComprados.data.maxPages != null ? (
          <>
            <div className="contenedor-filtros-titulo-buscador">
              <h1 className="titulo-explorar">Adquiridos</h1>
              <div className="box-paginacion-adquirido">
                {misVideosComprados != null && misVideosComprados.data != null && (
                  <Pagination
                    prev
                    next
                    size="xs"
                    total={misVideosComprados.data.maxPages}
                    limit={1}
                    activePage={activePage}
                    onChangePage={(e) => {
                      setActivePage(e);
                      setFiltrosActivados(true);
                    }}
                  />
                )}
              </div>
              <div className="mis-videos-filtros-admin">
                {/* <input
                  type="checkbox"
                  // className="form-check-input"
                  name="allSelect"
                  className="form-check-input"
                  // checked={
                  //   users.filter((user) => user?.isChecked !== true).length < 1
                  // }
                  checked={!users.some((user) => user?.isChecked !== true)}
                  onChange={handleChange}
                /> */}
                <MdDelete
                  color='#131838'
                  // className="filtro-icono"
                  className={`${checked.length > 0 ? "filtro-icono activar" : "filtro-icono"
                    }`}
                  onClick={()=> abrirModalEliminar()}
                />
                {calendario === true ? (
                  <button
                    className="button-cerrar-calendario"
                    onClick={activarCalendario}
                  >
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
            <div className="mis-videos-container-adquirido">
              {users.map((user, index) => (
                <div key={index} className="contenedor-card-adquirido">
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name={String(user.idPublicacion)}
                      checked={user?.isChecked || false}
                      onChange={handleChange}
                    />
                  </div>
                  <Card
                    style={{
                      width: '100%',
                      height: '180px',
                      display: 'flex',
                      flexDirection: 'row',
                      border: '2px solid #DA643A',
                      borderRadius: '10px'
                    }}
                    onClick={() => handleOpenReproductor(index)}
                    className='card-adquirido'
                  >
                    <Card.Img
                      variant="top"
                      style={{ width: '200px', borderRadius: '10px' }}
                      src={videosGuardadosComprados[index]} />
                    <Card.Body
                      style={{
                        width: '80%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                      }}>
                      <div className="box-info-card">
                        <Card.Title className="card-title-adquirido">{user.titulo}</Card.Title>
                        <Card.Text className="parrafo-card-adquirido" >
                          {user.descripcion}
                        </Card.Text>
                      </div>
                      <div className="box-precio-estrellas-card">
                        <Rate
                          // className="rate-adquirido"
                          readOnly
                          style={{ color: "#DDE100!important" }}
                          defaultValue={user.calificacion}
                        // size="xs"
                        />
                        <p className="font-verde-card">
                          <MdOutlineMonetizationOn fontSize={25} />  {user.precio}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
              <VeedorReproductorDeVideo
                imagenCarrousel={videosGuardadosComprados}
                posCarrousel={posCarrousel}
                estadoModalReproductor={abrirReproductor}
                misVideos={misVideosComprados}
                setAbrirReproductor={setAbrirReproductor}
                imagenUserPerfil={imagenUserPerfil}
              />
               <ModalEliminarVideo
              data={checked}
              open={open}
              setOpen={setOpen}
              info={misVideos}
            />
            </div>
          </>
        ) : (
          <>
            {misVideosComprados.data != null && misVideosComprados != null && (
              <>
                <div className="contenedor-filtros-titulo-buscador">
                  <h1 className="titulo-explorar"> Videos Adquiridos </h1>
                  <div className="mis-videos-filtros-admin">
                    {calendario === true ? (
                      <button
                        className="button-cerrar-calendario"
                        onClick={activarCalendario}
                      >
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
                      value={filtroCategoria}
                      onChange={(value, e) => handleChangeCategoria(value)}
                      onClean={(value, e) => handleChangeCategoria("")}
                      placeholder={"Seleccione una categoría"}
                      className="periodistas-select"
                      data={categorias}
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
           
          </>
        )}
      </div>
    </>
  );
}

export default Adquirido;
