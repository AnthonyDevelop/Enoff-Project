import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive'
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Avatar, Rate } from "rsuite";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
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
import { HiLocationMarker } from "react-icons/hi";
import update from "react-addons-update";
import { TbFlagOff } from "react-icons/tb";
import VeedorReproductorDeVideo from "../../../../AdminContenido/Pages/Explorar/VeedorReproductorDeVideo/VeedorReproductorDeVideo";
import { getSumarStrike } from "../../../../../../Actions/SuperAdmin/sumarStrike";
import { getListaUsuarios } from "../../../../../../Actions/listUsuarios";
import { ButtonGroup } from "react-bootstrap";


export default function ConfiguracionPerfilAdmin(props) {
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

    // if(data != null){
    //     console.log(data)
    // }else{
    //     console.log('no tengo nada')
    // }
    const [imagenUrl, setImagenUrl] = useState();

    const [foto, setFile] = useState({ imagenPerfilUser: "" });
    const [abrirReproductor, setAbrirReproductor] = useState(null);
    const [posCarrousel, setPosCarrousel] = useState();
    const [mostrarImagenPerfil, setMostrarImagenPerfil] = useState("");

    //traer datos usuario
    const datosUser = useSelector((state) => state.reducerUsuarioDatos);
    const misVideos = useSelector((state) => state.reducerMostrarVideosPorUsuario);
    const listUsuarios = useSelector((state) => state.reducerListUsuario);
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

    function SumarStrike() {
        dispatch(getSumarStrike(from.idUser))
        setTimeout(() => {
            const data = {
                nombre: "",
                page: 1,
                calificacion: '',
                localidad: "",
                provincia: "",
            }
            dispatch(getListaUsuarios(data))
        }, 4500);
    }


    const [show, setShow] = useState(false);

    function handleShow() {
      setShow(true);
    }


    const [showBaneo, setShowBaneo] = useState(false);

    function handleShowBaneo() {
      setShowBaneo(true);
    }

    
  const handleClose = () => setShow(false);

  function ActualizarStrike (){
    dispatch(getListaUsuarios(data))
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
                                <div className="box-usuarios-ubi">
                                    <div>
                                        <p className="id-user-texto">#{from != null ? from.idUser : ''}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <HiLocationMarker className="icon-cerrar-modal" color="#DA643A" fontSize={25} />
                                        <p className="titulo-ubicacion-usuarios">
                                            {from != null
                                                ? from.provincia
                                                : ""}{" "}

                                            -

                                            {from != null
                                                ? from.localidad
                                                : ""}
                                        </p>
                                    </div>
                                </div>
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
                            <div className="datos-usuario-perfil-superAdmin">
                                <div className="box-strike">
                                    <button className="button-superAdmin-perfil" onClick={()=>{
                                        // SumarStrike();
                                        handleShow()
                                        }}>Aplicar Strike</button>
                                    <div>
                                        {from != null && from.strikes === 0 &&
                                            <>
                                                <TbFlagOff fontSize={23} />
                                                <TbFlagOff fontSize={23} />
                                                <TbFlagOff fontSize={23} />
                                            </>
                                        }
                                        {from != null && from.strikes === 1 &&
                                            <>
                                                <TbFlagOff fontSize={23} color={'#DA643A'} />
                                                <TbFlagOff fontSize={23} />
                                                <TbFlagOff fontSize={23} />
                                            </>
                                        }
                                        {from != null && from.strikes === 2 &&
                                            <>
                                                <TbFlagOff fontSize={23} color={'#DA643A'} />
                                                <TbFlagOff fontSize={23} color={'#DA643A'} />
                                                <TbFlagOff fontSize={23} />
                                            </>
                                        }
                                        {from != null && from.strikes === 3 &&
                                            <>
                                                <TbFlagOff fontSize={23} color={'#DA643A'} />
                                                <TbFlagOff fontSize={23} color={'#DA643A'} />
                                                <TbFlagOff fontSize={23} color={'#DA643A'} />
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="box-strike">
                                    <button className="button-superAdmin-perfil" onClick={handleShowBaneo}>Banear Usuario</button>
                                    {from != null && from.baneado === true
                                        ?
                                        (<img src="https://res.cloudinary.com/grupo-delsud/image/upload/v1666964367/EditorPlus/ban_tkokqj.png" />)
                                        :
                                        (<img src="https://res.cloudinary.com/grupo-delsud/image/upload/v1660836843/EditorPlus/userBlock.svg" />)
                                    }

                                </div>
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
                        <div className="contenedor-cantidad-de-videos-vistaAdmin">
                            <div className="cantidad-de-videos-admin">
                                <p className="cantidad-de-videos-valor">
                                    {from != null ? from.videosCargados : ''}
                                </p>
                                <p className="cantidad-de-videos-texto">videos <br /> visualizados</p>
                            </div>
                        </div>
                    </div>

                    <div className="estadisticas-videos-usuario-vistaAdmin">
                        <div className="estadisticas-videos-usuario-columna">
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
                        </div>
                        <div className="estadisticas-videos-usuario-columna">
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
                        </div>
                    </div>

                    <div className="contenedor-videos-perfil-vistaAdmin">
                        <div>
                            <p className="titulo-videos-usuario-vistaAdmin">Contenido</p>
                        </div>
                        <div className="mis-videos-container">
                            {misVideos.data != null &&
                                misVideos.data.data != null &&
                                videosUserPerfil.videosUserPerfilVideo != null &&
                                misVideos != null &&
                                misVideos.data.maxPages != null
                                ? misVideos.data.data.map((img, idx) => (
                                    <div
                                        className={`video-miniatura`}
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
                <Modal show={show} size="xs" centered onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="titulo-modal-strike">¿Querés aplicar un strike a este usuario?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button onClick={()=> {SumarStrike();handleClose();ActualizarStrike()}}>Aceptar</Button>   
                        <Button>Deshacer</Button> 
                    </Modal.Body>
                </Modal>
                <Modal show={showBaneo} size="xs" centered onHide={() => setShowBaneo(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="titulo-modal-strike">¿Querés banear a este usuario?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button>Aceptar</Button>   
                        <Button>Deshacer</Button> 
                    </Modal.Body>
                </Modal>
            </div>
            {/* } */}
        </>
    );
}