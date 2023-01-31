import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Badge } from 'rsuite';
import { useLocation } from "react-router-dom";
import "./navbar.css";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';

import { MdOutlineCancel } from "react-icons/md";
import { getListaNotificacionesUser } from "../../Actions/listaNotificacionesUser";
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  NavDropdown,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { Avatar, Rate } from "rsuite";
import ModalCerrarSesion from "../Pages/User/ModalCerrarSesion/ModalCerrarSesion";

//Firebase
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

export default function NavbarEditor({ dataNotificacion, active, setActive }) {
  const dispatch = useDispatch();
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  let location = useLocation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);
  const [mostrarImagenPerfil, setMostrarImagenPerfil] = useState();
  const [open, setOpen] = useState(false);

  const cantNotificacion = dataNotificacion;

  const ScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const storage = getStorage();

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
  
  const vistaMobile = useMediaQuery({
    query: "(min-width: 968px)",
  });

  return (
    <>
      {location.pathname === "/" || location.pathname === "/*" || location.pathname === "/User/MercadoPago-validacion" ?
        ''
        :
        <Navbar className="navbar-top" collapseOnSelect key={"xl"} expand="xl">

          {datosUser != null &&
            datosUser.userData.roles[0] == "ROLE_USER" ?
            <img
              className="botonMenuResponsive me-2"
              src="https://res.cloudinary.com/grupo-delsud/image/upload/v1665090140/EditorPlus/Group_1_plz4so.svg"
              width={"35px"}
              variant="primary"
              onClick={toggleShow}
            /> : ''
          }
          {datosUser != null &&
            datosUser.userData.roles[0] == "ROLE_USER" ?
            <Link to="/" className="contenedor-logo-editor-mobile">
              <img
                className="logoEditor"
                onClick={ScrollToTop}
                alt="logo"
                src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670859147/EditorPlus/logoEnOff_jj0d3g.svg"
              />
            </Link>
            :
            <Link to="/" className="contenedor-logo-editor-mobile-100">
              <img
                className="logoEditor"
                onClick={ScrollToTop}
                alt="logo"
                src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670859147/EditorPlus/logoEnOff_jj0d3g.svg"
              />
            </Link>
          }



          {datosUser != null && datosUser.userData.roles[0] === "ROLE_USER" && !vistaMobile ?
            <NavLink
              className="contenedor-notificaciones-mobile"
              to="Notificaciones"
            >
              <IoMdNotificationsOutline fontSize={30} />
            </NavLink>
            : ''
          }
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header>
              <Offcanvas.Title
                className="offcanvasLogo"
                id={`offcanvasNavbarLabel-expand-${"md"}`}
              >
                <MdOutlineCancel
                  color="#DA643A"
                  fontSize="30"
                  fontWeight={200}
                  onClick={toggleShow}
                />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body onHide={handleClose}>
              {datosUser != null &&
                datosUser.userData.roles[0] == "ROLE_USER" ? (
                <Nav
                  className="navbar-links-desktop"
                  activeKey={active}
                  onSelect={(selectedKey) => setActive(selectedKey)}
                >
                  <div className="box-offcanvas-foto">
                    <Link to='/User/Mi-perfil' className="sidebar-user-profile" onClick={() => {
                          handleClose();
                          ScrollToTop();
                        }}>
                      <Avatar
                        circle

                        src={mostrarImagenPerfil}
                        alt="Imagen Usuario"
                        className="avatar-offcanvas"
                      />
                    </Link>
                    <div className="sidebar-user-profile-info">
                      <Link
                        className="mobile-sidebar-avatar"
                        to="/User/Mi-perfil"
                        onClick={() => {
                          handleClose();
                          ScrollToTop();
                        }}
                      >
                        <div className="sidebar-user-name">
                          <p className="sidebar-user-info">
                            {datosUser != null
                              ? datosUser.userData.nombreCompleto
                              : ""}
                          </p>
                        </div>
                      </Link>
                      <Rate
                        className="sidebar-user-rate"
                        readOnly={true}
                        style={{ color: "#DDE100!important" }}
                        value={
                          datosUser != null
                            ? datosUser.userData.calificacion
                            : ""
                        }
                        size="xs"
                      />
                    </div>
                  </div>

                  <div className="box-link-offcanvas">
                    <NavLink
                      onClick={() => {
                        handleClose();
                        ScrollToTop();
                      }}
                      className="sidebar-footer-item"
                      eventKey="Configuración"
                      to="/User/Sobre-nosotros"
                    >
                      Sobre Nosotros
                    </NavLink>
                    <NavLink
                      onClick={() => {
                        handleClose();
                        ScrollToTop();
                      }}
                      className="sidebar-footer-item"
                      eventKey="Sobre Nosotros"
                      to="/User/Politica-de-privacidad"
                    >
                      Políticas de privacidad
                    </NavLink>
                    <NavLink
                      onClick={() => {
                        handleClose();
                        ScrollToTop();
                      }}
                      className="sidebar-footer-item"
                      eventKey="Políticas"
                      to="Ayuda"
                    >
                      Ayuda
                    </NavLink>
                    {vistaMobile == true ? (
                      cantNotificacion != null && cantNotificacion > 0 ?
                        <NavLink className="contenedor-notificaciones" to="Notificaciones">
                          <Badge className="punto-notificacion" color="green"> </Badge>
                          <img alt="icono-notifiacion" src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670951423/eleditorNoticias/notificacion-blanco_jlvbsl.svg" width='40px' />
                        </NavLink>
                        :
                        <NavLink className="contenedor-notificaciones" to="Notificaciones">
                          <img alt="icono-notifiacion" src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670951423/eleditorNoticias/notificacion-blanco_jlvbsl.svg" width='40px' />
                        </NavLink>
                    ) : (
                      <NavLink className="sidebar-footer-item" onClick={setOpen}>
                        Cerrar sesión
                      </NavLink>
                    )}
                  </div>
                </Nav>
              ) : (
                ""
              )}
              {datosUser != null &&
                datosUser.userData.roles[0] == "ROLE_VEDOR" ? (
                <Nav
                  className="navbar-links-desktop"
                  activeKey={active}
                  onSelect={(selectedKey) => setActive(selectedKey)}
                >
                  <div className="box-offcanvas-foto">
                    <div className="sidebar-user-profile">
                      <img
                        circle
                        src={mostrarImagenPerfil}
                        alt="Imagen Usuario"
                        className="avatar-offcanvas"
                      />
                    </div>
                    <div className="sidebar-user-profile-info">
                      <Link
                        className="mobile-sidebar-avatar"
                        to="/User/Mi-perfil"
                        onClick={() => {
                          handleClose();
                          ScrollToTop();
                        }}
                      >
                        <div className="sidebar-user-name">
                          <p className="sidebar-user-info">
                            {datosUser != null
                              ? datosUser.userData.nombreCompleto
                              : ""}
                          </p>
                        </div>
                      </Link>
                      <Rate
                        className="sidebar-user-rate"
                        style={{ color: "#DDE100!important" }}
                        readOnly={true}
                        value={
                          datosUser != null
                            ? datosUser.userData.calificacion
                            : ""
                        }
                        size="xs"
                      />
                    </div>
                  </div>
                  <div className="box-link-offcanvas">
                    <NavLink
                      onClick={() => {
                        handleClose();
                        ScrollToTop();
                      }}
                      className={({ isActive }) =>
                        isActive
                          ? "active sidebar-footer-item"
                          : "sidebar-footer-item"
                      }
                      eventKey="Periodistas"
                      to="/AdminContenido/Periodistas"
                    >
                      Periodistas
                    </NavLink>
                    <NavLink
                      onClick={() => {
                        handleClose();
                        ScrollToTop();
                      }}
                      className={({ isActive }) =>
                        isActive
                          ? "active sidebar-footer-item"
                          : "sidebar-footer-item"
                      }
                      eventKey="Usuarios"
                      to="/AdminContenido/Usuarios"
                    >
                      Usuarios
                    </NavLink>
                    <NavLink
                      onClick={() => {
                        handleClose();
                        ScrollToTop();
                      }}
                      className={({ isActive }) =>
                        isActive
                          ? "active sidebar-footer-item"
                          : "sidebar-footer-item"
                      }
                      eventKey="Politicas-De-Privacidad"
                      to="/AdminContenido/Politicas-De-Privacidad"
                    >
                      Políticas de privacidad
                    </NavLink>
                    <NavLink
                      onClick={() => {
                        handleClose();
                        ScrollToTop();
                      }}
                      className={({ isActive }) =>
                        isActive
                          ? "active sidebar-footer-item"
                          : "sidebar-footer-item"
                      }
                      eventKey="Ayuda"
                      to="/AdminContenido/Ayuda"
                    >
                      Ayuda
                    </NavLink>
                    {vistaMobile == true ? (
                      cantNotificacion != null && cantNotificacion > 0 ?
                        <NavLink className="contenedor-notificaciones" to="Notificaciones">
                          <Badge className="punto-notificacion" color="green"> </Badge>
                          {/* <IoMdNotificationsOutline fontSize={30} /> */}
                          <img alt="icono-notifiacion" src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670951423/eleditorNoticias/notificacion-blanco_jlvbsl.svg" width='40px' />
                        </NavLink>
                        :
                        <NavLink className="contenedor-notificaciones" to="Notificaciones">
                          {/* <IoMdNotificationsOutline style={{ color: 'white' }} fontSize={30} /> */}
                          <img alt="icono-notifiacion" src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670951423/eleditorNoticias/notificacion-blanco_jlvbsl.svg" width='40px' />
                        </NavLink>
                    ) : (
                      <NavLink className="sidebar-footer-item" onClick={setOpen}>
                        Cerrar sesión
                      </NavLink>
                    )}
                  </div>
                </Nav>
              ) : (
                ""
              )}
              {datosUser != null &&
                datosUser.userData.roles[0] == "ROLE_ADMIN" ? (
                <Nav
                  className="navbar-links-desktop"
                  activeKey={active}
                  onSelect={(selectedKey) => setActive(selectedKey)}
                >
                  <div className="box-offcanvas-foto">
                    <div className="sidebar-user-profile">
                      <img
                        circle
                        src={mostrarImagenPerfil}
                        alt="Imagen Usuario"
                        className="avatar-offcanvas"
                      />
                    </div>
                    <div className="sidebar-user-profile-info">
                      <Link
                        className="mobile-sidebar-avatar"
                        to="/User/Mi-perfil"
                        onClick={() => {
                          handleClose();
                          ScrollToTop();
                        }}
                      >
                        <div className="sidebar-user-name">
                          <p className="sidebar-user-info">
                            {datosUser != null
                              ? datosUser.userData.nombreCompleto
                              : ""}
                          </p>
                        </div>
                      </Link>
                      <Rate
                        className="sidebar-user-rate"
                        style={{ color: "#DDE100!important" }}
                        readOnly={true}
                        value={
                          datosUser != null
                            ? datosUser.userData.calificacion
                            : ""
                        }
                        size="xs"
                      />
                    </div>
                  </div>
                  <div className="box-link-offcanvas">
                    {vistaMobile == true ? (
                      cantNotificacion != null && cantNotificacion > 0 ?
                        <NavLink className="contenedor-notificaciones" to="Notificaciones">
                          <Badge className="punto-notificacion" color="green"> </Badge>
                          {/* <IoMdNotificationsOutline fontSize={30} /> */}
                          <img alt="icono-notifiacion" src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670951423/eleditorNoticias/notificacion-blanco_jlvbsl.svg" width='40px' />
                        </NavLink>
                        :
                        <NavLink className="contenedor-notificaciones" to="Notificaciones">
                          {/* <IoMdNotificationsOutline style={{ color: 'white' }} fontSize={30} /> */}
                          <img alt="icono-notifiacion" src="https://res.cloudinary.com/grupo-delsud/image/upload/v1670951423/eleditorNoticias/notificacion-blanco_jlvbsl.svg" width='40px' />
                        </NavLink>
                    ) : (
                      <NavLink className="sidebar-footer-item" onClick={setOpen}>
                        Cerrar sesión
                      </NavLink>
                    )}
                  </div>
                </Nav>
              ) : (
                ""
              )}
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          <ModalCerrarSesion open={open} setOpen={setOpen} />
        </Navbar>
      }
    </>
  );
}
