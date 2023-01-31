import React, { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  HashRouter,
} from "react-router-dom";
import { Sidenav, Nav, Navbar, Container, Sidebar } from 'rsuite';
import { Link, NavLink } from "react-router-dom";
import Avatar from 'rsuite/Avatar';
import { Modal, Button, Placeholder } from 'rsuite';
import update from "react-addons-update";
import NavbarEditor from '../../Navbar/Navbar';
import { io } from 'socket.io-client'
import { useRef } from "react";

//Import css
import 'rsuite/dist/rsuite.min.css';
import './AdminContenido.css'
import ModalCerrarSesion from '../User/ModalCerrarSesion/ModalCerrarSesion';

//React Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineMenuOpen } from "react-icons/md";
//Firebase
import {
  getStorage,
  ref,
  getDownloadURL,
} from "firebase/storage";

//UseSelector y useDispatch
import { useSelector, useDispatch } from 'react-redux';

//Importar acciones
import { getDatosUsuario } from '../../../Actions/datosUsuario';
import { getVeedorRecibirMisVideos } from '../../../Actions/veedorRecibirVideos';
import { getVeedorRecibirVideosComprados } from '../../../Actions/veedorRecibirVideos';
import { getVeedorRecibirVideosGuardados } from '../../../Actions/veedorRecibirVideos';
import { getVeedorRecibirVideosTendencias } from '../../../Actions/veedorRecibirVideos';
import { getVeedorRecibirVideosDescartado } from '../../../Actions/veedorRecibirVideos';
import { getVeedorRecibirVideosDestacados } from '../../../Actions/veedorRecibirVideos';
import { getListaUsuarios } from '../../../Actions/listUsuarios';
import { getListaPeriodistas } from '../../../Actions/VedorListaPeriodistas';
import { getListaPeriodistasDisponibles } from '../../../Actions/VedorListaPeriodistasDisponibles';
import { getCategorias } from '../../../Actions/categorias';
import { getListaNotificacionesUser } from '../../../Actions/listaNotificacionesUser';

import { useMediaQuery } from 'react-responsive'
import Explorar from './Pages/Explorar/Explorar';
import Adquirido from './Pages/Adquirido/Adquirido';
import Tendencia from './Pages/Tendencia/Tendencia';
import Guardado from './Pages/Guardado/Guardado';
import Descartado from './Pages/Descartado/Descartado';
import Destacados from './Pages/Destacados/Destacados';
import Periodistas from './Pages/Periodistas/Periodistas';
import Usuarios from './Pages/Usuarios/Usuarios';
import PoliticasDePrivacidad from './Pages/PoliticasDePrivacidad/PoliticasDePrivacidad';
import Ayuda from './Pages/Ayuda/Ayuda';
import PerfilUsuarioAdmin from './Pages/Usuarios/PerfilUsuarioAdmin/PerfilUsuarioAdmin';
import ConfiguracionPerfilAdmin from './Pages/Usuarios/ConfiguracionPerfilAdmin/ConfiguracionPerfilAdmin';
import PerfilUsuario from './Pages/Usuarios/PerfilUsuario/PerfilUsuario';
import Notificaciones from './Pages/Notificaciones/Notificaciones';

const iconStyles = {
  width: 56,
  height: 56,
  padding: 18,
  lineHeight: '56px',
  textAlign: 'center',
};

const NavToggle = ({ expand, onChange }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Navbar.Body>
        <Nav className='icono-cerrar-sidebar'>
          <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
            {expand ? <MdOutlineMenuOpen color='white' fontSize={30} /> : <GiHamburgerMenu color='white' fontSize={30} />}
          </Nav.Item>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};

export default function User() {
  const [expand, setExpand] = useState(true);
  const [active, setActive] = useState('default');
  const [open, setOpen] = useState(false);
  //const [mostrarImagenPerfil, setMostrarImagenPerfil] = useState();
  const [imagenUrlExplorar, setImagenUrlExplorar] = useState([]);
  const [imagenUrlComprados, setImagenUrlComprados] = useState([]);
  const [imagenUrlVideosGuardados, setImagenUrlVideosGuardados] = useState([]);
  const [imagenUrlVideosTendencia, setImagenUrlVideosTendencia] = useState([]);
  const [imagenUrlVideosDescartado, setImagenUrlVideosDescartado] = useState([]);
  const [imagenUrlVideosDestacados, setImagenUrlVideosDestacados] = useState([]);
  const [videosGuardados, setVideosGuardados] = useState({
    videos: [],
  });
  const [videosGuardadosComprados, setVideosGuardadosComprados] = useState({
    videosComprados: [],
  });
  const [videosGuardadosObj, setVideosGuardadosObj] = useState({
    videosGuardadosGuardados: [],
  });
  const [videosTendenciaObj, setVideosTendenciaObj] = useState({
    videosTendencia: [],
  });
  const [videosDescartadoObj, setVideosDescartadoObj] = useState({
    videosDescartados: [],
  });

  const [videosDetacadosObj, setVideosDestacadosoObj] = useState({
    videosDestacados: [],
  });
  const [notificaciones, setNotificaciones] = useState({})
  const socket = useRef()

  const [page, setPage] = useState(1);

  //Enviar datos de usuario logeado
  /*TRAER VIDEOS DE FIREBASE Y BD*/

  const misVideos = useSelector((state) => state.reducerVeedorRecibirVideos);
  const videosComprados = useSelector((state) => state.reducerVeedorRecibirVideosComprados);
  const listaVideosGuardados = useSelector((state) => state.reducerVeedorRecibirVideosGuardados);
  const videosTendencia = useSelector((state) => state.reducerVeedorRecibirVideosTendencias);
  const listaVideosDescartados = useSelector((state) => state.reducerVeedorRecibirVideosDescartados);
  const listaVideosDestacados = useSelector((state) => state.reducerVeedorRecibirVideosDestacados);

  const dispatch = useDispatch();

  useEffect(async () => {
    if (misVideos.data != null && misVideos.data.data != null) {
      videosGuardados.videos = [];
      setImagenUrlExplorar([]);
      for (var i = 0; i < misVideos.data.data.length; i++) {
        var gsReference = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          misVideos.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlExplorar.push(await getDownloadURL(gsReference));
        setVideosGuardados(
          update(videosGuardados, { videos: { $push: imagenUrlExplorar } })
        );
      }
    }
  }, [misVideos]);

  useEffect(() => {
    const data = {
      nombre: "",
      page: 1,
      calificacion: '',
      localidad: "",
      provincia: "",
    }
    dispatch(getListaUsuarios(data));
  }, [])


  useEffect(() => {
    dispatch(getDatosUsuario());
    dispatch(getCategorias());
    dispatch(getListaPeriodistasDisponibles());
  }, [])

  useEffect(() => {
    const dataPeriodista = {
      idCategoria: '',
      page: 1
    }
    dispatch(getListaPeriodistas(dataPeriodista));
  }, [])


  //REDUX
  const datosUser = useSelector(state => state.reducerUsuarioDatos.data);
  const listaUsuarios = useSelector((state) => state.reducerListUsuario.data);
  const listaPeriodistas = useSelector((state) => state.reducerListPeriodistas.data);
  const listaPeriodistasDisponibles = useSelector((state) => state.reducerListPeriodistasDisponibles.data);
  const respuestaBotones = useSelector((state) => state.reducerActualizarVistaReproductor.data);
  const storage = getStorage();

  //FOTOS DE PERFIL USUARIOS
  const [mostrarImagenPerfil, setMostrarImagenPerfil] = useState();
  const [imagenUrl, setImagenUrl] = useState([]);
  const [image, setImage] = useState({
    perfil: [],
  });
  useEffect(async () => {
    if (listaUsuarios != null && listaUsuarios.data != null) {
      image.perfil = [];
      setImagenUrl([]);

      for (var i = 0; i < listaUsuarios.data.length; i++) {
        if (listaUsuarios.data[i].pathFotoPerfil != "Sin Foto") {
          var gsReference = ref(
            storage, "gs://sistemas-delsud.appspot.com/" + listaUsuarios.data[i].pathFotoPerfil
          );
          imagenUrl.push(await getDownloadURL(gsReference));
          setImage(
            update(image, { perfil: { $push: imagenUrl } })
          );
        }
        if (listaUsuarios.data[i].pathFotoPerfil == "Sin Foto") {
          imagenUrl.push("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg");
          setImage(
            update(image, { perfil: { $push: imagenUrl } })
          );
        }
      }
    }
  }, [listaUsuarios]);

  //FOTOS DE PERFIL PERIODISTAS
  const [fotoPeriodista, setFotoPeriodista] = useState([]);
  const [periodista, setPeriodista] = useState({
    perfil: [],
  });
  useEffect(async () => {
    if (listaPeriodistas != null && listaPeriodistas.data != null) {
      periodista.perfil = [];
      setFotoPeriodista([]);
      for (var i = 0; i < listaPeriodistas.data.length; i++) {
        if (listaPeriodistas.data[i].pathFotoPerfil != null) {
          var gsReferencePeriodista = ref(
            storage, "gs://sistemas-delsud.appspot.com/" + listaPeriodistas.data[i].pathFotoPerfil
          );
          fotoPeriodista.push(await getDownloadURL(gsReferencePeriodista));
          setPeriodista(
            update(image, { perfil: { $push: fotoPeriodista } })
          );
        }
        if (listaPeriodistas.data[i].pathFotoPerfil == null) {
          fotoPeriodista.push("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg");
          setPeriodista(
            update(image, { perfil: { $push: fotoPeriodista } })
          );
        }
      }
    }
  }, [listaPeriodistas]);

  //FOTO DE PERFIL DEL VEEDOR
  useEffect(async () => {
    if (datosUser != null && datosUser.userData.pathFotoPerfil != null) {
      let gsReferenceImg = ref(storage, "gs://sistemas-delsud.appspot.com/" + datosUser.userData.pathFotoPerfil);
      setMostrarImagenPerfil(await getDownloadURL(gsReferenceImg))
    } else {
      setMostrarImagenPerfil("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg")
    }
  }, [datosUser]);

  useEffect(() => {
    socket.current = io("wss://enoff.com.ar:8006", {secure: true, reconnect: true, rejectUnauthorized : false})
    // socket.current = io("ws://localhost:8006")

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

  //NOTIFICACIONES
  const listaNotificaciones = useSelector(state => state.reducerListaNotificacionUser.data);
  const [pageNotificaciones, setPageNotificaciones] = useState(1);
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
    dispatch(getDatosUsuario());
  }, [notificaciones]);

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
    const dataVideo = {
      titulo: "",
      idCategoria: "",
      page: 1,
      fechaInicio: "",
      fechaFin: "",
      calificacion: "",
      localidad: "",
      provincia: "",
      idestado: "",
      urgente: "",
      iduser: "",
    };
    dispatch(getVeedorRecibirMisVideos(dataVideo))
  }, []);


  //Portada de videos Comprados  
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
    //setVideosGuardados(imagenUrl);
  }, [videosComprados]);

  //Traer Videos Comprados
  useEffect(() => {
    const dataVideosComprados = {
      titulo: "",
      idCategoria: "",
      page: 1,
      fechaInicio: "",
      fechaFin: "",
      calificacion: "",
      localidad: "",
      provincia: "",
      idestado: 1,
      urgente: "",
      iduser: "",

    };
    dispatch(getVeedorRecibirVideosComprados(dataVideosComprados))
  }, []);

  //Traer Videos Guardados
  useEffect(() => {
    const dataVideosGuardados = {
      titulo: "",
      idCategoria: "",
      page: 1,
      fechaInicio: "",
      fechaFin: "",
      calificacion: "",
      localidad: "",
      provincia: "",
      idestado: 5,
      urgente: "",
      iduser: "",
    };
    dispatch(getVeedorRecibirVideosGuardados(dataVideosGuardados))
  }, []);

  //Portada de videos Guardados  
  useEffect(async () => {
    if (listaVideosGuardados.data != null && listaVideosGuardados.data.data != null) {
      videosGuardadosObj.videosGuardadosGuardados = [];
      setImagenUrlVideosGuardados([]);
      for (var i = 0; i < listaVideosGuardados.data.data.length; i++) {
        var gsReferenceGuardados = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          listaVideosGuardados.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlVideosGuardados.push(await getDownloadURL(gsReferenceGuardados));
        setVideosGuardadosObj(
          update(videosGuardadosObj, { videosGuardadosGuardados: { $push: imagenUrlVideosGuardados } })
        );
      }
    }
  }, [listaVideosGuardados]);

  //Traer Videos Tendencias
  useEffect(() => {
    const dataVideosTendencias = {
      titulo: "",
      idCategoria: "",
      page: 1,
      fechaInicio: "",
      fechaFin: "",
      calificacion: "",
      localidad: "",
      provincia: "",
      idestado: "",
      urgente: true,
      iduser: "",
    };
    dispatch(getVeedorRecibirVideosTendencias(dataVideosTendencias))
  }, []);

  //Portada de videos Tendencias  
  useEffect(async () => {
    if (videosTendencia.data != null && videosTendencia.data.data != null) {
      videosTendenciaObj.videosGuardadosGuardados = [];
      setImagenUrlVideosTendencia([]);
      for (var i = 0; i < videosTendencia.data.data.length; i++) {
        var gsReferenceTendencia = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          videosTendencia.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlVideosTendencia.push(await getDownloadURL(gsReferenceTendencia));
        setVideosTendenciaObj(
          update(videosTendenciaObj, { videosTendencia: { $push: imagenUrlVideosTendencia } })
        );
      }
    }
  }, [videosTendencia]);

  //Traer Videos Descartados
  useEffect(() => {
    const dataVideosDescartados = {
      titulo: "",
      idCategoria: "",
      page: 1,
      fechaInicio: "",
      fechaFin: "",
      calificacion: "",
      localidad: "",
      provincia: "",
      idestado: 3,
      urgente: "",
      iduser: "",
    };
    dispatch(getVeedorRecibirVideosDescartado(dataVideosDescartados))
  }, []);

  //Portada de videos Descartados  
  useEffect(async () => {
    if (listaVideosDescartados.data != null && listaVideosDescartados.data.data != null) {
      videosDescartadoObj.videosDescartados = [];
      setImagenUrlVideosDescartado([]);
      for (var i = 0; i < listaVideosDescartados.data.data.length; i++) {
        var gsReferenceDescartado = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          listaVideosDescartados.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlVideosDescartado.push(await getDownloadURL(gsReferenceDescartado));
        setVideosDescartadoObj(
          update(videosDescartadoObj, { videosDescartados: { $push: imagenUrlVideosDescartado } })
        );
      }
    }
  }, [listaVideosDescartados]);

  // Traer Videos Destacados
  useEffect(() => {
    const dataVideosDestacados = {
      titulo: "",
      idCategoria: "",
      page: 1,
      fechaInicio: "",
      fechaFin: "",
      calificacion: "",
      localidad: "",
      provincia: "",
      idestado: 6,
      urgente: "",
      iduser: "",
    };
    dispatch(getVeedorRecibirVideosDestacados(dataVideosDestacados))
  }, []);

  //Portada de videos Destacados  
  useEffect(async () => {
    if (listaVideosDestacados.data != null && listaVideosDestacados.data.data != null) {
      videosDetacadosObj.videosDestacados = [];
      setImagenUrlVideosDestacados([]);
      for (var i = 0; i < listaVideosDestacados.data.data.length; i++) {
        var gsReferenceDestacados = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          listaVideosDestacados.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlVideosDestacados.push(await getDownloadURL(gsReferenceDestacados));
        setVideosDestacadosoObj(
          update(videosDetacadosObj, { videosDestacados: { $push: imagenUrlVideosDestacados } })
        );
      }
    }
  }, [listaVideosDestacados]);

  const vistaMobile = useMediaQuery({
    query: '(min-width: 1140px)'

  })
  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        data-aos="fade-zoom-in"
        data-aos-easing="ease-in-back"
        data-aos-duration="1000"
        data-aos-offset="0">
        <NavbarEditor dataNotificacion={cantNotificacion} />
        <div className="show-fake-browser sidebar-page">
          {vistaMobile ?
            <Container>
              <Sidebar style={{ display: 'flex', flexDirection: 'column' }} width={expand ? 260 : 56} collapsible className='sidebar-principal'>
                <Sidenav.Header>
                  <div className='sidebar-header-container-admin'>
                    <NavToggle className='subNavbar-boton-collapse' expand={expand} onChange={() => setExpand(!expand)} />
                    <Link to="Configuracion-perfil-Admin">
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
                      )
                      }
                    </Link>
                  </div>

                </Sidenav.Header>
                <Sidenav expanded={expand} defaultOpenKeys={['3']} appearance="subtle">
                  <Sidenav.Body >
                    <Nav activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)}>
                      <Nav.Item eventKey="Explorar" icon={<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-videos-blanco_etlg9o.svg" />} as={Link} to="Explorar">Explorar</Nav.Item>
                      <Nav.Item eventKey="Adquirido" icon={<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-monetizados-blanco_qiycjy.svg" />} as={Link} to="Adquiridos">Adquirido</Nav.Item>
                      <Nav.Item eventKey="Destacados" icon={<img width='30px' height='30px' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1671103307/eleditorNoticias/tama%C3%B1o_60x60_modo_oscuro_fu6du5.svg' />} as={Link} to="Destacados">Destacados</Nav.Item>
                      <Nav.Item eventKey="Tendencia" icon={<img width='30px' height='30px' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1671103307/eleditorNoticias/tama%C3%B1o_60x60_dasd_xpb1lk.svg' />} as={Link} to="Tendencia">Tendencia</Nav.Item>
                      <Nav.Item eventKey="Guardado" icon={<img width='30px' height='30px' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1671103307/eleditorNoticias/tama%C3%B1o_60x60_modo_oscuroaaaa_wzfrx2.svg' />} as={Link} to="Guardado">Guardado</Nav.Item>
                      <Nav.Item eventKey="Descartado" icon={<img width='30px' height='30px' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1671103307/eleditorNoticias/tama%C3%B1o_60x6adada_som8bk.svg' />} as={Link} to="Descartados">Descartado</Nav.Item>
                    </Nav>
                    <Nav>
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
              <Container>
                <Routes path="/*">
                  <Route path="Explorar" element={<Explorar videosGuardados={videosGuardados.videos} misVideos={misVideos} fotoPerfilesPeriodistas={periodista.perfil} />} />
                  <Route path="Adquiridos" element={<Adquirido videosGuardadosComprados={videosGuardadosComprados.videosComprados} videosComprados={videosComprados} />} />
                  <Route path="Destacados" element={<Destacados videosGuardadosDestacados={videosDetacadosObj.videosDestacados} misVideosDestacados={listaVideosDestacados} fotoPerfilesPeriodistas={periodista.perfil} />} />
                  <Route path="Tendencia" element={<Tendencia videosGuardadosGuardados={videosTendenciaObj.videosTendencia} misVideosTendencia={videosTendencia} fotoPerfilesPeriodistas={periodista.perfil} />} />
                  <Route path="Guardado" element={<Guardado videosGuardadosGuardados={videosGuardadosObj.videosGuardadosGuardados} misVideosGuardados={listaVideosGuardados} />} />
                  <Route path="Descartados" element={<Descartado videosGuardadosDescartados={videosDescartadoObj.videosDescartados} misVideosDescartados={listaVideosDescartados} />} />
                  <Route path="Periodistas" element={<Periodistas fotoPerfilesPeriodistas={periodista.perfil} dataPeriodistasDisponibles={listaPeriodistasDisponibles} dataPeriodistasAsignados={listaPeriodistas} />} />
                  <Route path="Usuarios" element={<Usuarios fotoPerfiles={image.perfil} />} />
                  <Route path="Usuario" element={<PerfilUsuarioAdmin />} />
                  <Route path="Configuracion-perfil-Admin" element={<ConfiguracionPerfilAdmin perfilUser={mostrarImagenPerfil} />} />
                  <Route path="Politicas-de-Privacidad" element={<PoliticasDePrivacidad />} />
                  <Route path="Ayuda" element={<Ayuda />} />
                  <Route path="perfil-usuario" element={<PerfilUsuario />} />
                  <Route path="Notificaciones" element={<Notificaciones />} />
                </Routes>
              </Container>
              <ModalCerrarSesion open={open} setOpen={setOpen} />
            </Container>
            :
            <>
              <div style={{ height: '80vh' }}>
                <Modal backdrop="static" size='xs' open={true} className='modal-vista-no-disponible' >
                  <Modal.Header>
                    <Modal.Title style={{ textAlign: 'center !important' }}> Vista no disponible!</Modal.Title>
                  </Modal.Header>
                </Modal>
              </div>
            </>

          }
        </div>
      </div>
    </>
  );
}
