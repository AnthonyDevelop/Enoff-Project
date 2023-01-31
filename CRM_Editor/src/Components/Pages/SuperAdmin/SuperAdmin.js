import React, { useState, useEffect } from 'react'
import {
  Routes,
  Route,
} from "react-router-dom";
import { Sidenav, Nav, Navbar, Container, Sidebar } from 'rsuite';
import { getListaNotificacionesUser } from '../../../Actions/listaNotificacionesUser';
import { Link } from "react-router-dom";
import Avatar from 'rsuite/Avatar';
import NavbarEditor from '../../Navbar/Navbar';

//Firebase
import {
  getStorage,
  ref,
  getDownloadURL,
} from "firebase/storage";

//Import css
import 'rsuite/dist/rsuite.min.css';
import ModalCerrarSesion from '../User/ModalCerrarSesion/ModalCerrarSesion';

//React Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineMenuOpen } from "react-icons/md";
import { Modal } from 'rsuite';
import { useMediaQuery } from 'react-responsive'
import update from "react-addons-update";
import { io } from 'socket.io-client'
import { useRef } from "react";
//UseSelector y useDispatch
import { useSelector, useDispatch } from 'react-redux';

//Importar acciones
import { getDatosUsuario } from '../../../Actions/datosUsuario';
import { getAdminRecibirVideos, getAdminRecibirVideosGuardados } from '../../../Actions/SuperAdmin/adminRecibirVideos';
import { getAdminRecibirVideosComprados } from '../../../Actions/SuperAdmin/adminRecibirVideos';
import { getAdminRecibirVideosDestacados } from '../../../Actions/SuperAdmin/adminRecibirVideos';
import { getAdminRecibirVideosDescartados } from '../../../Actions/SuperAdmin/adminRecibirVideos';
import { getListaUsuarios } from '../../../Actions/listUsuarios';
import { getCategorias } from '../../../Actions/categorias';
import { getListaVeedores } from '../../../Actions/SuperAdmin/listaVeedores';
import { getListaEstadisticas } from '../../../Actions/SuperAdmin/listaEstadisticas';

import Explorar from './Pages/Explorar/Explorar';
import Guardado from './Pages/Guardado/Guardado';
import Descartado from './Pages/Descartado/Descartado';
import Destacados from './Pages/Destacados/Destacados';
import AdquiridoSuperAdmin from './Pages/Adquirido/AdquiridoSuperAdmin';
import Usuarios from './Pages/Usuarios/Usuarios';
import Estadisticas from './Pages/Estadisticas/Estadisticas';
import Veedores from './Pages/Administradores/Administradores';
import ConfiguracionPerfilAdmin from './Pages/Usuarios/PerfilUsuarioAdmin/PerfilUsuarioAdmin';
import PerfilUsuario from './Pages/Usuarios/PerfilUsuario/PerfilUsuario';
import Notificaciones from './Pages/Notificaciones/notificaciones';

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

export default function SuperAdmin() {
  const [expand, setExpand] = useState(true);
  const [active, setActive] = useState('default');
  const [open, setOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState({})
  const socket = useRef()


  const dispatch = useDispatch();

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
    const dataVideosExplorar = {
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
      nombreUser: "",
    };
    dispatch(getAdminRecibirVideos(dataVideosExplorar))
  }, []);

  const vistaMobile = useMediaQuery({ query: '(min-width: 980px)' })

  useEffect(() => {
    dispatch(getDatosUsuario());
    dispatch(getCategorias());
    dispatch(getListaEstadisticas())
  }, [])

  useEffect(() => {
    const dataVeedor = {
      nombre: "",
    }
    dispatch(getListaVeedores(dataVeedor));
  }, [])
  //REDUX
  const datosUser = useSelector(state => state.reducerUsuarioDatos.data);
  const listaUsuarios = useSelector((state) => state.reducerListUsuario.data);
  const listaVedores = useSelector((state) => state.reducerListaVeedores.data);

  const storage = getStorage();

  //FOTOS DE PERFIL USUARIOS
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
          var gsReferenceFotoUsuarios = ref(
            storage, "gs://sistemas-delsud.appspot.com/" + listaUsuarios.data[i].pathFotoPerfil
          );
          imagenUrl.push(await getDownloadURL(gsReferenceFotoUsuarios));
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

  //FOTOS DE PERFIL VEEDORES
  const [imagenUrlVedor, setImagenUrlVedor] = useState([]);
  const [imageVedor, setImageVedor] = useState({
    perfilVeedor: [],
  });
  useEffect(async () => {
    if (listaVedores != null && listaVedores.data != null) {
      imageVedor.perfilVeedor = [];
      setImagenUrlVedor([]);

      for (var i = 0; i < listaVedores.data.length; i++) {
        if (listaVedores.data[i].pathFotoPerfil != "Sin Foto") {
          var gsReferenceVeedor = ref(
            storage, "gs://sistemas-delsud.appspot.com/" + listaVedores.data[i].pathFotoPerfil
          );
          imagenUrlVedor.push(await getDownloadURL(gsReferenceVeedor));
          setImageVedor(
            update(imageVedor, { perfilVeedor: { $push: imagenUrlVedor } })
          );
        }
        if (listaVedores.data[i].pathFotoPerfil == "Sin Foto") {
          imagenUrlVedor.push("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg");
          setImageVedor(
            update(imageVedor, { perfilVeedor: { $push: imagenUrlVedor } })
          );
        }
      }
    }
  }, [listaVedores]);


  //FOTO DE PERFIL ADMINISTRADOR
  const [mostrarPerfilAdmin, setMostrarPerfilAdmin] = useState();
  useEffect(async () => {
    if (datosUser.userData.pathFotoPerfil != null) {
      let gsReferenceImg = ref(storage, "gs://sistemas-delsud.appspot.com/" + datosUser.userData.pathFotoPerfil);
      setMostrarPerfilAdmin(await getDownloadURL(gsReferenceImg))
    } else {
      setMostrarPerfilAdmin("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg")
    }
  }, [datosUser]);

  //VIDEOS EXPLORAR ADMINISTRADOR
  const misVideos = useSelector((state) => state.reducerAdminRecibirVideos);
  const [imagenUrlExplorar, setImagenUrlExplorar] = useState([]);
  const [videosExplorarObj, setVideosExplorarObj] = useState({
    videosExplorar: [],
  });
  const [imagenUrlExplorarPerfil, setImagenUrlExplorarPerfil] = useState([]);
  const [imagenExplorarObjPerfil, setImagenExplorarObjPerfil] = useState({
    imagenExplorarPerfil: [],
  });

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


  useEffect(async () => {
    if (misVideos.data != null && misVideos.data.data != null) {
      videosExplorarObj.videosExplorar = [];
      imagenExplorarObjPerfil.imagenExplorarPerfil = [];
      setImagenUrlExplorar([]);
      setImagenUrlExplorarPerfil([]);
      for (var i = 0; i < misVideos.data.data.length; i++) {
        var gsReference = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          misVideos.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlExplorar.push(await getDownloadURL(gsReference));
        setVideosExplorarObj(
          update(videosExplorarObj, { videosExplorar: { $push: imagenUrlExplorar } })
        );

        if (misVideos.data.data[i].pathUserCreador != "Sin Foto") {
          let gsReferenceExplorar = ref(storage, "gs://sistemas-delsud.appspot.com/" + misVideos.data.data[i].pathUserCreador);
          imagenUrlExplorarPerfil.push(await getDownloadURL(gsReferenceExplorar));
        }
        if (misVideos.data.data[i].pathUserCreador == "Sin Foto") {
          imagenUrlExplorarPerfil.push("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg")
        }
        setImagenExplorarObjPerfil(
          update(imagenExplorarObjPerfil, { imagenExplorarPerfil: { $push: imagenUrlExplorarPerfil } })
        );
      }
    }
  }, [misVideos]);

  //VIDEOS ADQUIRIDOS ADMINISTRADOR
  const misVideosAdquiridos = useSelector((state) => state.reducerAdminRecibirVideosComprados);
  const [imagenUrlAdquiridos, setImagenUrlAdquiridos] = useState([]);
  const [videosAdquiridosObj, setVideosAdquiridosObj] = useState({
    videosAdquiridos: [],
  });
  const [imagenUrlAdquiridosPerfil, setImagenUrlAdquiridosPerfil] = useState([]);
  const [imagenAdquiridosObjPerfil, setImagenAdquiridosObjPerfil] = useState({
    imagenAdquiridoPerfil: [],
  });

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
      nombreUser: "",
    };
    dispatch(getAdminRecibirVideosComprados(dataVideosComprados))
  }, []);

  useEffect(async () => {
    if (misVideosAdquiridos.data != null && misVideosAdquiridos.data.data != null) {
      videosAdquiridosObj.videosAdquiridos = [];
      imagenAdquiridosObjPerfil.imagenAdquiridoPerfil = [];
      setImagenUrlAdquiridos([]);
      setImagenUrlAdquiridosPerfil([]);
      for (var i = 0; i < misVideosAdquiridos.data.data.length; i++) {
        var gsReference = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          misVideosAdquiridos.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlAdquiridos.push(await getDownloadURL(gsReference));
        setVideosAdquiridosObj(
          update(videosAdquiridosObj, { videosAdquiridos: { $push: imagenUrlAdquiridos } })
        );

        if (misVideosAdquiridos.data.data[i].pathUserCreador != "Sin Foto") {
          let gsReferenceAdquiridos = ref(storage, "gs://sistemas-delsud.appspot.com/" + misVideosAdquiridos.data.data[i].pathUserCreador);
          imagenUrlAdquiridosPerfil.push(await getDownloadURL(gsReferenceAdquiridos));
        }
        if (misVideosAdquiridos.data.data[i].pathUserCreador == "Sin Foto") {
          imagenUrlAdquiridosPerfil.push("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg")
        }
        setImagenAdquiridosObjPerfil(
          update(imagenAdquiridosObjPerfil, { imagenAdquiridoPerfil: { $push: imagenUrlAdquiridosPerfil } })
        );
      }
    }
  }, [misVideosAdquiridos]);

  //VIDEOS  GUARDADOS
  const misVideosGuardados = useSelector((state) => state.reducerAdminRecibirVideosGuardados);
  const [imagenUrlGuardados, setImagenUrlGuardados] = useState([]);
  const [videosGuardadosObj, setVideosGuardadosObj] = useState({
    videosGuardados: [],
  });
  const [imagenUrlGuardadosPerfil, setImagenUrlGuardadosPerfil] = useState([]);
  const [imagenGuardadosObjPerfil, setImagenGuardadosObjPerfil] = useState({
    imagenGuardadosPerfil: [],
  });

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
      nombreUser: "",
    };
    dispatch(getAdminRecibirVideosGuardados(dataVideosGuardados))
  }, []);

  useEffect(async () => {
    if (misVideosGuardados.data != null && misVideosGuardados.data.data != null) {
      videosGuardadosObj.videosGuardados = [];
      imagenGuardadosObjPerfil.imagenGuardadosPerfil = [];
      setImagenUrlGuardados([]);
      setImagenUrlGuardadosPerfil([]);
      for (var i = 0; i < misVideosGuardados.data.data.length; i++) {
        var gsReference = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          misVideosGuardados.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlGuardados.push(await getDownloadURL(gsReference));
        setVideosGuardadosObj(
          update(videosGuardadosObj, { videosGuardados: { $push: imagenUrlGuardados } })
        );

        if (misVideosGuardados.data.data[i].pathUserCreador != "Sin Foto") {
          let gsReferenceGuardados = ref(storage, "gs://sistemas-delsud.appspot.com/" + misVideosGuardados.data.data[i].pathUserCreador);
          imagenUrlGuardadosPerfil.push(await getDownloadURL(gsReferenceGuardados));
        }
        if (misVideosGuardados.data.data[i].pathUserCreador == "Sin Foto") {
          imagenUrlGuardadosPerfil.push("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svgg")
        }
        setImagenGuardadosObjPerfil(
          update(imagenGuardadosObjPerfil, { imagenGuardadosPerfil: { $push: imagenUrlGuardadosPerfil } })
        );
      }
    }
  }, [misVideosGuardados]);

  //VIDEOS  DESTACADOS
  const misVideosDestacados = useSelector((state) => state.reducerAdminRecibirVideosDestacados);
  const [imagenUrlDestacados, setImagenUrlDestacados] = useState([]);
  const [videosDestacadosObj, setVideosDestacadosObj] = useState({
    videosDestacados: [],
  });
  const [imagenUrlDestacadosPerfil, setImagenUrlDestacadosPerfil] = useState([]);
  const [imagenDestacadosObjPerfil, setImagenDestacadosObjPerfil] = useState({
    imagenDestacadosPerfil: [],
  });

  //Traer Videos Destacados
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
      nombreUser: "",
    };
    dispatch(getAdminRecibirVideosDestacados(dataVideosDestacados))
  }, []);

  useEffect(async () => {
    if (misVideosDestacados.data != null && misVideosDestacados.data.data != null) {
      videosDestacadosObj.videosDestacados = [];
      imagenDestacadosObjPerfil.imagenDestacadosPerfil = [];
      setImagenUrlDestacados([]);
      setImagenUrlDestacadosPerfil([]);
      for (var i = 0; i < misVideosDestacados.data.data.length; i++) {
        var gsReference = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          misVideosDestacados.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlDestacados.push(await getDownloadURL(gsReference));
        setVideosDestacadosObj(
          update(videosDestacadosObj, { videosDestacados: { $push: imagenUrlDestacados } })
        );

        if (misVideosDestacados.data.data[i].pathUserCreador != "Sin Foto") {
          let gsReferenceDestacados = ref(storage, "gs://sistemas-delsud.appspot.com/" + misVideosDestacados.data.data[i].pathUserCreador);
          imagenUrlDestacadosPerfil.push(await getDownloadURL(gsReferenceDestacados));
        }
        if (misVideosDestacados.data.data[i].pathUserCreador == "Sin Foto") {
          imagenUrlDestacadosPerfil.push("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg")
        }
        setImagenDestacadosObjPerfil(
          update(imagenDestacadosObjPerfil, { imagenDestacadosPerfil: { $push: imagenUrlDestacadosPerfil } })
        );
      }
    }
  }, [misVideosDestacados]);

  //VIDEOS DESCARTADOS
  const misVideosDescartados = useSelector((state) => state.reducerAdminRecibirVideosDescartados);
  const [imagenUrlDescartados, setImagenUrlDescartados] = useState([]);
  const [videosDescartadosObj, setVideosDescartadosObj] = useState({
    videosDescartados: [],
  });

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
      nombreUser: "",
    };
    dispatch(getAdminRecibirVideosDescartados(dataVideosDescartados))
  }, []);

  useEffect(async () => {
    if (misVideosDescartados.data != null && misVideosDescartados.data.data != null) {
      videosDescartadosObj.videosDescartados = [];
      imagenDestacadosObjPerfil.imagenDestacadosPerfil = [];
      setImagenUrlDescartados([]);
      setImagenUrlDestacadosPerfil([]);
      for (var i = 0; i < misVideosDescartados.data.data.length; i++) {
        var gsReferenceDescartados = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" +
          misVideosDescartados.data.data[i].path +
          "portada-video.png"
        );
        imagenUrlDescartados.push(await getDownloadURL(gsReferenceDescartados));
        setVideosDescartadosObj(
          update(videosDescartadosObj, { videosDescartados: { $push: imagenUrlDescartados } })
        );
      }
    }
  }, [misVideosDescartados]);

  return (
    <>
      <NavbarEditor dataNotificacion={cantNotificacion} />
      <div className="show-fake-browser sidebar-page">
        {vistaMobile ?
          <Container>
            <Sidebar
              style={{ display: 'flex', flexDirection: 'column' }}
              width={expand ? 260 : 56}
              collapsible
              className='sidebar-principal'
            >
              <Sidenav.Header>
                <div className='sidebar-header-container-admin'>
                  <NavToggle className='subNavbar-boton-collapse' expand={expand} onChange={() => setExpand(!expand)} />
                  <Link to="">
                    {expand
                      ?
                      <div className='sidebar-header-user-container'>
                        <div className='sidebar-user-profile'>
                          <Avatar
                            circle
                            // src={mostrarPerfilAdmin} 
                            src='https://res.cloudinary.com/grupo-delsud/image/upload/v1668771953/Fondo-de-pantalla-GRUPO2_t3w3oj.jpg'
                            alt="Imagen Usuario" />
                        </div>
                        <div className='sidebar-user-profile-info'>
                          <p className='sidebar-admin-info-sidebar'>
                            {datosUser != null
                              ? datosUser.userData.nombreCompleto
                              : ""}
                          </p>
                        </div>
                      </div>
                      :
                      <div className='sidebar-user-profile-colapse'>
                        <Avatar circle src={mostrarPerfilAdmin} alt="Imagen Usuario" />
                      </div>
                    }
                  </Link>
                </div>

              </Sidenav.Header>
              <Sidenav expanded={expand} defaultOpenKeys={['3']} appearance="subtle">
                <Sidenav.Body >
                  <Nav activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)}>
                    <Nav.Item eventKey="Explorar" icon={<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-videos-blanco_etlg9o.svg" />} as={Link} to="Explorar">Explorar</Nav.Item>
                    <Nav.Item eventKey="Usuarios" icon={<img width='30px' height='30px' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1671106036/eleditorNoticias/usuarios_kjqknt.svg' />} as={Link} to="Usuarios">Usuarios</Nav.Item>
                    <Nav.Item eventKey="Adquirido" icon={<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-monetizados-blanco_qiycjy.svg" />} as={Link} to="Adquirido">Adquiridos</Nav.Item>
                    <Nav.Item eventKey="Veedores" icon={<img alt="icono-videos" width='30px' height='30px' src="https://res.cloudinary.com/grupo-delsud/image/upload/v1671106036/eleditorNoticias/vedores_mwgesc.svg" />} as={Link} to="Veedores">Veedores</Nav.Item>
                    <Nav.Item eventKey="Estadisticas" icon={<img width='30px' height='30px' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1670949668/eleditorNoticias/icono-finanzas-blanco_hu4va6.svg' />} as={Link} to="Estadisticas">Estadísticas</Nav.Item>
                    <Nav.Item eventKey="Guardado" icon={<img width='30px' height='30px' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1671103307/eleditorNoticias/tama%C3%B1o_60x60_modo_oscuroaaaa_wzfrx2.svg' />} as={Link} to="Guardado">Guardado</Nav.Item>
                    <Nav.Item eventKey="Destacados" icon={<img width='30px' height='30px' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1671103307/eleditorNoticias/tama%C3%B1o_60x60_modo_oscuro_fu6du5.svg' />} as={Link} to="Destacado">Destacados</Nav.Item>
                    <Nav.Item eventKey="Descartado" icon={<img width='30px' height='30px' src='https://res.cloudinary.com/grupo-delsud/image/upload/v1671103307/eleditorNoticias/tama%C3%B1o_60x6adada_som8bk.svg' />} as={Link} to="Descartado">Descartado</Nav.Item>
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
                <Route index element={<Explorar videosExplorarObj={videosExplorarObj.videosExplorar} imagenExplorarObjPerfil={imagenExplorarObjPerfil.imagenExplorarPerfil} misVideos={misVideos} />} />
                <Route path="Explorar" element={<Explorar videosExplorarObj={videosExplorarObj.videosExplorar} imagenExplorarObjPerfil={imagenExplorarObjPerfil.imagenExplorarPerfil} misVideos={misVideos} />} />
                <Route path="Usuarios" element={<Usuarios fotoPerfiles={image.perfil} />} />
                <Route path="Adquirido" element={<AdquiridoSuperAdmin videosAdquiridosObj={videosAdquiridosObj.videosAdquiridos} imagenAdquiridosObjPerfil={imagenAdquiridosObjPerfil.imagenAdquiridoPerfil} misVideosAdquiridos={misVideosAdquiridos} />} />
                <Route path="Destacado" element={<Destacados videosDestacadosObj={videosDestacadosObj.videosDestacados} imagenDestacadosObjPerfil={imagenDestacadosObjPerfil.imagenDestacadosPerfil} misVideosDestacados={misVideosDestacados} />} />
                <Route path="Guardado" element={<Guardado videosGuardadosObj={videosGuardadosObj.videosGuardados} imagenGuardadosObjPerfil={imagenGuardadosObjPerfil.imagenGuardadosPerfil} misVideosGuardados={misVideosGuardados} />} />
                <Route path="Descartado" element={<Descartado videosDescartadosObj={videosDescartadosObj.videosDescartados} misVideosDescartados={misVideosDescartados} />} />
                <Route path="Estadisticas" element={<Estadisticas fotoPerfiles={image.perfil} />} />
                <Route path="Veedores" element={<Veedores fotoPerfiles={imageVedor.perfilVeedor} />} />
                <Route path="perfil-usuario-veedor" element={<PerfilUsuario />} />
                <Route path="perfil-usuarios" element={<ConfiguracionPerfilAdmin />} />
                <Route path="Notificaciones" element={<Notificaciones />} />
                {/* <Route path="perfil-administrador" element={<PerfilAdministrador />} /> */}
              </Routes>
            </Container>
            <ModalCerrarSesion
              open={open}
              setOpen={setOpen}
            />
          </Container>
          :
          <>
            <div style={{ height: '80vh' }}>
              <Modal backdrop="static" size='xs' open={true} >
                <Modal.Header style={{ textAlign: 'center !important' }}>
                  <Modal.Title> Vista no disponible!</Modal.Title>
                </Modal.Header>
              </Modal>
            </div>
          </>

        }
      </div>
    </>
  );
}
