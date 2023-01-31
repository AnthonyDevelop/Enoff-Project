import React, { useState, useEffect } from "react";
import { Input, InputGroup, AvatarGroup, Avatar, Rate, SelectPicker } from 'rsuite';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import SearchIcon from '@rsuite/icons/Search';
import Select from "react-select";


//Firebase
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import update from "react-addons-update";

import './usuarios.css'
import Loading from "../../../../Loading/Loading";
import { getListaUsuarios } from "../../../../../Actions/listUsuarios";

function Usuarios(props) {
  const fotoPerfilUsuarios = props.fotoPerfiles;
  const listaUsuarios = useSelector((state) => state.reducerListUsuario.data);
  const [loading, setLoading] = useState(true);
  {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }
  const storage = getStorage();

  const locale = {
    noResultsText: "No existen resultados",
    placeholder: "",
    searchPlaceholder: "Buscar",
    checkAll: "",
  };

  const [mostrarImagenPerfil, setMostrarImagenPerfil] = useState();
  const [buscador, setBuscador] = useState("");
  const [filtrosActivados, setFiltrosActivados] = useState(false);
  const [filtroCalificacion, setFiltroCalificacion] = useState("");
  const dispatch = useDispatch();

  const buscarPorTitulo = (e) => {
    setBuscador(e.target.value);    
    setFiltrosActivados(true);
  };

  const handleChangeCalificacion = (e) => {
    setFiltroCalificacion(e);
    setFiltrosActivados(true);
  };

  useEffect(() => {
    const data = {
      nombre: buscador,
      page: 1,
      calificacion: filtroCalificacion,
      localidad: "",
      provincia: "",
    }
    if(filtrosActivados==true){
      dispatch(getListaUsuarios(data));    
      setFiltrosActivados(false);  
    }
  }, [filtrosActivados])


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
  

  var dataUsuario;
  if (listaUsuarios != null && listaUsuarios.data !=null) {
    var listUsers = [];
    for (var i = 0; i < listaUsuarios.data.length; i++) {
      dataUsuario = listaUsuarios.data[i]
      listUsers.push(
        <>
          <Link 
          className="container-box-user"
          to={"/AdminContenido/perfil-usuario"} 
          state={{ from: listaUsuarios.data[i], data: fotoPerfilUsuarios[i] }}
          // onClick={videosPorUsuario(listaUsuarios.data[i].idUser)} 
          >
            <AvatarGroup className='contenedor-avatars-usuarios' spacing={100} >
              <div className='sidebar-header-admin-container'>
                <div className='sidebar-user-profile vedor'>
                  <Avatar circle src={fotoPerfilUsuarios[i]} alt="Perfil Usuario Editor" />
                </div>
                <div className='sidebar-admin-profile-info'>
                  <div className='sidebar-user-name'>
                    <p className='titulo-lista-usuarios'>
                      {listaUsuarios != null ? listaUsuarios.data[i].nombreCompleto : ""}
                    </p>
                  </div>
                  <Rate className='sidebar-admin-rate vedor' style={{color: '#DDE100!important'}} readOnly allowHalf defaultValue={listaUsuarios != null ? listaUsuarios.data[i].calificacion : ""} size="sm" />
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
        <div className='explorar-principal-usuarios'>
        <div className="box-titulo-usuarios">
            <h1 className='titulo-explorar'>Usuarios</h1>
          </div>
            <div className='box-buscador-usuarios-vedor'>
              <InputGroup style={{width:'85% !important'}}>
                <Input 
                  onChange={(value, e) => buscarPorTitulo(e)}
                  className='input-buscador-explorer'
                  placeholder='Buscar creador de contenido por nombre o número de usuario'
                />
                <InputGroup.Addon className='background-buscador'>
                  <SearchIcon color='white' fontSize='25px' />
                </InputGroup.Addon>
              </InputGroup>
              <SelectPicker
                searchable={false}
                locale={locale}
                value={filtroCalificacion}
                onChange={(value, e) => handleChangeCalificacion(value)}
                onClean={(value, e) => handleChangeCalificacion("")}
                placeholder={"Calificación"}
                className="periodistas-select"
                data={options}
                style={{ width: 224 }}
                />
            </div>
          <div className='contenedor-globos-usuarios-vedor'>


            <div className='box-viñetas-usuarios'>
              {listUsers}
            </div>
          </div>
        </div>
      {/* } */}
    </>
  )
}

export default Usuarios