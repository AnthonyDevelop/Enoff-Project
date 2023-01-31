import React, { useState } from "react";
import { Uploader, Loader, Progress } from "rsuite";
import { Rate } from "rsuite";

//imports styles
import './perfilAdiministrador.css'
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

export default function PerfilAdministrador() {
    const [uploading, setUploading] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);

    //traer datos usuario
    const datosUser = useSelector((state) => state.reducerUsuarioDatos);
    const misVideos = useSelector((state) => state.reducerMostrarMisVideos);

    const style = {
        width: 120,
        display: 'inline-block',
        marginRight: 10
    };

    return (
        <div className="contenedor-principal-editar-perfil-vistaAdmin">
            <div className="box-principal-info-perfil-vistaAdmin">
                <div className="box-principal-info-usuario">
                    <div className="box-info-vista-admin">
                        <div className="seccion-datos-usuario-vistaAdmin">
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
                                        console.log(response);
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
                                <div>
                                    <h5 className="nombre-usuario-perfil">
                                        {datosUser.data != null &&
                                            datosUser.data.userData.nombre +
                                            " " +
                                            datosUser.data.userData.apellido}
                                    </h5>
                                </div>
                                <div>
                                    <p className="otros-datos-usuario-perfil">
                                        {datosUser.data != null && datosUser.data.userData.userName}
                                    </p>
                                    <p className="otros-datos-usuario-perfil">
                                        Contraseña: ********
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="box-numero-cuenta-superAdmin">
                            <div>
                                <p className="font-verde">Numero de Cuenta</p>
                                <p>#65165151</p>
                            </div>
                            <div>
                                <p className="font-verde">Usuario/Administrador desde</p>
                                <p>#65165151</p>
                            </div>
                        </div>
                    </div>
                    <div className="box-viñetas-info-vista-Admin">
                        <div className="contenedor-burbujas">
                            <div>
                                {/* {misVideos.data != null && misVideos!=null && misVideos.data.data!=null ? (
                                <div className="cantidad-de-videos">
                                    <p className="cantidad-de-videos-valor">
                                        {misVideos.data.data.length}
                                    </p>
                                    <p className="cantidad-de-videos-texto">videos <br/> visualizados</p>
                                </div>
                                
                            ) : (
                                <div className="cantidad-de-videos">
                                    <p className="cantidad-de-videos-valor">
                                        0
                                    </p>
                                    <p className="cantidad-de-videos-texto">videos <br/> visualizados</p>
                                </div>
                            )} */}
                                <div style={style}>
                                    <Progress.Circle percent={30} strokeColor="#DA643A" />
                                </div>
                            </div>
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}