import React, { useState } from 'react'
import { Input, InputGroup, AvatarGroup, Avatar, Rate } from 'rsuite';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { getListaVeedores } from '../../../../../Actions/SuperAdmin/listaVeedores';
import SearchIcon from '@rsuite/icons/Search';
import Select from "react-select";
import './administradores.css';

function Veedores(props) {
  const fotoPerfilUsuarios = props.fotoPerfiles;
  const listaVedores = useSelector((state) => state.reducerListaVeedores.data);
  const dispatch = useDispatch();
  var dataUsuario;
  // console.log(fotoPerfilUsuarios);
  const buscarPorTitulo = (e) => {
    const dataVeedor = {
      nombre: e.target.value,
    }
    dispatch(getListaVeedores(dataVeedor));
  };

  if (listaVedores != null) {
    var listaDeVeedores = [];
    for (var i = 0; i < listaVedores.data.length; i++) {
      dataUsuario = listaVedores.data[i]
      listaDeVeedores.push(
        <>
          <Link className="container-box-user" to={"/SuperAdmin/perfil-usuario-veedor"} state={{ from: listaVedores.data[i], data: fotoPerfilUsuarios[i] }}>
            <AvatarGroup className='contenedor-avatars-usuarios'>
              <div className='sidebar-header-admin-container'>
                <div className='sidebar-user-profile'>
                  <Avatar circle src={fotoPerfilUsuarios[i]} alt="Perfil Administrador" />
                </div>
                <div className='sidebar-admin-profile-info'>
                  <div className='sidebar-user-name'>
                    <p className='titulo-lista-usuarios'>
                      {listaVedores != null ? listaVedores.data[i].nombreCompleto : ""}
                    </p>
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
      <div className='contenedor-filtros-titulo-buscador'>
        <h1 className='titulo-explorar'>Veedores</h1>
        <div className='box-input-buscador'>
          <InputGroup>
            <Input
              onChange={(value, e) => buscarPorTitulo(e)}
              className='input-buscador-explorer'
              placeholder='Buscar vedor'
            />
            <InputGroup.Addon className='background-buscador'>
              <SearchIcon color='white' fontSize='25px' />
            </InputGroup.Addon>
          </InputGroup>
        </div>
        <div className='box-viñetas-usuarios'>
          {listaDeVeedores}
        </div>
      </div>
    </>
  )
}

export default Veedores