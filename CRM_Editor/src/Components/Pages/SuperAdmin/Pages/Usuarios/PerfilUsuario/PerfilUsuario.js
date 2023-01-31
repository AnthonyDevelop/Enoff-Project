import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive'
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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
import moment from 'moment'
import 'moment/locale/es';
moment.locale('es');


export default function PerfilUsuario(props) {
    // const [videosUserPerfil.videosUserPerfilVideo, setVideosGuardados] = useState({
    //     videos: [],
    //   });
    const [imagenUrlVideosPerfilUser, setImagenUrlVideosPerfilUser] = useState([]);
    const [videosUserPerfil, setVideosUserPerfil] = useState({
        videosUserPerfilVideo: [],
    });

    const storage = getStorage();

    const location = useLocation();
    const { from } = location.state;
    const { data } = location.state;
    const fotoPerfilUsuarios = props.fotoPerfiles;

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
        if (datosUser != null && datosUser.data != null) {
            let gsReference = ref(storage, "gs://sistemas-delsud.appspot.com/" + datosUser.data.userData.pathFotoPerfil);
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

    const mostrarImagenUser = (e) => {
        onChangue(e);
        if (e.target.files[0]) {
            setMostrarImagenPerfil(e.target.files[0]);
            const readerImagenPerfil = new FileReader();
            readerImagenPerfil.addEventListener("load", () => {
                setMostrarImagenPerfil(readerImagenPerfil.result);
            });
            readerImagenPerfil.readAsDataURL(e.target.files[0]);
        }
    };
  
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
            <div className="mi-perfil-container">
                <div className="caja-seccion-perfil-vistaAdmin">
                    <div className="seccion-datos-usuario-admin">
                        <div className="contenedor-informacion-user-vistaAdmin">
                            <div className="prueba-caja">
                                <img className="fotoPerfilAdmin" src={data != null ? data : 'https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg'} />
                            </div>


                            <div className="datos-usuario-perfil-vedor">
                                <p className="id-user-texto">#{from != null ? from.idUser : ''}</p>
                                <h5 className="nombre-usuario-perfil">
                                    {from != null ? from.nombreCompleto : ''}
                                </h5>
                                <Rate
                                style={{color: '#DDE100!important'}}
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
                        <div className="contenedor-cantidad-de-videos-vistaSuperAdmin">
                            <p className="font-subtitulo-fecha-admin">Usuario/Administrador desde</p>
                            <p className="font-fecha-admin">
                                {moment(from.fechaUser.date).format("LLLL")}</p>
                        </div>
                    </div>
                    <div className="contenedor-burbujas">
                       
                            {/* <div style={style}>
                                    <Progress.Circle 
                                    className="container-progess-circle" 
                                    percent={datosUser != null ? <p>$ {datosUser.userData.montoCompraMensual}<br/> de $60.000</p> : 'Sin datos'} 
                                    strokeColor="#DA643A" 
                                    showInfo={true} />
                                </div> */}
                            <div className="cantidad-de-videos-vedor">
                                <p className="font-circulo-perfil-vedor">
                                    {from != null ? <p>$ {from.montoCompraMensual}</p> : 'Sin datos'}
                                </p>
                                <p>de $60.000</p>
                            </div>
                        
                       
                            <div className="cantidad-de-videos-vedor">
                                <p className="cantidad-de-videos-valor-vedor">
                                    {from != null ? from.videosDescartados : ''}
                                </p>
                                <p className="cantidad-de-videos-texto-vedor">videos <br /> <b>descartados</b></p>
                            </div>
                        
                      
                            <div className="cantidad-de-videos-vedor">
                                <p className="cantidad-de-videos-valor-vedor">
                                    {from != null ? from.videosGuardados : ''}
                                </p>
                                <p className="cantidad-de-videos-texto-vedor">videos <br /> <b>guardados</b></p>
                            </div>
                       
                     
                            <div className="cantidad-de-videos-vedor">
                                <p className="cantidad-de-videos-valor-vedor">
                                    {from != null ? from.videosDestacados : ''}
                                </p>
                                <p className="cantidad-de-videos-texto-vedor">videos <br /> <b>destacados</b></p>
                            </div>
                        
                     
                            <div className="cantidad-de-videos-vedor">
                                <p className="cantidad-de-videos-valor-vedor">
                                    {from != null ? from.videosAdquiridos : ''}
                                </p>
                                <p className="cantidad-de-videos-texto-vedor">videos <br /> <b>adquiridos</b></p>
                            </div>
                        
                    </div>
                </div>
            </div>
            {/* } */}
        </>
    );
}