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
import { GoCalendar } from "react-icons/go";
import { TiDelete } from "react-icons/ti";
import { Rate, SelectPicker } from "rsuite";
import Card from "react-bootstrap/Card";
import { Icon } from "@rsuite/icons";
import { MdOutlineMonetizationOn } from "react-icons/md";
import { Checkbox, CheckboxGroup, Pagination } from "rsuite";
import VeedorReproductorDeVideo from "../Explorar/VeedorReproductorDeVideo/VeedorReproductorDeVideo";
import "../Adquirido/adquirido.css";
//Acciones
import { getVeedorRecibirVideosDescartado } from "../../../../../Actions/veedorRecibirVideos";

//UseSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";
import { setReproductorVideoActualizarVista } from "../../../../../Actions/Veedor/actualizarVistaReproductorVideos";

export default function Descartado(props) {
  const videosGuardadosDescartados = props.videosGuardadosDescartados;
  const misVideosDescartados = props.misVideosDescartados;
  const listCategoria = useSelector((state) => state.reducerCategorias.data);

  const videoEstadoRespuesta = useSelector(
    (state) => state.reducerActualizarVistaReproductor.data
  );


  const [calendario, setCalendario] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [activePage, setActivePage] = useState(1);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  //Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtrosActivados, setFiltrosActivados] = useState(false);
  const [filtroCalificacion, setFiltroCalificacion] = useState("");
  const [videoEliminado, setVideoEliminado] = useState(false);
  const [filtroProvincia, setFiltroProvincia] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
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
    if (misVideosDescartados.data != null) {  
      if(misVideosDescartados.data.categorias!=null &&  misVideosDescartados.data.categorias.length == 1 ){
        setFiltroCategoria(misVideosDescartados.data.categorias[0].id)
      }
      if(misVideosDescartados.data.localidades!=null &&  misVideosDescartados.data.localidades.length == 1 ){
        setFiltroLocalidad(misVideosDescartados.data.localidades [0].localidad)
      }
      if(misVideosDescartados.data.provincias!=null &&  misVideosDescartados.data.provincias.length == 1){
        setFiltroProvincia(misVideosDescartados.data.provincias [0].provincia)
      }
      if(misVideosDescartados.data.calificaciones!=null &&  misVideosDescartados.data.calificaciones.length == 1){
        setFiltroCalificacion(misVideosDescartados.data.calificaciones[0].calificacion)
      }
      else{         
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
          if ( videoEstadoRespuesta.message === "Post descartado correctamente") {
            setFiltroCategoria("");
            setFiltroLocalidad("");
            setFiltroProvincia("");
            setFiltroCalificacion("");
            setVideoEliminado(true);
            dispatch(setReproductorVideoActualizarVista(false));
          }
        }
      }, [videoEstadoRespuesta]);



  /*Calificacion*/
  if (misVideosDescartados.data != null) {
    var calificaciones = [];
    const ca = misVideosDescartados.data.calificaciones;
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

  if (misVideosDescartados.data != null) {
    var categorias = [];
    const lc = misVideosDescartados.data.categorias;
    for (var i = 0; i < lc.length; i++) {
      categorias.push({
        value: lc[i].id,
        label: lc[i].nombre,
      });
    }
  }

  if (misVideosDescartados.data != null) {
    var localidades = [];
    const lo = misVideosDescartados.data.localidades;
    for (var i = 0; i < lo.length; i++) {
      localidades.push({
        value: lo[i].localidad,
        label: lo[i].localidad,
      });
    }
  }

  if (misVideosDescartados.data != null) {
    var provincias = [];
    const pr = misVideosDescartados.data.provincias;
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

  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (misVideosDescartados != null && misVideosDescartados.data != null)
      setUsers(misVideosDescartados.data.data);
    // setUsers(userData);
  }, [misVideosDescartados]);

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

  const handleChangeCalificacion = (e) => {
    setFiltroCalificacion(e);
    setFiltrosActivados(true);
  };

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
      localidad: filtroLocalidad,
      provincia: filtroProvincia,
      titulo: "",
      page: activePage,
      fechaInicio: fechaFormateadaInicio,
      fechaFin: fechaFormateadaFin,
      calificacion: filtroCalificacion,
      idestado: 3,
      urgente: filtroEstadoUrgente,
      iduser: "",
    };
    if (videoEliminado==true || filtrosActivados === true) {
      dispatch(getVeedorRecibirVideosDescartado(data));
      setFiltrosActivados(false);
      setAbrirReproductor(false);
    }
  }, [filtrosActivados,videoEliminado]);

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
        {misVideosDescartados.data != null && misVideosDescartados != null && (
          <div className="contenedor-filtros-titulo-buscador-adquirido-3">
            <div>
              <h1 className="titulo-explorar">Videos Descartados</h1>
            </div>
            <div className="container-subtittle">
              <p className="color-texto">
                Importante: el contenido descartado quedará en la base de datos
                durante los próximos 30 días, luego de ese tiempo será eliminado
                definitivamente.
              </p>
            </div>
            <div className="box-paginacion-adquirido">
              {misVideosDescartados != null &&
                misVideosDescartados.data != null && (
                  <Pagination
                    prev
                    next
                    size="xs"
                    total={misVideosDescartados.data.maxPages}
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
              {calendario === true ? (
                <button
                  className="button-cerrar-calendario"
                  onClick={activarCalendario}
                >
                  {/* <TiDelete fontSize={25} color="#DA643A" /> */}
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
        )}
        {misVideosDescartados.data != null &&
          misVideosDescartados.data.data != null &&
          videosGuardadosDescartados != null &&
          misVideosDescartados != null &&
          misVideosDescartados.data.maxPages != null && users!=null && (
            <div className="mis-videos-container-adquirido-3">
              {users.map((user, index) => (
                <div key={index} className="contenedor-card-adquirido">
                  <Card key={index} 
                     style={{ 
                      width: '100%', 
                    height: '180px', 
                    display: 'flex', 
                    flexDirection: 'row',
                    border:'2px solid  #DA643A',
                    borderRadius:'10px'}}
                    className="contenedor-card"
                    onClick={() => handleOpenReproductor(index)}
                  >
                    <Card.Img
                      style={{ width: '200px',borderRadius: '10px' }} 
                      variant="top"
                      src={videosGuardadosDescartados[index]}
                    />
                    <Card.Body
                      style={{ 
                        width: '80%', 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'row', 
                        justifyContent: 'space-around', 
                        alignItems: 'center' }}>
                     <div className="box-info-card">
                        <Card.Title className="card-title-adquirido">{user.titulo}</Card.Title>
                        <Card.Text className="parrafo-card-adquirido" >
                          {user.descripcion}
                          Ver mas...
                        </Card.Text>
                      </div>
                      <div className="box-precio-estrellas-card">
                      <Rate
                          // className="rate-adquirido"
                          readOnly
                          style={{ color: "#DDE100!important" }}
                          value={user.calificacion}
                          size="md"
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
                imagenCarrousel={videosGuardadosDescartados}
                posCarrousel={posCarrousel}
                estadoModalReproductor={abrirReproductor}
                misVideos={misVideosDescartados}
                setAbrirReproductor={setAbrirReproductor}
              />
            </div>
          )}
      </div>
    </>
  );
}
