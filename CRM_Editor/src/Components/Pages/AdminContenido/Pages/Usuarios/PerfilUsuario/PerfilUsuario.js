import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive'
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import VeedorReproductorDeVideo from "../../Explorar/VeedorReproductorDeVideo/VeedorReproductorDeVideo";
import { Avatar, Rate } from "rsuite";
//imports Icons
import { IoGolfOutline } from "react-icons/io5";
import Loading from "../../../../../Loading/Loading";
//UseSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";
import { getVideosPorUsuario } from "../../../../../../Actions/AccionVideosPorUsuario";
import {
    getStorage,
    ref,
    getDownloadURL,
} from "firebase/storage";

import update from "react-addons-update";

export default function PerfilUsuario(props) {
    const fotoPerfil = props.fotoPerfiles;
    const [imagenUrlVideosPerfilUser, setImagenUrlVideosPerfilUser] = useState([]);
    const [videosUserPerfil, setVideosUserPerfil] = useState({
        videosUserPerfilVideo: [],
    });

    const storage = getStorage();

    const location = useLocation();
    const { from, data } = location.state;

    const [imagenUrl, setImagenUrl] = useState();

    const [foto, setFile] = useState({ imagenPerfilUser: "" });
    const [abrirReproductor, setAbrirReproductor] = useState(null);
    const [posCarrousel, setPosCarrousel] = useState();
    const [mostrarImagenPerfil, setMostrarImagenPerfil] = useState("");

    //traer datos usuario
    const datosUser = useSelector((state) => state.reducerUsuarioDatos);
    const misVideos = useSelector((state) => state.reducerMostrarVideosPorUsuario);
    const dispatch = useDispatch();


    //traer imagenes firebase de videos

    useEffect(async () => {
        if (misVideos.data != null && misVideos.data.data != null) {
            videosUserPerfil.videosUserPerfilVideo = [];
            setImagenUrlVideosPerfilUser([]);
            for (var i = 0; i < misVideos.data.data.length; i++) {
                var gsReferenceVideosPerfilUser = ref(
                    storage,
                    "gs://sistemas-delsud.appspot.com/" +
                    misVideos.data.data[i].path +
                    "portada-video.png"
                );
                imagenUrlVideosPerfilUser.push(await getDownloadURL(gsReferenceVideosPerfilUser));
                setVideosUserPerfil(
                    update(videosUserPerfil, { videosUserPerfilVideo: { $push: imagenUrlVideosPerfilUser } })
                );
            }
        }
        //setVideosGuardados(imagenUrl);
    }, [misVideos]);

    useEffect(() => {
        if (from != null) {

            const datosUserVideos = {
                titulo: "",
                fechaInicio: "",
                localidad: "",
                provincia: "",
                fechaFin: "",
                page: 1,
                calificacion: "",
                idestado: "",
                idCategoria: "",
                urgente: false,
                iduser: from.idUser,
            }
            dispatch(getVideosPorUsuario(datosUserVideos))
        }

    }, [from])


    const handleOpenReproductor = (idx) => {
        setPosCarrousel(idx);
        if (abrirReproductor == true) {
            setAbrirReproductor(false);
        } else {
            setAbrirReproductor(!abrirReproductor);
        }
    };

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm({
        mode: "onChange"
    });

    useEffect(async () => {
        if (data != null) {
            let gsReference = ref(storage, "gs://sistemas-delsud.appspot.com/" + data);
            setImagenUrl("imagenes-de-perfil/" + datosUser.data.userData.email)
            if (datosUser.data.userData.pathFotoPerfil == null) {
                setMostrarImagenPerfil("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg")
            }
            if (datosUser.data.userData.pathFotoPerfil != null) {
                setMostrarImagenPerfil(await getDownloadURL(gsReference))
                // setMostrarImagenPerfil("https://www.blackhound.com.ar/server/public/getImgProfile/" + datosUser.id )
            }
        }
    }, [datosUser]);

    const vistaMobile = useMediaQuery({
        query: '(max-width: 998px)'
    })

    const onChangue = (event) => {
        setFile({
            ...foto,
            [event.target.name]: event.target.files[0]
        });
    }

    // const mostrarImagenUser = (e) => {
    //     onChangue(e);
    //     if (e.target.files[0]) {
    //         setMostrarImagenPerfil(e.target.files[0]);
    //         const readerImagenPerfil = new FileReader();
    //         readerImagenPerfil.addEventListener("load", () => {
    //             setMostrarImagenPerfil(readerImagenPerfil.result);
    //         });
    //         readerImagenPerfil.readAsDataURL(e.target.files[0]);
    //     }
    // };

    const [loading, setLoading] = useState(true);
    {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    return (
        <>
            {/* {loading ?
            <div className='loading'>
              <Loading />
            </div>
            : */}
            <div className="mi-perfil-container-vedor-usuario">
                <div className="caja-seccion-perfil-vista-vedor">
                    <div className="seccion-datos-usuario-admin">
                        <div className="contenedor-informacion-user-vistaAdmin">
                            <div className="prueba-caja">
                                <img className="fotoPerfilAdmin" src={data} />
                            </div>
                            <div className="datos-usuario-perfil-vedor">
                                <p className="id-user-texto">#{from != null ? from.idUser : ''}</p>
                                <h5 className="nombre-usuario-perfil">
                                    {from != null ? from.nombreCompleto : ''}
                                </h5>
                                <Rate
                                    style={{ color: '#DDE100!important' }}
                                    className="sidebar-user-rate editar-perfil-rate"
                                    readOnly={true}
                                    value={from != null ? from.calificacion : ""}
                                    size="md"
                                />
                                <p className="otros-datos-usuario-perfil">
                                    {from != null ? from.email : ''}
                                </p>
                            </div>
                        </div>
                        <div className="contenedor-cantidad-de-videos-vistaAdmin">
                            <div className="cantidad-de-videos-vedor">
                                <p className="cantidad-de-videos-valor">
                                    {from != null ? from.videosCargados : ''}
                                </p>
                                <p className="cantidad-de-videos-texto">videos <br /> visualizados</p>
                            </div>
                        </div>
                    </div>
                    <div className="seccion-acerca-de-perfil-vistaAdmin">
                        <div className="seccion-acerca-de-perfil-texto">
                            <p
                                className="seccion-acerca-de-perfil-texto input-editar-perfil-usuario-text-area">
                                {from != null ? from.descripcion : 'Sin descripción'}
                            </p>
                        </div>
                    </div>

                    <div className="estadisticas-videos-usuario-vistaAdmin">
                        <div className="estadisticas-videos-usuario-columna-vedor">
                            <div className="estadisticas-videos-usuario-fila">
                                <p>Videos cargados</p>
                                <p className="cantidad-de-videos-valor">
                                    {from != null ? from.videosCargados : ''}
                                </p>
                            </div>
                            <div className="estadisticas-videos-usuario-fila">
                                <p>Videos calificados</p>
                                <p className="cantidad-de-videos-valor">
                                    {from != null ? from.videosCargados : ''}
                                </p>
                            </div>
                            <div className="estadisticas-videos-usuario-fila">
                                <p>Strikes</p>
                                <p className="cantidad-de-videos-valor">
                                    {from != null ? from.strikes : ''}/3
                                </p>
                            </div>
                        </div>
                        <div className="estadisticas-videos-usuario-columna-vedor">
                            <div className="estadisticas-videos-usuario-fila">
                                <p>Videos monetizados</p>
                                <p className="cantidad-de-videos-valor">
                                    {from != null ? from.videosMonetizados : ''}
                                </p>
                            </div>
                            <div className="estadisticas-videos-usuario-fila">
                                <p>Videos no monetizados</p>
                                <p className="cantidad-de-videos-valor">
                                    {from != null ? from.videosNoMonetizados : ''}
                                </p>
                            </div>
                            <div className="estadisticas-videos-usuario-fila">
                                <p>Baneado</p>
                                <p className="cantidad-de-videos-valor">
                                    {from != null && from.banneado == true ? <p style={{ color: '#DA643A' }}>Si</p> : <p style={{ color: '#DA643A' }}>No</p>}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="contenedor-videos-perfil-vistaAdmin">
                        <div>
                            <p className="titulo-videos-usuario-vistaAdmin">Videos</p>
                        </div>
                        <div className="mis-videos-container-vedor">
                            {misVideos.data != null &&
                                misVideos.data.data != null &&
                                videosUserPerfil.videosUserPerfilVideo != null &&
                                misVideos != null &&
                                misVideos.data.maxPages != null
                                ? misVideos.data.data.map((img, idx) => (
                                    <div
                                        className={`video-miniatura-usuario-vedor`}
                                    >
                                        <div
                                            className="capa-oscura-sobre-imagen"
                                            onClick={() => handleOpenReproductor(idx)}
                                        >
                                            {videosUserPerfil.videosUserPerfilVideo[idx] != null && (
                                                <img src={videosUserPerfil.videosUserPerfilVideo[idx]} />
                                            )}
                                            {videosUserPerfil.videosUserPerfilVideo[idx] == null && (
                                                // <img
                                                //     src={
                                                //         "https://res.cloudinary.com/grupo-delsud/image/upload/v1667489390/EditorPlus/pixels-animados-100px_wbleih.gif"
                                                //     }
                                                // />
                                                <div class="loader"></div>
                                            )}
                                        </div>
                                        <div className="video-datos-ocultos">
                                            <p className="categoria-video">{img.categoria}</p>

                                            <p className="titulo-video">{img.titulo}</p>
                                        </div>


                                    </div>
                                ))
                                : ""}
                            {/* {mostrarVideos != null ? mostrarVideos : "No hay videos"} */}
                        </div>
                    </div>
                </div>
                {/* <VeedorReproductorDeVideo
              imagenCarrousel={videosUserPerfil.videosUserPerfilVideo}
              posCarrousel={posCarrousel}
              estadoModalReproductor={abrirReproductor}
              misVideos={misVideos}
            /> */}
            </div>
            {/* } */}
        </>
    );
}