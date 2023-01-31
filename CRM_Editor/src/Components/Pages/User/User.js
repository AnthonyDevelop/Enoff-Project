import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidenav, Nav, Navbar, Container, Sidebar } from "rsuite";
import { Link, useLocation } from "react-router-dom";
import MisVideos from "./Pages/MisVideos/MisVideos";
import Destacados from "./Pages/Destacados/Destacados";
import Monetizados from "./Pages/Monetizados/Monetizados";
import MercadoPagoValidado from "./Pages/MisFinanzas/MercadoPagoValidado";
import { getListaNotificacionesUser } from "../../../Actions/listaNotificacionesUser";
import MiPerfil from "./Pages/MiPerfil/MiPerfil";
import { Rate } from "rsuite";
import Avatar from "rsuite/Avatar";
import NavbarEditor from "../../Navbar/Navbar";
import { io } from 'socket.io-client'
import { useRef } from "react";

//Import css
import "rsuite/dist/rsuite.min.css";
import "./user.css";

//React Icons
import { MdOutlineMenuOpen } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

//Firebase
import {
  getStorage,
  ref,
  getDownloadURL,
} from "firebase/storage";
import update from "react-addons-update";
//UseSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";

//Importar acciones
import { getDatosUsuario } from "../../../Actions/datosUsuario";
import { getRecibirMisVideos } from "../../../Actions/MostrarVideos";
import ModalCerrarSesion from "./ModalCerrarSesion/ModalCerrarSesion";
import SobreNosotros from "./Pages/SobreNosotros/SobreNosotros";
import PoliticaDePrivacidad from "./Pages/PoliticaDePrivacidad/PoliticaDePrivacidad";
import Ayuda from "./Pages/Ayuda/Ayuda";
import MisFinanzas from "./Pages/MisFinanzas/MisFinanzas";
import { getRecibirVideosComprados } from "../../../Actions/MostrarVideos";
import { getCategorias } from "../../../Actions/categorias";

import { useMediaQuery } from "react-responsive";
import MisFinanzasVinculada from "./Pages/MisFinanzas/MisFinanzasVinculada";
import Notificaciones from "./Pages/Notificaciones/Notificaciones";
import Configuracion from "./Pages/Configuracion/Configuracion";
import { ActivarSeccionSidebar } from "../../../Actions/AccionActivarSidebar";

const NavToggle = ({ expand, onChange }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Navbar.Body>
        <Nav className="icono-cerrar-sidebar">
          <Nav.Item
            onClick={onChange}
            style={{ width: 56, textAlign: "center" }}
          >
            {expand ? (
              <MdOutlineMenuOpen color="white" fontSize={30} />
            ) : (
              <FiMenu color="white" fontSize={30} />
            )}
          </Nav.Item>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};

export default function User() {
  const [expand, setExpand] = useState(true);
  const [active, setActive] = useState("User");
  const [open, setOpen] = useState(false);
  const [imagenUrl, setImagenUrl] = useState([]);
  const [mostrarImagenPerfil, setMostrarImagenPerfil] = useState();
  const [imagenUrlComprados, setImagenUrlComprados] = useState([]);
  const [videosGuardados, setVideosGuardados] = useState({
    videos: [],
  });
  const [videosGuardadosComprados, setVideosGuardadosComprados] = useState({
    videosComprados: [],
  });
  //SOCKET
  const [notificaciones, setNotificaciones] = useState({})
  const socket = useRef()

  const misVideos = useSelector((state) => state.reducerMostrarMisVideos);
  const videosComprados = useSelector((state) => state.reducerVideosComprados);
  //Enviar datos de usuario logeado
  const dispatch = useDispatch();
  // para pintar button de sidebar
  const pintarButton = useSelector((state) => state.reducerActivarSeccionSideBar.data);


  const handleDesactivarButton = () => {
    dispatch(ActivarSeccionSidebar(false))
  }
  //traer datos usuario
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  let location = useLocation();
  const storage = getStorage();

  useEffect(async () => {
    if (misVideos.data != null && misVideos.data.data != null) {
      videosGuardados.videos = [];
      setImagenUrl([]);
      for (var i = 0; i < misVideos.data.data.length; i++) {
        var gsReference = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          misVideos.data.data[i].path +
          "portada-video.png"
        );
        imagenUrl.push(await getDownloadURL(gsReference));
        setVideosGuardados(
          update(videosGuardados, { videos: { $push: imagenUrl } })
        );
      }
    }
    //setVideosGuardados(imagenUrl);
  }, [misVideos]);

  useEffect(async () => {
    if (datosUser != null && datosUser.userData != null) {
      let gsReferenceImg = ref(storage, "gs://sistemas-delsud.appspot.com/" + datosUser.userData.pathFotoPerfil);
      if (datosUser.userData.pathFotoPerfil == "Sin Foto") {
        setMostrarImagenPerfil("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg")
      }
      if (datosUser.userData.pathFotoPerfil != null) {
        setMostrarImagenPerfil(await getDownloadURL(gsReferenceImg))
      }
    }
  }, [datosUser]);

  useEffect(async () => {
    if (videosComprados.data != null && videosComprados.data.data != null) {
      videosGuardadosComprados.videosComprados = [];
      setImagenUrlComprados([]);
      for (var i = 0; i < videosComprados.data.data.length; i++) {
        var gsReferenceComprados = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          videosComprados.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlComprados.push(await getDownloadURL(gsReferenceComprados));
        setVideosGuardadosComprados(
          update(videosGuardadosComprados, { videosComprados: { $push: imagenUrlComprados } })
        );
      }
    }
  }, [videosComprados]);

  useEffect(() => {
    if (datosUser != null && datosUser.userData != null) {
      const data = {
        idCategoria: "",
        calificacion: "",
        fechaInicio: "",
        fechaFin: "",
        page: 1,
        estado: "",
        urgente: "",
        userId: datosUser.userData.idUser,
      };
      dispatch(getRecibirMisVideos(data));
      const dataMonetizados = {
        busqueda: "",
        idCategoria: "",
        page: 1,
        localidad: "",
        provincia: "",
        fechaInicio: "",
        fechaFin: "",
        urgente: "",
        calificacion: "",
        estado: 1,
        userId: datosUser.userData.idUser,
      };
      dispatch(getRecibirVideosComprados(dataMonetizados));
      dispatch(getCategorias());
    }
  }, [datosUser]);

  useEffect(() => {
    dispatch(getDatosUsuario());
  }, []);

  const vistaMobile = useMediaQuery({
    query: "(min-width: 968px)",
  });

  //NOTIFICACIONES
  const [pageNotificaciones, setPageNotificaciones] = useState(1);
  const listaNotificaciones = useSelector(state => state.reducerListaNotificacionUser.data);

  useEffect(() => {
    if (datosUser != null) {
      const data = {
        page: pageNotificaciones,
        iduser: datosUser.userData.idUser,
      }
      dispatch(getListaNotificacionesUser(data));
    }
  }, [notificaciones]);

  useEffect(() => {
    socket.current = io("wss://enoff.com.ar:8006", {secure: true, reconnect: true, rejectUnauthorized : false})
    //  socket.current = io("ws://localhost:8006")

    socket.current.on("getNotificacion", data => {
      setNotificaciones({
        user_id: data.user_id,
        content: data.contenido,
        estado_id: data.estado,
        fecha_creacion: data.fecha
      })
    })
  }, [])

  useEffect(() => {
    if (datosUser != null) {
      socket.current.emit("addUser", datosUser.userData.idUser)
    }
  }, [datosUser])

  const [cantNotificacion, setCantNotificacion] = useState(0);
  useEffect(() => {
    if (listaNotificaciones != null && listaNotificaciones.data != null) {
      var totalNoVisto = 0;
      for (var i = 0; i < listaNotificaciones.data.length; i++) {
        if (listaNotificaciones.data[i].estado != "Visto") {
          let valor = 1;
          totalNoVisto = totalNoVisto + parseInt(valor);
        }
      }
      setCantNotificacion(totalNoVisto)
    }
  }, [notificaciones, listaNotificaciones]);
  useEffect(() => {
    if (location.pathname == "/User/Politica-de-privacidad" || location.pathname == "/User/Sobre-nosotros" || location.pathname == "/User/Ayuda") {
      setActive("User")
    }
  }, [location.pathname]);


  //ACTUALIZAR VISTA MERCADO PAGO VINCULADO
  useEffect(() => {
    dispatch(getDatosUsuario());
  }, [notificaciones]);

  function DesactivarActivosSidebar() {
    setActive("User")
  }
  
  return (
    <>
      <NavbarEditor dataNotificacion={cantNotificacion} />
      <input type="file" />
      <div className="show-fake-browser sidebar-page">
        <Container>
          {vistaMobile === true ? (
            <Sidebar
              style={{ display: "flex", flexDirection: "column" }}
              width={expand ? 300 : 56}
              collapsible
              className="sidebar-principal"
            >
              <Sidenav.Header>
                <div className="sidebar-header-container" >
                  <NavToggle
                    expand={expand}
                    onChange={() => setExpand(!expand)}
                  />
                  <Link to="Mi-perfil" onClick={DesactivarActivosSidebar}>
                    {expand ? (
                      <div className="sidebar-header-user-container">
                        <div className="sidebar-user-profile">
                          <Avatar
                            circle
                            src={mostrarImagenPerfil}
                            alt="Imagen Usuario"
                          />
                        </div>
                        <div className="sidebar-user-profile-info">
                          <div className="sidebar-user-name">
                            <p className="sidebar-user-info">
                              {datosUser != null
                                ? datosUser.userData.nombreCompleto
                                : ""}
                            </p>
                          </div>
                          <Rate
                            style={{ color: '#DDE100!important' }}
                            className="sidebar-user-rate"
                            readOnly={true}
                            value={datosUser != null ? datosUser.userData.calificacion : ""}
                            size="xs"
                          // character={<AiOutlineStar />}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="sidebar-user-profile-colapse">
                        <Avatar
                          circle
                          src={mostrarImagenPerfil}
                          alt="Imagen Usuario"
                        />
                      </div>
                    )}
                  </Link>
                </div>
              </Sidenav.Header>
              <Sidenav
                expanded={expand}
                defaultOpenKeys={["3"]}
                appearance="subtle"
              >
                <Sidenav.Body>
                  <Nav
                    activeKey={pintarButton === true ? "" : active}
                    onSelect={(selectedKey) => setActive(selectedKey)}
                  >
                    <Nav.Item
                      eventKey="Mis Videos"
                      icon={
                        <img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-videos-blanco_etlg9o.svg" />
                      }
                      as={Link}
                      to="/User"
                      onClick={handleDesactivarButton}
                    >
                      Mis Videos
                    </Nav.Item>
                    <Nav.Item
                      eventKey="Monetizados"
                      icon={<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-monetizados-blanco_qiycjy.svg" />}
                      as={Link}
                      to="Monetizados"
                      onClick={handleDesactivarButton}
                    >
                      Monetizado
                    </Nav.Item>
                    <Nav.Item
                      eventKey="Mis finanzas"
                      icon={<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-finanzas-blanco_hu4va6.svg" />}
                      as={Link}
                      to="Mis-finanzas"
                      className={pintarButton !== false ? "rs-sidenav-item-active" : ""}
                    >
                      Mis finanzas
                    </Nav.Item>
                    <Nav.Item
                      eventKey="Tutoriales"
                      icon={<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-tutoriales-blanco_rcegef.svg" />}
                      target="_blank" rel="noreferrer"
                      href='https://www.youtube.com/channel/UCO8Rk98Yx6F0_0TH4uquSsw'
                      onClick={handleDesactivarButton}
                    >
                      Tutoriales
                    </Nav.Item>
                  </Nav>
                  <Nav >
                    <Nav.Item
                      eventKey="Tutoriales"
                      icon={<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1671193572/EditorPlus/adad_ak1zys.svg" />}
                      onClick={setOpen}
                    >
                      Cerrar sesión
                    </Nav.Item>
                  </Nav>
                </Sidenav.Body>
              </Sidenav>
            </Sidebar>
          ) : (
            ""
          )}
          <Container>
            <Routes path="/*">
              <Route path="/" element={<MisVideos videosGuardados={videosGuardados.videos} misVideos={misVideos} />} />
              <Route path="Monetizados" element={<Monetizados videosGuardadosComprados={videosGuardadosComprados.videosComprados} />} />
              <Route path="/MercadoPago-validacion" element={<MercadoPagoValidado />} />
              <Route path="Mis-finanzas" element={<MisFinanzas notificacion={notificaciones} />} />
              <Route
                path="Mis-finanzas-walletVinculada"
                element={<MisFinanzasVinculada />}
              />
              <Route path="Tutoriales" element={<Destacados />} />
              <Route path="Notificaciones" element={<Notificaciones />} />
              <Route path="Configuracion" element={<Configuracion />} />
              <Route path="Mi-perfil" element={<MiPerfil />} />
              <Route path="Sobre-nosotros" element={<SobreNosotros />} />
              <Route
                path="Politica-de-privacidad"
                element={<PoliticaDePrivacidad />}
              />
              <Route path="Ayuda" element={<Ayuda />} />
              <Route path="Notificaciones" element={<Notificaciones notificaciones={notificaciones} />} />
            </Routes>
          </Container>
        </Container>
        <ModalCerrarSesion open={open} setOpen={setOpen} />
      </div>
    </>
  );
}