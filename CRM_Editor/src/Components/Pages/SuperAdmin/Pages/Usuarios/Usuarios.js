import React, { useState, useEffect } from "react";
import "./usuarios.css";
import {
  Input,
  InputGroup,
  AvatarGroup,
  Avatar,
  Rate,
  SelectPicker,
  Pagination,
} from "rsuite";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SearchIcon from "@rsuite/icons/Search";
import Select from "react-select";
import { getListaUsuarios } from "../../../../../Actions/listUsuarios";
import { HiLocationMarker } from "react-icons/hi";

function Usuarios(props, { isLoading }) {
  const fotoPerfilUsuarios = props.fotoPerfiles;
  const [buscador, setBuscador] = useState("");
  const [filtrosActivados, setFiltrosActivados] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [filtroProvincia, setFiltroProvincia] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [filtroCalificacion, setFiltroCalificacion] = useState("");

  const dispatch = useDispatch();
  const listaUsuarios = useSelector((state) => state.reducerListUsuario.data);
  var dataUsuario;
  const locale = {
    noResultsText: "No existen resultados",
    placeholder: "",
    searchPlaceholder: "Buscar",
    checkAll: "",
  };

  // console.log(listaUsuarios);
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

  /*SETEAR ESTADOS POR DEFECTO*/
  useEffect(() => {
    if (listaUsuarios!= null) {
      if (
        listaUsuarios.localidades != null &&
        listaUsuarios.localidades.length == 1
      ) {
        setFiltroLocalidad(listaUsuarios.localidades[0].nombre);
      }
      if (
        listaUsuarios.provincias != null &&
        listaUsuarios.provincias.length == 1
      ) {
        setFiltroProvincia(listaUsuarios.provincias[0].nombre);
      } 
    }
  }, []);


  useEffect(() => {
    const data = {
      nombre: buscador,
      page: activePage,
      calificacion: filtroCalificacion,
      provincia: filtroProvincia,
      localidad: filtroLocalidad,
    };
    if (filtrosActivados == true) {
      dispatch(getListaUsuarios(data));
      setFiltrosActivados(false);
    }
  }, [filtrosActivados]);

  //Lista de Provincias
  if (listaUsuarios != null) {
    var provincias = [];
    const pr = listaUsuarios.provincias;
    for (var i = 0; i < pr.length; i++) {
      provincias.push({
        value: pr[i].nombre,
        label: pr[i].nombre,
      });
    }
    //Lista de Localidades
    var localidades = [];
    const lo = listaUsuarios.localidades;
    for (var i = 0; i < lo.length; i++) {
      localidades.push({
        value: lo[i].nombre,
        label: lo[i].nombre,
      });
    }
  }

  const buscarPorTitulo = (e) => {
    setBuscador(e.target.value);
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

  const handleChange = (e) => {
    setFiltroCalificacion(e);
    setFiltrosActivados(true);
  };

  if (listaUsuarios != null && listaUsuarios.data != null) {
    var listUsers = [];
    for (var i = 0; i < listaUsuarios.data.length; i++) {
      dataUsuario = listaUsuarios.data[i];
      listUsers.push(
        <>
          <Link
            className="container-box-user"
            to={"/SuperAdmin/perfil-usuarios"}
            state={{ from: listaUsuarios.data[i], data: fotoPerfilUsuarios[i] }}
          >
            <AvatarGroup className="contenedor-avatars-usuarios">
              <div className="sidebar-header-admin-container">
                <div className="sidebar-user-profile vedor">
                  <Avatar
                    circle
                    src={fotoPerfilUsuarios[i]}
                    alt="Perfil Administrador"
                  />
                </div>
                <div className="sidebar-admin-profile-info">
                  <div className="sidebar-user-name">
                    <p className="titulo-lista-usuarios-admin">
                      {listaUsuarios != null
                        ? listaUsuarios.data[i].nombreCompleto
                        : ""}
                    </p>
                  </div>
                  <div className="sidebar-user-name-2">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <HiLocationMarker
                        className="icon-cerrar-modal"
                        color="#DA643A"
                        fontSize={25}
                      />
                      <p className="titulo-ubicacion-usuarios">
                        {listaUsuarios != null
                          ? listaUsuarios.data[i].provincia
                          : ""}{" "}
                        <span> - </span>
                        {listaUsuarios != null
                          ? listaUsuarios.data[i].localidad
                          : ""}
                      </p>
                    </div>
                    <Rate
                      className="sidebar-admin-rate vedor"
                      readOnly
                      allowHalf
                      valuegit={
                        listaUsuarios != null
                          ? listaUsuarios.data[i].calificacion
                          : ""
                      }
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </AvatarGroup>
          </Link>
        </>
      );
    }
  }

  return (
    <>
      <div className="contenedor-filtros-titulo-buscador">
        <h1 className="titulo-explorar">Usuarios</h1>

        <div className="box-input-buscador">
          <InputGroup>
            <Input
              value={buscador}
              onChange={(value, e) => buscarPorTitulo(e)}
              className="input-buscador-explorer"
              placeholder="Buscar creador de contenido por nombre"
            />
            <InputGroup.Addon className="background-buscador">
              <SearchIcon color="white" fontSize="25px" />
            </InputGroup.Addon>
          </InputGroup>
        </div>

        <div className="box-buscador-usuarios">
          <div className="box-selects-usuarios">
            <SelectPicker
              locale={locale}
              placeholder={"Provincia"}
              value={filtroProvincia}
              onChange={(value, e) => handleChangeProvincia(value)}
              onClean={(value, e) => handleChangeProvincia("")}
              className="periodistas-select"
              data={provincias}
              style={{ width: 224 }}
            />
            <SelectPicker
              locale={locale}
              placeholder={"Localidad"}
              value={filtroLocalidad}
              onChange={(value, e) => handleChangeLocalidad(value)}
              onClean={(value, e) => handleChangeLocalidad("")}
              className="periodistas-select"
              data={localidades}
              style={{ width: 224 }}
            />
            <SelectPicker
              locale={locale}
              onChange={(value, e) => handleChange(value)}
              placeholder={"Calificación"}
              className="periodistas-select"
              data={options}
              style={{ width: 224 }}
            />
            {listaUsuarios != null && (
              <Pagination
                prev
                next
                size="xs"
                total={listaUsuarios.maxPages}
                limit={1}
                activePage={activePage}
                onChangePage={(e) => {
                  setActivePage(e);
                  setFiltrosActivados(true);
                }}
              />
            )}
          </div>
        </div>
        <div className="box-viñetas-usuarios">{listUsers}</div>
      </div>
    </>
  );
}

export default Usuarios;
