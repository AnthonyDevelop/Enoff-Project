import React, { useState } from "react";
import { Uploader, Message, Loader } from "rsuite";
import { Rate } from "rsuite";

//imports styles
import './PerfilUserAdmin.css'
//imports Icons
import { IoGolfOutline } from "react-icons/io5";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";

//UseSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";


function previewFile(file, callback) {
  
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

export default function PerfilUsuarioAdmin(props) {
  
  const fotoUser = props.perfilUser;


  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  //traer datos usuario
  const datosUser = useSelector((state) => state.reducerUsuarioDatos);
  const misVideos = useSelector((state) => state.reducerMostrarMisVideos);

  return (
    <>
      <div className="mi-perfil-container">
        <div className="caja-seccion-perfil-vistaAdmin">
          <div className="seccion-datos-usuario-admin">
            <div className="contenedor-informacion-user-vistaAdmin">
              <div className="imagen-de-perfil">
                <Uploader
                  fileListVisible={false}
                  listType="picture"
                  action="//jsonplaceholder.typicode.com/posts/"
                  onUpload={(file) => {
                    setUploading(true);
                    previewFile(file.blobFile, (value) => {
                      setFileInfo(value);
                    });
                  }}
                  onSuccess={(response, file) => {
                    setUploading(false);
                  }}
                  onError={() => {
                    setFileInfo(null);
                    setUploading(false);
                  }}
                >
                  <button style={{ width: 150, height: 150 }}>
                    {uploading && <Loader backdrop center />}
                    {fileInfo ? (
                      <img src={fileInfo} width="100%" height="100%" />
                    ) : (
                      <AvatarIcon style={{ fontSize: 80 }} />
                    )}
                  </button>
                </Uploader>
              </div>
              <div className="datos-usuario-perfil">
                <p>#516516</p>
                <h5 className="nombre-usuario-perfil-Admin">
                  {datosUser.data != null &&
                    datosUser.data.userData.nombre +
                    " " +
                    datosUser.data.userData.apellido}
                </h5>
                <Rate
                style={{color: '#DDE100!important'}}
                  className="sidebar-user-rate"
                  readOnly
                  defaultValue={3}
                  size="sm"
                />
                <p className="otros-datos-usuario-perfil">
                  {datosUser.data != null && datosUser.data.userData.userName}
                </p>
              </div>
            </div>

            <div className="contenedor-cantidad-de-videos-vistaAdmin">
              {misVideos.data != null && misVideos != null && misVideos.data.data != null ? (
                <div className="cantidad-de-videos">
                  <p className="cantidad-de-videos-valor">
                    {misVideos.data.data.length}
                  </p>
                  <p className="cantidad-de-videos-texto">videos <br /> visualizados</p>
                </div>
              ) : (
                <div className="cantidad-de-videos">
                  <p className="cantidad-de-videos-valor">
                    0
                  </p>
                  <p className="cantidad-de-videos-texto">videos <br /> visualizados</p>
                </div>
              )}
            </div>
          </div>
          <div className="seccion-acerca-de-perfil-vistaAdmin">
            <div className="seccion-acerca-de-perfil-texto">
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa. Cum sociis natoque Lorem
                ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Donec quam
                felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                consequat massa quis enim. Donec. (300 caract)
              </p>
            </div>

          </div>
          {misVideos.data != null && misVideos != null && misVideos.data.data != null ? (
            <div className="estadisticas-videos-usuario-vistaAdmin">
              <div className="estadisticas-videos-usuario-columna">
                <div className="estadisticas-videos-usuario-fila">
                  <p>Videos cargados</p>
                  <p className="cantidad-de-videos-valor">
                    {misVideos.data.data.length}
                  </p>
                </div>
                <div className="estadisticas-videos-usuario-fila">
                  <p>Videos ¿calificados?</p>
                  <p className="cantidad-de-videos-valor">
                    {misVideos.data.data.length}
                  </p>
                </div>
                <div className="estadisticas-videos-usuario-fila">
                  <p>Strikes</p>
                  <p className="cantidad-de-videos-valor">
                    {misVideos.data.data.length}
                  </p>
                </div>
              </div>
              <div className="estadisticas-videos-usuario-columna">
                <div className="estadisticas-videos-usuario-fila">
                  <p>Videos monetizados</p>
                  <p className="cantidad-de-videos-valor">
                    {misVideos.data.data.length}
                  </p>
                </div>
                <div className="estadisticas-videos-usuario-fila">
                  <p>Videos no monetizados</p>
                  <p className="cantidad-de-videos-valor">
                    {misVideos.data.data.length}
                  </p>
                </div>
                <div className="estadisticas-videos-usuario-fila">
                  <p>Baneado</p>
                  <p className="cantidad-de-videos-valor">
                    {misVideos.data.data.length}
                  </p>
                </div>
              </div>
            </div>
          ) : ""}
          <div className="contenedor-videos-perfil-vistaAdmin">
            <div>
              <p className="titulo-videos-usuario-vistaAdmin">Videos</p>
            </div>
            <div>
              <img src="https://res.cloudinary.com/blackhound/image/upload/v1659525162/BLACKHOUND/desarrollos_hnvsaz.png" />
              <img src="https://res.cloudinary.com/blackhound/image/upload/v1659540935/BLACKHOUND/elemental_oohxsp.svg" />
              <img src="https://res.cloudinary.com/blackhound/image/upload/v1659541685/BLACKHOUND/eugenie_jljwc2.svg" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
