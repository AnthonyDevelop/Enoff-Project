import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEliminarVideo } from "../../../../../../../Actions/Veedor/eliminarVideo";
import { setGuardarVideo } from "../../../../../../../Actions/Veedor/guardarVideo";
import { setComprarVideo } from "../../../../../../../Actions/Veedor/comprarVideo";
import { getVeedorRecibirMisVideos } from "../../../../../../../Actions/veedorRecibirVideos";
import { getVeedorRecibirVideosDescartado } from "../../../../../../../Actions/veedorRecibirVideos";
import { getVeedorRecibirVideosGuardados } from "../../../../../../../Actions/veedorRecibirVideos";
import { avanzarVideoPostCompra } from "../../../../../../../Actions/Veedor/avanzarVideoPostCompra";
import { enviarMailPeriodista } from "../../../../../../../Actions/Veedor/enviarMailPeriodista";
import Cards from "react-credit-cards-2";
import MercadoPagoApi from "../../../../../MercadoPago/MercadoPagoApi";
import update from "react-addons-update";

import { Divider, Rate, Pagination } from "rsuite";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import "./veedorVideoEnReproductor.css";
import "react-credit-cards-2/es/styles-compiled.css";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

//React Icons
import { HiLocationMarker } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiFillDollarCircle } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { RiSave3Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { setVideoVisto } from "../../../../../../../Actions/Veedor/videoVisto";
import { Avatar, SelectPicker } from "rsuite";
import { getListaPeriodistas } from "../../../../../../../Actions/VedorListaPeriodistas";
export default function VeedorVideoEnReproductor(props) {
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  const respuestaBotones = useSelector(
    (state) => state.reducerActualizarVistaReproductor.data
  );
  const respuestaMailPeriodista = useSelector(
    (state) => state.reducerRespuestaMailPeriodista.data
  );
  const respuestaAvanzarVideo = useSelector(
    (state) => state.reducerAvanzarVideoPostCompra.data
  );

  const listCategorias = useSelector((state) => state.reducerCategorias.data);

  const listaPeriodistas = useSelector(
    (state) => state.reducerListPeriodistas.data
  );

  const [count, setCount] = useState(0);
  const [videoUrl, setVideoUrl] = useState();
  const [imageUrl, setImageUrl] = useState();
  const posCarrousel = props.posCarrousel;
  const setPosCarrousel = props.setPosCarrousel;
  const imagenUserPerfil = props.imagenUserPerfil;
  const setAbrirReproductor = props.setAbrirReproductor;
  const [activarVideo, setActivarVideo] = useState(false);
  const storage = getStorage();
  const storageImg = getStorage();
  const pos = props.pos;
  const dispatch = useDispatch();
  const data = props.data;

  const dataImg = props.dataImg;
  let mp = "";
  const [ocultarPlay, setOcultarPlay] = useState(false);
  const [datosVideo, setDatosVideo] = useState({
    calificacion: "",
    comentarios: "",
  });

  const [formCard, setFormCard] = useState({
    cvc: "",
    expiry: "",
    name: "",
    number: "",
  });
  const [focus, setFocus] = useState("");

  const locale = {
    valid: "Hasta",
    name: "asdaisojdoijasd",
  };

  const localeSelect = {
    noResultsText: "No existen resultados",
    placeholder: "",
    searchPlaceholder: "Buscar",
    checkAll: "",
  };

  const placeHoldersCard = {
    name: "NOMBRE DEL TITULAR",
  };
  const [imagenUrl, setImagenUrl] = useState();
  const [mostrarImagenPerfil, setMostrarImagenPerfil] = useState("");
  const [campoRequerido, setCampoRequerido] = useState(true);
  const [mostrarErrores, setMostrarErrores] = useState(false);

  const [videoGuardado, setVideoGuardado] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [videoComprado, setVideoComprado] = useState(false);

  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [openModalAdquirido, setOpenModalAdquirido] = useState(false);

  const [openModalExitoCompra, setOpenModalExitoCompra] = useState(false);
  const [openModalExitoMailPeriodista, setOpenModalExitoMailPeriodista] =
    useState(false);
  const [step, setStep] = useState(0);
  const [openModalErrorCompra, setOpenModalErrorCompra] = useState(false);
  const [arrayUsuarios, setArrayUsuarios] = useState([]);

  const [estadoLoading, setEstadoLoading] = useState(false);

  const [openModalGuardar, setOpenModalGuardar] = useState(false);

  //LISTA PERIODISTAS ASIGNADOS
  const [pageListaPeriodista, setPageListaPeriodista] = useState(1);

  const [openModalTarjeta, setOpenModalTarjeta] = useState(false);
  const [datosVideoAdquirido, setDatosVideoAdquirido] = useState({
    public_key: "",
    comentarios: "",
    calificacion: "",
    idPublicacion: "",
    precio: "",
  });

  const closeModalAdquirido = () => {
    setOpenModalAdquirido(false);
    setCampoRequerido(true);
    setMostrarErrores(false);
    setCount(0);
  };

  const closeModalEliminar = () => {
    setOpenModalEliminar(false);
    setCampoRequerido(true);
    setMostrarErrores(false);
    setDatosVideo({
      calificacion: "",
      comentarios: "",
    });
  };
  const closeModalGuardar = () => {
    setOpenModalGuardar(false);
  };

  const closeModalTarjeta = (e) => {
    setOpenModalTarjeta(false);
    cardForm.unmount();
    setFormCard({
      cvc: "",
      expiry: "",
      name: "",
      number: "",
    });
    setDatosVideoAdquirido({
      public_key: "",
      comentarios: "",
      calificacion: "",
      idPublicacion: "",
      precio: "",
    });
  };

  useEffect(() => {
    if (data != null) {
      for (var i = 0; i < data.estados.length; i++) {
        if (data.estados[i].nombre == "Guardado") {
          setVideoGuardado(true);
        }
        if (data.estados[i].nombre == "Comprado") {
          setVideoComprado(true);
        }
      }
    }
  }, [data]);
  const EliminarVideoReproductor = () => {
    const dataVideoComprado = {
      comentario: datosVideo.comentarios,
      calificacion: datosVideo.calificacion,
      idPublicacion: data.idPublicacion,
    };
    if (campoRequerido == false && mostrarErrores == false) {
      dispatch(setEliminarVideo(dataVideoComprado));
      setOpenModalEliminar(false);
    }
    if (mostrarErrores == false) {
      setMostrarErrores(true);
    }
  };

  const GuardarVideoReproductor = () => {
    if (data != null) {
      dispatch(setGuardarVideo(data.idPublicacion));
      setEstadoLoading(true);
    }
  };

  // const AdquirirVideoReproductor = () => {
  //   if (data != null) {
  //     dispatch(setComprarVideo({
  //       id: data.idPublicacion,

  //     }));
  //   }
  // };

  function mostrarPlay() {
    const videoActivo = Array.from(
      document.querySelectorAll(".panel.activo .video")
    );
    for (var i = 0; i < videoActivo.length; i++) {
      if (videoActivo[0].paused == true) {
        setOcultarPlay(true);
      } else {
        setOcultarPlay(false);
      }
    }

    const videoActivoSwipper = Array.from(
      document.querySelectorAll(".swiper-slide-active .video")
    );
    for (var i = 0; i < videoActivoSwipper.length; i++) {
      if (videoActivoSwipper[0].paused == true) {
        setOcultarPlay(true);
      } else {
        setOcultarPlay(false);
      }
    }
  }

  // function pauseVideo() {
  //   setOcultarPlay(!ocultarPlay);
  //   const videoActivo = Array.from(
  //     document.querySelectorAll(".panel.activo .video")
  //   );
  //   for (var i = 0; i < videoActivo.length; i++) {
  //     if (videoActivo[0].paused == true) {
  //       videoActivo[0].play();
  //     } else {
  //       videoActivo[0].pause();
  //     }
  //   }

  //   const videoActivoSwipper = Array.from(
  //     document.querySelectorAll(".swiper-slide-active .video")
  //   );
  //   for (var i = 0; i < videoActivoSwipper.length; i++) {
  //     if (videoActivoSwipper[0].paused == true) {
  //       videoActivoSwipper[0].play();
  //     } else {
  //       videoActivoSwipper[0].pause();
  //     }
  //   }
  // }

  function playVideo() {
    setOcultarPlay(!ocultarPlay);
    let gsReference = ref(
      storage,
      "gs://sistemas-delsud.appspot.com/" + data.path + "video-noticia.mp4"
    );
    getDownloadURL(gsReference).then((url) => {
      setVideoUrl(url);
      setActivarVideo(true);
    });
    dispatch(setVideoVisto(data.idPublicacion));
  }

  function enviarUrlPeriodista() {

    let gsReference = ref(
      storage,
      "gs://sistemas-delsud.appspot.com/" + data.path + "video-noticia.mp4"
    );
    getDownloadURL(gsReference).then((url) => {
      setVideoUrl(url);
    });
  }

  var fechaVideo = data.fecha.date.toString().slice(0, 10);
  var hora = data.fecha.date.toString().slice(11, -10);

  const comentarVideo = (e) => {
    setDatosVideo({
      ...datosVideo,
      [e.target.name]: e.target.value,
    });

    if (
      datosVideo.calificacion != null &&
      e.target.value.length > 1 &&
      datosVideo.comentarios != null
    ) {
      setCampoRequerido(false);
      setMostrarErrores(false);
    } else {
      setCampoRequerido(true);
      setMostrarErrores(true);
    }
  };

  //Inicializo Card Form
  let cardForm;

  function cerrarModalAdquirido() {
    if (
      campoRequerido == false &&
      datosVideo.comentarios != "" &&
      mostrarErrores == false
    ) {
      setCount(0);
      setOpenModalAdquirido(false);
      setOpenModalTarjeta(true);
      setDatosVideoAdquirido({
        public_key: data.public_key,
        comentarios: datosVideo.comentarios,
        calificacion: datosVideo.calificacion,
        idPublicacion: data.idPublicacion,
        precio: data.precio,
      });
    }
    if (mostrarErrores == false) {
      setMostrarErrores(true);
    }
  }

  function onChangeFormCard(e) {
    setFormCard({
      ...formCard,
      [e.target.name]: e.target.value,
    });
  }

  /*Para enviar pago*/
  useEffect(() => {
    if (
      datosVideoAdquirido.public_key != "" &&
      datosVideoAdquirido.comentarios != ""
    ) {
      mp = new window.MercadoPago(datosVideoAdquirido.public_key);
    }
  }, [datosVideoAdquirido]);

  /*Respuesta de compra*/
  useEffect(() => {
    if (respuestaBotones != null) {
      if (respuestaBotones.message === "Post guardado correctamente") {
        setEstadoLoading(false);
        closeModalGuardar();
      }
    }
  }, [respuestaBotones]);

  useEffect(() => {
    if (
      datosVideoAdquirido != null &&
      mp != "" &&
      datosVideoAdquirido.public_key != ""
    ) {
      cardForm = mp.cardForm({
        amount: String(datosVideoAdquirido.precio),
        autoMount: true,
        iframe: true,
        form: {
          id: "form-checkout",
          cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "Numero de tarjeta",
          },
          expirationDate: {
            id: "form-checkout__expirationDate",
            placeholder: "MM/YY",
          },
          securityCode: {
            id: "form-checkout__securityCode",
            placeholder: "Código de seguridad",
          },
          cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Titular de la tarjeta",
          },
          issuer: {
            id: "form-checkout__issuer",
            placeholder: "Banco emisor",
          },
          installments: {
            id: "form-checkout__installments",
            placeholder: "Cuotas",
          },
          identificationType: {
            id: "form-checkout__identificationType",
            placeholder: "Tipo de documento",
          },
          identificationNumber: {
            id: "form-checkout__identificationNumber",
            placeholder: "Número del documento",
          },
          cardholderEmail: {
            id: "form-checkout__cardholderEmail",
            placeholder: "E-mail",
          },
        },
        callbacks: {
          onFormMounted: (error) => {
            if (error)
              return console.warn("Form Mounted handling error: ", error);
            console.log("Form mounted");
          },
          onFormUnmounted: (error) => {
            if (error)
              return console.warn("Form Unmounted handling error: ", error);
            console.log("Form unmounted");
          },
          onSubmit: (event) => {
            if (
              datosVideoAdquirido.comentarios != "" &&
              datosVideoAdquirido.calificacion != "" &&
              datosVideoAdquirido.idPublicacion != ""
            ) {
              event.preventDefault();
              setEstadoLoading(true);
              const {
                paymentMethodId: payment_method_id,
                issuerId: issuer_id,
                cardholderEmail: email,
                amount,
                token,
                installments,
                identificationNumber,
                identificationType,
              } = cardForm.getCardFormData();

              fetch(
                "https://enoff.com.ar/server/public/api/comprarPostVedor",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    comentario: datosVideoAdquirido.comentarios,
                    calificacion: datosVideoAdquirido.calificacion,
                    id: datosVideoAdquirido.idPublicacion,
                    token,
                    issuer_id,
                    payment_method_id,
                    transaction_amount: Number(amount),
                    installments: Number(installments),
                    description: "Descripción del producto",
                    payer: {
                      email,
                      identification: {
                        type: identificationType,
                        number: identificationNumber,
                      },
                    },
                  }),
                }
              ).then((value) => {
                if (value.status == "200") {
                  setEstadoLoading(false);
                  setOpenModalTarjeta(false);
                  setFormCard({
                    cvc: "",
                    expiry: "",
                    name: "",
                    number: "",
                  });
                  setOpenModalExitoCompra(true);
                  cardForm.unmount();
                } else {
                  setEstadoLoading(false);
                  setOpenModalTarjeta(false);
                  setFormCard({
                    cvc: "",
                    expiry: "",
                    name: "",
                    number: "",
                  });
                  setOpenModalErrorCompra(true);
                  cardForm.unmount();
                }
              });
            }
          },
        },
      });
    }
  }, [mp, datosVideoAdquirido]);

  //FOTOS DE PERFIL USUARIOS
  const [imagenPerfilUsuarios, setImagenPerfilUsuarios] = useState();
  const [imagenUrlUsuarios, setImagenUrlUsuarios] = useState([]);
  const [imageUsuarios, setImageUsuarios] = useState({
    perfil: [],
  });
  useEffect(async () => {
    if (data != null) {
      imageUsuarios.perfil = [];
      setImagenUrlUsuarios([]);
      if (data.pathUserCreador != "Sin Foto") {
        var gsReferenceUsuarios = ref(
          storage,
          "gs://sistemas-delsud.appspot.com/" + data.pathUserCreador
        );
        imagenUrlUsuarios.push(await getDownloadURL(gsReferenceUsuarios));
        setImageUsuarios(
          update(imageUsuarios, { perfil: { $push: imagenUrlUsuarios } })
        );
      }
      if (data.pathUserCreador === "Sin Foto") {
        imagenUrlUsuarios.push(
          "https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg"
          
        );
        setImageUsuarios(
          update(imageUsuarios, { perfil: { $push: imagenUrlUsuarios } })
        );
      }
    }
  }, [data]);

  /* AVANZAR STEP MODAL*/
  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
  };
  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  let arrayids = [];
  const handleCheckboxArray = (event) => {
    arrayids = [...arrayUsuarios];
    if (event.target.checked) {
      arrayids = [...arrayUsuarios, event.target.value];
    } else {
      arrayids.splice(arrayUsuarios.indexOf(event.target.value), 1);
    }
    setArrayUsuarios(arrayids);
    if (event.target.checked) {
    }
  };

  let arrayListaDeUsuarios = [];
  //LISTA DE USUARIOS
  if (
    listaPeriodistas != null &&
    listaPeriodistas.data != null &&
    imagenUserPerfil != null
  ) {
    for (var i = 0; i < listaPeriodistas.data.length; i++) {
      arrayListaDeUsuarios.push(
        <>
          <div className="container-user-checkbox">
            <div className="checkbox-column-user">
              <Avatar
                size="lg"
                circle
                src={imagenUserPerfil[i]}
                alt={listaPeriodistas.data[i].nombreCompleto}
              />
              <p>{listaPeriodistas.data[i].nombreCompleto}</p>
            </div>
            <div>
              <label className="checkbox-column">
                <input
                  type="checkbox"
                  name="user"
                  value={listaPeriodistas.data[i].idPeriodista}
                  onClick={(e) => handleCheckboxArray(e)}
                />
                <span className="radio">
                  <span />
                </span>
              </label>
            </div>
          </div>
        </>
      );
    }
  }

  //LISTA CATEGORIAS

  let listaDeCategorias=[];

  if (listaPeriodistas != null && listaPeriodistas.categorias!=null) {  
    for (var i = 0; i < listaPeriodistas.categorias.length; i++) {
      listaDeCategorias.push({
        label: listCategorias.data[i].nombre,
        value: listCategorias.data[i].id,
      });
    }
  }


  const handleChangeCategoria = (e) => {
    setFiltroCategoria(e);
  };

  useEffect(() => {
    const dataPeriodista = {
      idCategoria: filtroCategoria,
      page: pageListaPeriodista,
    };
    dispatch(getListaPeriodistas(dataPeriodista));
  }, [filtroCategoria,pageListaPeriodista]);

  function enviarDataPeriodista() {
    const dataUrl = {
      idPeriodistas: arrayUsuarios,
      link: videoUrl,
      idpost: data.idPublicacion,
    };
    dispatch(enviarMailPeriodista(dataUrl));
    setTimeout(() => {
      setOpenModalExitoMailPeriodista(true);
      setOpenModalExitoCompra(false);
    }, 2000);
  }

  function reintentarPago() {
    setOpenModalErrorCompra(false);
    setOpenModalTarjeta(true);
  }

  function cerrarModalActualizarPost() {
    setAbrirReproductor(false);
    const dataVideo = {
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
    };
    dispatch(getVeedorRecibirMisVideos(dataVideo));
  }

  function cerrarModalPeriodista() {
    dispatch(avanzarVideoPostCompra(data.idPublicacion));    
    setOpenModalExitoMailPeriodista(false);
  }

  function cancelarYsiguienVideo() {
    dispatch(avanzarVideoPostCompra(data.idPublicacion));    
    setOpenModalExitoCompra(false);
  }



  return (
    <>
      <div className="video-en-reproductor-container">
        <div className="col-video-section">
          <div className="vidio-header-info-reproductor">
            <Avatar
              className="avatar-reproductor-vedor"
              size="lg"
              circle
              src={imageUsuarios.perfil}
              alt="user"
            />
            <p className="font-nombre-usuario-vedor-reproductor">
              {data.nombreUserCreador}
            </p>
          </div>
          <button
            className={`video-play-icon ${
              ocultarPlay == true ? "playActivo" : ""
            }`}
            onClick={playVideo}
          >
            <FaPlay />
          </button>
          {activarVideo ? (
            <video
              controls
              disablePictureInPicture
              autoPlay
              controlslist="nodownload noplaybackrate"
              className={
                datosUser.userData.roles[0] === "ROLE_ADMIN"
                  ? "video video-reproductor-admin"
                  : "video video-reproductor-veedor"
              }
              id="video"
              onClick={mostrarPlay}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img className="video" src={dataImg[pos]} />
          )}
          {datosUser.userData.roles[0] != "ROLE_ADMIN" && (
            <div className="botones-videos-seccion">
              <button
                className="boton-video boton-video-eliminar"
                // onClick={EliminarVideoReproductor}
                onClick={() => setOpenModalEliminar(true)}
              >
                Eliminar <MdDeleteForever color='#131838' />{" "}
              </button>
              {videoComprado == false && (
                <button
                  className="boton-video boton-video-adquirir"
                  // onClick={enviarUrlPeriodista}
                  onClick={() =>{setOpenModalAdquirido(true);enviarUrlPeriodista()}}
              
                  // onClick={()=>setOpenModalExitoMailPeriodista(true)}
                >
                  Adquirir <AiFillDollarCircle />
                </button>
              )}
              {videoGuardado == false && (
                <button
                  className="boton-video boton-video-guardar"
                  onClick={() => setOpenModalGuardar(true)}
                >
                  Guardar <RiSave3Fill />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="col-description-video-section">
          <AiFillCloseCircle
            color="#474545"
            fontSize={30}
            onClick={()=>{cerrarModalActualizarPost()}}
            className="cerrar-modal-button"
            style={{ cursor: "pointer" }}
          />
          <p className="categoria-video">{data.categoria}</p>
          <div className="location-video-description-section">
            <div className="contenedor-ubicacion-reproductor-vedor">
              <div className="localidad">
                <HiLocationMarker
                  className="icon-cerrar-modal"
                  color="#DA643A"
                  fontSize={25}
                />
                <p className="ubicacion-font">
                  {data.localidad + ", " + data.provincia}
                </p>
              </div>
              <div>
                <h4 className="video-en-reproductor-titulo">{data.titulo}</h4>
                <p className="video-en-reproductor-descripcion">
                  {data.descripcion}
                </p>
              </div>
            </div>
            <div>
              <p className="valor-video-font" style={{textAlign:'center'}}>
                Valor del video - ARS ${data.precio}
              </p>
            </div>
          </div>
          <div className="video-date-section">
            <p>{fechaVideo}</p>
            <p>{hora}hs</p>
          </div>
        </div>
      </div>

      <Modal
        className="container-modal-reproductor"
        backdrop="static"
        centered
        show={openModalEliminar}
        onHide={closeModalEliminar}
      >
        <Modal.Body>
          <div>
            <p className="titulos-modal-principal">
              ¿Querés descartar este contenido?{" "}
            </p>
          </div>
          <div className="box-rate-modal-eliminar">
            <p className="titulos-modal">Calificá el contenido</p>
            <Rate
              style={{ color: "#DDE100!important" }}
              className="rate-modal-eliminar"
              allowHalf
              onChange={(value, e) => setDatosVideo({ calificacion: value })}
            />
            {campoRequerido == true && mostrarErrores == true && (
              <p className="text-danger">*Campo Requerido</p>
            )}
          </div>
          <div className="box-rate-modal-eliminar">
            <p className="titulos-modal">Enviar comentario al usuario</p>
            <textarea
              maxlength="300"
              className="textarea-modal-eliminar"
              type="text"
              name="comentarios"
              onChange={(e) => {
                setCount(e.target.value.length);
                comentarVideo(e);
              }}
            ></textarea>
            {/* <p className={count >= 280 ? "info-caracteres-red" : "info-caracteres"}>{count}</p> */}
            <p
              className={
                count > 280 ? "info-caracteres-red" : "info-caracteres"
              }
            >
              {count === 300 ? count + "/300 Maximo de caracteres" : count}
            </p>
            {campoRequerido == true && mostrarErrores == true && (
              <p className="text-danger">*Campo Requerido</p>
            )}
          </div>
          <div className="botones-modal-eliminar">
            <button
              className="button-modal-cancelar"
              variant="secondary"
              onClick={closeModalEliminar}
            >
              Cancelar
            </button>
            <button
              className="button-modal-eliminar"
              onClick={EliminarVideoReproductor}
            >
              Enviar
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="container-modal-reproductor"
        backdrop="static"
        centered
        show={openModalAdquirido}
        onHide={closeModalAdquirido}
      >
        <Modal.Body>
          <div>
            <p className="titulos-modal-principal">
              ¿Querés adquirir este contenido?{" "}
            </p>
          </div>
          <div className="box-rate-modal-eliminar">
            <p className="titulos-modal">Calificá el contenido</p>
            <Rate
              style={{ color: "#DDE100!important" }}
              className="rate-modal-eliminar"
              allowHalf
              onChange={(value, e) => setDatosVideo({ calificacion: value })}
            />
            {campoRequerido == true && mostrarErrores == true && (
              <p className="text-danger">*Campo Requerido</p>
            )}
          </div>
          <div className="box-rate-modal-eliminar">
            <p className="titulos-modal">Enviar comentario al usuario</p>
            <textarea
              maxlength="300"
              className="textarea-modal-eliminar"
              type="text"
              name="comentarios"
              onChange={(e) => {
                setCount(e.target.value.length);
                comentarVideo(e);
              }}
            ></textarea>
            {/* <p className={count >= 280 ? "info-caracteres-red" : "info-caracteres"}>{count}</p>  */}
            <p
              className={
                count > 280 ? "info-caracteres-red" : "info-caracteres"
              }
            >
              {count === 300 ? count + "/300 Maximo de caracteres" : count}
            </p>
            {campoRequerido == true && mostrarErrores == true && (
              <p className="text-danger">*Campo Requerido</p>
            )}
          </div>
          <div className="botones-modal-eliminar">
            <Button
              style={{ fontWeight: "600" }}
              variant="secondary"
              onClick={closeModalAdquirido}
            >
              Cancelar
            </Button>
            <Button
              style={{ fontWeight: "600" }}
              className="button-modal-eliminar"
              onClick={cerrarModalAdquirido}
              // onClick={()=>setOpenModalExitoCompra(true)}
            >
              Enviar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="container-modal-reproductor modal-pago-tarjeta"
        backdrop="static"
        centered
        show={openModalTarjeta}
        onHide={closeModalTarjeta}
      >
        <Modal.Body>
          <Cards
            placeholders={placeHoldersCard}
            locale={locale}
            cvc={formCard.cvc}
            expiry={formCard.expiry}
            name={formCard.name}
            focused={focus}
            number={formCard.number}
          />
          <form id="form-checkout" className="formulario-tarjeta">
            <div className="formulario-fila">
              <div className="formulario-columna">
                <div className="formulario-tarjeta-campo">
                  <label for="number">Numero de tarjeta</label>
                  <div
                    id="form-checkout__cardNumber"
                    className="container campo-numero-tarjeta"
                  ></div>

                  {/* <input
                    name="cardNumber"
                    type="num"
                    pattern="[\d| ]{16,22}"
                    maxLength={19}
                    required
                    placeholder="0000 0000 0000 0000"
                    value={formCard.number
                      .replace(/[^\dA-Z]/g, "")
                      .replace(/(.{4})/g, "$1 ")
                      .trim()}
                    onChange={(e) => onChangeFormCard(e)}
                    onFocus={(e) => setFocus(e.target.name)}
                  />  */}
                  {/* <div id="form-checkout__cardNumber" class="container campo-numero-tarjeta"></div> */}
                  {/* <input
                    id="form-checkout__cardNumber"
                    type="tel"
                    name="number"
                    pattern="[\d| ]{16,22}"
                    maxLength={19}
                    required
                    placeholder="0000 0000 0000 0000"
                    value={formCard.number
                      .replace(/[^\dA-Z]/g, "")
                      .replace(/(.{4})/g, "$1 ")
                      .trim()}
                    onChange={(e) => onChangeFormCard(e)}
                    onFocus={(e) => setFocus(e.target.name)}
                  /> */}
                </div>
                <div className="formulario-tarjeta-campo">
                  <label for="number">Nombre del titular</label>
                  <input
                    id="form-checkout__cardholderName"
                    type="text"
                    name="name"
                    required
                    maxLength={40}
                    placeholder="Pablo Perez"
                    onChange={(e) => onChangeFormCard(e)}
                    onFocus={(e) => setFocus(e.target.name)}
                  />
                </div>
              </div>
              <div className="formulario-columna">
                <div className="formulario-tarjeta-campo">
                  <label for="number">Fecha de vencimiento</label>
                  <div
                    id="form-checkout__expirationDate"
                    class="container campo-numero-tarjeta"
                  ></div>

                  {/* <input
                    // id="form-checkout__expirationDate"
                    type="tel"
                    name="expiry"
                    value={formCard.expiry
                      .replace(/[^\dA-Z]/g, "")
                      .replace(/(.{2})/, "$1/")
                      .trim()}
                    maxLength={5}
                    required
                    placeholder="MM/AA"
                    onChange={(e) => onChangeFormCard(e)}
                    onFocus={(e) => setFocus(e.target.name)}
                  /> */}
                </div>
                <div
                  className="formulario-tarjeta-campo"
                  onClick={() => setFocus("cvc")}
                >
                  <label for="number">Codigo de seguridad</label>
                  <div
                    id="form-checkout__securityCode"
                    name="cvc"
                    class="container campo-numero-tarjeta"
                    onChange={(e) => onChangeFormCard(e)}
                  ></div>

                  {/* <input
                    // id="form-checkout__securityCode"
                    type="tel"
                    name="cvc"
                    maxLength={4}
                    required
                    placeholder="CVV"
                    onChange={(e) => onChangeFormCard(e)}
                    onFocus={(e) => setFocus(e.target.name)}
                  /> */}
                </div>
              </div>
            </div>
            <div className="formulario-fila">
              <div className="formulario-columna">
                <div className="formulario-tarjeta-campo">
                  <label for="number">Banco Emisor</label>
                  <select
                    onFocus={(e) => setFocus(e.target.name)}
                    id="form-checkout__issuer"
                  ></select>
                </div>
                <div className="formulario-tarjeta-campo">
                  <label for="number">Tipo de documento</label>
                  <select
                    onFocus={(e) => setFocus(e.target.name)}
                    id="form-checkout__identificationType"
                  ></select>
                </div>
              </div>
              <div className="formulario-columna">
                <div className="formulario-tarjeta-campo">
                  <label for="number">Cantidad de cuotas</label>
                  <select
                    onFocus={(e) => setFocus(e.target.name)}
                    id="form-checkout__installments"
                  ></select>
                </div>
                <div className="formulario-tarjeta-campo">
                  <label for="number">Número de documento</label>
                  <input
                    id="form-checkout__identificationNumber"
                    type="tel"
                    maxLength={8}
                    required
                    placeholder="Dni..."
                    onFocus={(e) => setFocus(e.target.name)}
                  />
                </div>
              </div>
            </div>
            <div className="formulario-fila">
              <div className="formulario-columna">
                <div className="formulario-tarjeta-campo">
                  <label for="number">Correo electrónico</label>
                  <input
                    id="form-checkout__cardholderEmail"
                    type="email"
                    maxLength={40}
                    required
                    placeholder="Mail..."
                    onFocus={(e) => setFocus(e.target.name)}
                  />
                </div>
              </div>
            </div>

            <div className="caja-boton-pago">
              <input
                className="boton-de-pago boton-de-pago-cancelar"
                type="button"
                value={"Cancelar"}
                onClick={closeModalTarjeta}
              />
              {estadoLoading == false ? (
                <Button
                  Loading={estadoLoading}
                  className="boton-de-pago"
                  type="submit"
                  id="form-checkout__submit"
                >
                  Realizar Pago
                </Button>
              ) : (
                <Button className="boton-de-pago" disabled>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Realizando pago
                </Button>
              )}
            </div>
          </form>
          {/* <form id="form-checkout">
            <div id="form-checkout__cardNumber" class="container"></div>
            <div id="form-checkout__expirationDate" class="container"></div>
            <div id="form-checkout__securityCode" class="container"></div>
            <input type="text" id="form-checkout__cardholderName" />
            <select id="form-checkout__issuer"></select>
            <select id="form-checkout__installments"></select>
            <select id="form-checkout__identificationType"></select>
            <input type="text" id="form-checkout__identificationNumber" />
            <input type="email" id="form-checkout__cardholderEmail" />
            <button type="submit" id="form-checkout__submit">Pagar</button>
        </form> */}
        </Modal.Body>
      </Modal>

      {/*MODAL PAGO EXITOSO */}
      <Modal
        className="modal-pago-exitoso"
        show={openModalExitoCompra}
        size={"lg"}
        backdrop="static"
        centered
      >
        <Modal.Body>
          {step === 0 && (
            <div className="container-modal-exitoso step0">
              <BsCheckCircleFill className="icon-register-exitoso" />
              <h5>¡Contenido adquirido con éxito!</h5>
              <hr className="linea-register" />
              <p>
                En la pantalla siguiente, seleccioná al periodista
                <br />
                que debe recibir el video.
              </p>
              <button onClick={onNext} className="modal-boton-volver">
                Siguiente
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="container-modal-exitoso">
              {arrayListaDeUsuarios.length>0 &&
              <>
              <div className="periodista-step-header">
                <p>¿A qué periodista le querés enviar el video?</p>
                <SelectPicker
                  locale={localeSelect}
                  searchable={false}
                  onChange={(value, e) => handleChangeCategoria(value)}
                  placeholder={"Seleecione un categoría"}
                  data={listaDeCategorias}
                  style={{ width: 224 }}
                />
              </div>
              
              <div className="box-user-list">{arrayListaDeUsuarios}</div>
              </>
              }
              <div className="box-user-list-sin-perdiodistas">{arrayListaDeUsuarios.length==0 && <p>Sin periodistas asignados</p>}</div>
              
              <div className="box-pagination-periodistas">
                <Pagination
                  limit={1}
                  total={
                    listaPeriodistas != null ? listaPeriodistas.maxPages : ""
                  }
                  activePage={pageListaPeriodista}
                  onChangePage={setPageListaPeriodista}
                />
              </div>
              {arrayUsuarios.length != 0 && (
                <button
                  onClick={enviarDataPeriodista}
                  className="modal-boton-volver"
                >
                  Enviar
                </button>
              )}
              {arrayUsuarios.length === 0 && (
                <button
                  onClick={cancelarYsiguienVideo}
                  className="modal-boton-volver"
                >
                  Cerrar
                </button>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/*MODAL PAGO ERROR */}
      <Modal
        className="modal-pago-error "
        show={openModalErrorCompra}
        size={"lg"}
        backdrop="static"
        centered
      >
        <Modal.Body>
          <div className="container-modal-error">
            <TiDelete className="icon-register-error" />
            <h5 style={{ color: "#FF4958",textAlign:'center !important' }}>
              ¡No tenés dinero suficiente en la cuenta
              <br />
              para realizar el pago!
            </h5>
            <button onClick={reintentarPago} className="modal-boton-volver">
              Volvé a intentar
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="container-modal-reproductor-guardado"
        backdrop="static"
        size="sm"
        centered
        show={openModalGuardar}
        onHide={closeModalGuardar}
      >
        <Modal.Body>
          <div>
            <p className="titulos-modal-principal-guardado">
              ¿Querés guardar este contenido?{" "}
            </p>
          </div>
          <div className="botones-modal-eliminar">
            {estadoLoading == false ? (
              <>
                <button
                  className="button-modal-cancelar-guardado"
                  variant="secondary"
                  onClick={closeModalGuardar}
                >
                  No
                </button>
                <Button
                  Loading={estadoLoading}
                  className="button-modal-eliminar-guardado"
                  onClick={GuardarVideoReproductor}
                >
                  Si
                </Button>
              </>
            ) : (
              <Button className="button-guardar-video" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Guardando video
              </Button>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openModalExitoMailPeriodista}
        backdrop="static"
        centered
        size="md"
        className="modal-envio-mail-exitoso"
      >
        <Modal.Body>
          <BsCheckCircleFill className="icon-register-exitoso" />
          <h3 className="titulo-modal-exitoso">¡Enviado!</h3>
          <button
            className="modal-boton-volver-urgente"
            //  onClick={()=>setOpenModalExitoMailPeriodista(false)}
            onClick={cerrarModalPeriodista}
          >
            Siguiente video
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
}
