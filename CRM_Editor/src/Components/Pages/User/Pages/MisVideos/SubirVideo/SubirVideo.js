import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Form, Schema } from "rsuite";
// import Modal from "react-bootstrap/Modal";
import { Modal } from "rsuite";
import Autosuggest from "react-autosuggest";
import { Progress, ButtonGroup, Button, SelectPicker } from "rsuite";
import Select from "react-select";
import { setEnviarVideo } from "../../../../../../Actions/AccionEnviarVideo";
import Localidades from "./localidades.json";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
//Importar acciones
import { getRecibirMisVideos } from "../../../../../../Actions/MostrarVideos";
import { ActivarSeccionSidebar } from "../../../../../../Actions/AccionActivarSidebar";
//styles
import "./subirVideo.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "rsuite/dist/rsuite.min.css";
import "../../../../Registro/RegistroExitoso/registroExitoso.css";
import ProgressBar from "react-bootstrap/ProgressBar";

//React Icons
import { RiCloseCircleFill, RiMoneyDollarCircleLine } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";
import { FaInfoCircle } from "react-icons/fa";
import { BsCheckCircle } from "react-icons/bs";
import { BsCheckCircleFill } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";
import { AiFillCloseCircle } from 'react-icons/ai';



export default function SubirVideo(props) {
  const dispatch = useDispatch();
  var storageRef = "";
  var storageRefImagen = "";
  var firebase = "";
  const storage = getStorage();
  const setEstadoModal = props.setEstadoModal;
  const estadoModal = props.estadoModal;
  const [show, setShow] = useState(estadoModal != null);
  const [poster, setPoster] = useState();
  const [elegirPortada, setElegirPortada] = useState(false);
  const [checkUrgente, setCheckUrgente] = useState(false);
  const [mostrarModalUrgente, setMostrarModalUrgente] = useState(false);
  const handleClose = () => setShow(false);
  const [firebaseUrl, setFirebaseUrl] = useState();
  const [modalVideoCargado, setModalVideoCargado] = useState(false);
  const [count, setCount] = useState(600);
  const [open, setOpen] = useState(true);

  const locale = {
    noResultsText: "No existen resultados",
    placeholder: "",
    searchPlaceholder: "Buscar",
    checkAll: "",
  };

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  /*PROGRESS VAR CONST*/
  const [percent, setPercent] = useState(0);
  const status = percent === 100 ? "success" : null;
  const color = percent === 100 ? "#DA643A" : "#5DCB42";
  /*CAPTURAR IMAGEN DE VIDEO*/
  const [archivo, setArchivo] = useState();
  const [imgSrc, setImgSrc] = useState();
  const [imgData, setImgData] = useState();
  const [mostrarPrecio, setMostrarPrecio] = useState("Estándar");
  const [activarImagen, setActivarImagen] = useState();
  const [disabledActivo, setDisabledActivo] = useState(false);
  const provincias = [
    { label: "Buenos Aires", value: "Buenos Aires" },
    { label: "Capital Federal", value: "Capital Federal" },
    { label: "Catamarca", value: "Catamarca" },
    { label: "Chaco", value: "Chaco" },
    { label: "Chubut", value: "Chubut" },
    { label: "Córdoba", value: "Cordoba" },
    { label: "Corrientes", value: "Corrientes" },
    { label: "Entre Ríos", value: "Entre Rios" },
    { label: "Formosa", value: "Formosa" },
    { label: "Jujuy", value: "Jujuy" },
    { label: "La Pampa", value: "La Pampa" },
    { label: "Mendoza", value: "Mendoza" },
    { label: "Misiones", value: "Misiones" },
    { label: "Neuquén", value: "Neuquen" },
    { label: "Rio Negro", value: "Rio Negro" },
    { label: "Salta", value: "Salta" },
    { label: "San Luis", value: "San Luis" },
    { label: "Santa Cruz", value: "Santa Cruz" },
    { label: "Santa Fe", value: "Santa Fe" },
    { label: "Santiago Del Estero", value: "Santiago Del Estero" },
    { label: "Tucumán", value: "Tucuman" },
  ];

  const datosUsuarioLogeado = useSelector(
    (state) => state.reducerUsuarioDatos.data
  );

  const listCategoria = useSelector((state) => state.reducerCategorias.data);

  useEffect(() => {
    if (estadoModal != null) {
      setShow(estadoModal);
    }
    if (datosUsuarioLogeado != null) {
      setFirebaseUrl(
        "files/" +
        datosUsuarioLogeado.userData.nombreCompleto.replace(/ /g, "") +
        "/"
      );
    }
  }, [estadoModal, datosUsuarioLogeado]);

  // if (datosUsuarioLogeado != null) {
  //   // firebase =
  //   //   firebase +
  //   //   datosUsuarioLogeado.userData.nombre +
  //   //   "-" +
  //   //   datosUsuarioLogeado.userData.apellido +
  //   //   "/";
  // }

  function enviarImagenPortada(data) {
    if (imgSrc != null) {
      fetch(imgSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const NewFile = new File([blob], "portada-video.png", {
            type: "image/png",
          });
          storageRefImagen = ref(storage, data + NewFile.name);
          uploadBytes(storageRefImagen, NewFile, NewFile.type);
        });
    }
  }

  // var provinciasArray = [];
  // if (provincias != null) {
  //   for (var i = 0; i < provincias.length; i++) {
  //     provinciasArray.push(
  //       {
  //         value:provincias[i].value,
  //         label:provincias[i].nombre,
  //       }
  //     );
  //   }
  // }

  if (listCategoria != null) {
    var categorias = [];
    const lc = listCategoria.data;
    for (var i = 0; i < lc.length; i++) {
      categorias.push({
        value: lc[i].id,
        label: lc[i].nombre,
      });
    }
  }

  function sacarVideo() {
    setArchivo(false);
    setElegirPortada(false);
    setImgSrc("");
  }

  const onChangeBotonCargarVideo = (e) => {
    setArchivo(true);
    setTimeout(() => {
      let file = e.target.files[0];
      let blobURL = URL.createObjectURL(file);
      document.querySelector("video").src = blobURL;
      console.log(blobURL)
      
    }, 100);

    // console.log("que tiene el array " + e.target.value.length)
    //  setArchivo(true);
    // const reader = new FileReader();
    // reader.addEventListener("load", () => {
    //   setImgData(reader.result);
    // });
    // reader.readAsDataURL(e.target.files[0]);
    // setActivarImagen(true);
  };



  const captureThumbnail = () => {
    const canvas = document.createElement("canvas");
    var img = document.getElementById("videoPlayer");
    canvas.width = img.videoWidth;
    canvas.height = img.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(img, 0, 0, img.videoWidth, img.videoHeight);
    setImgSrc(canvas.toDataURL(), "image.png");
    img.pause();
    // img.load();
    console.log("soy imgSrc" + imgSrc);
  };

  useEffect(() => {
    if (archivo == true) {
      setTimeout(() => {
        const canvas = document.createElement("canvas");
        var img = document.getElementById("videoPlayer");
        canvas.width = img.videoWidth;
        canvas.height = img.videoHeight;
        canvas
          .getContext("2d")
          .drawImage(img, 0, 0, img.videoWidth, img.videoHeight);
        setImgSrc(canvas.toDataURL(), "image.png");
        img.pause();
        img.load();
      }, 1000);
    }
  }, [archivo]);

  function elegirPortadaVideo() {
    captureThumbnail();
    setElegirPortada(true);
  }

  const onChangeBotonMostrarPrecio = (e) => {
    setMostrarPrecio(e);
  };

  /////////////////////SUBNUT//////////////
  const onSubmit = (data) => {
    let dateArchivo =
      firebaseUrl + moment().format("MMMM-Do-YYYY-h:mm:ss-a") + "/";
    enviarImagenPortada(dateArchivo);
    // //Cargar un archivo al bucket
    let file = new File([data.video[0]], "video-noticia.mp4", {
      type: data.video[0].type,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    storageRef = ref(storage, dateArchivo + file.name);
    let metadata = {
      contentType: data.video[0].type,
      size: data.video[0].size,
    };
    //Subir video
    // uploadBytes(storageRef, file, metadata);
    //Subir video Prueba
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        setModalVideoCargado(true);
      }
    );
    let enviarPrecio;
    if (mostrarPrecio == "Estándar") {
      enviarPrecio = 2000;
    }
    if (mostrarPrecio == "Premium") {
      enviarPrecio = data.precio;
    }
    //Enviar enviar--
    const datosVideo = {
      titulo: data.nombre,
      descripcion: data.descripcion,
      nombreLocalidad: data.localidad,
      nombreProvincia: data.provincia,
      idCategoria: data.categoria,
      precio: enviarPrecio,
      path: dateArchivo,
      urgente: checkUrgente,
    };

    dispatch(setEnviarVideo(datosVideo));
    setDisabledActivo(true);
  };

  let arregloDeLocalidades = [];
  const [provincia, setProvincia] = useState("");
  const onChangeProvincia = (name) => {
    setProvincia(name);
  };

  if (provincia != null && provincia != "") {
    arregloDeLocalidades = Localidades.sort((a, b) => {
      const n = a.Localidad.localeCompare(b.Localidad);
      return n === 0 && a.Localidad !== n.Localidad
        ? b.Localidad.localeCompare(a)
        : n;
    })
      .filter((localidad) => {
        return localidad.Provincia === provincia;
      })
      .map((option) => ({ label: option.Localidad, value: option.Localidad }));
  }



  function confirmarUrgente() {
    setMostrarModalUrgente(false);
    setCheckUrgente(true);
  }

  function cancelarUrgente() {
    setMostrarModalUrgente(false);
    setCheckUrgente(false);
  }

  function cancelarSubirVideo() {
    setShow(false);
    setArchivo("");
    setElegirPortada(false);
    setCheckUrgente(false);
    setMostrarPrecio("Estándar");
    setEstadoModal(null);
    reset();
  }
  const vistaMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const handlePrint = () => {
    dispatch(ActivarSeccionSidebar(true));
  };
  function volverAlInicio() {
    if (datosUsuarioLogeado != null) {
      const dataVideos = {
        idCategoria: "",
        page: 1,
        fechaInicio: "",
        fechaFin: "",
        calificacion: "",
        estado: "",
        urgente: "",
        userId: datosUsuarioLogeado.userData.idUser,
      };
      dispatch(getRecibirMisVideos(dataVideos));
      reset();
      sacarVideo();
      setPercent(0);
      setModalVideoCargado(false);
      setEstadoModal(null);
      setShow(false);
    }
  }

  //modal info
  const [showInfo, setShowInfo] = useState(false);

  const handleCloseInfo = () => setShowInfo(false);
  const handleShowInfo = () => setShowInfo(true);

  const pressEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }


  return (
    <>
      {show && (
        <>
          {datosUsuarioLogeado != null && (
            <>
              <Modal
                open={show}
                onClose={handleClose}
                backdrop="static"
                keyboard={false}
                className="modal-subir-video"
              >
                <Modal.Body>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-subir-video-container">
                      <div className="caja-arrastrar-video">
                        {archivo ? (
                          <>
                            {vistaMobile == true ? (
                              <>
                                <span className="mobile-video-correcto">
                                  Video seleccionado{" "}
                                  <BsCheckCircle
                                    color="#5dcb42"
                                    fontSize={20}
                                  />
                                </span>
                                <button
                                  disabled={
                                    disabledActivo === true ? true : false
                                  }
                                  className="boton-cerrar-video-mobile"
                                  onClick={sacarVideo}
                                >
                                  Eliminar seleccionado
                                </button>

                              </>
                            ) : (
                              <>
                                <div className="caja-fondo-video">
                                  <button
                                    onKeyPress={(e) => pressEnter(e)}
                                    className="boton-cerrar-video"
                                    onClick={sacarVideo}
                                    disabled={
                                      disabledActivo === true ? true : false
                                    }
                                  >
                                    <AiFillCloseCircle color='#DA643A' />
                                  </button>
                                  <video
                                    disabled={
                                      disabledActivo === true ? true : false
                                    }
                                    poster={imgSrc}
                                    id="videoPlayer"
                                    className="video-cargado-formulario"
                                    src={"mov_bbb.mp4"}
                                    type="video/mp4"
                                    controls
                                    autoPlay
                                  ></video>
                                </div>
                                <div className="caja-barra-video">
                                  {datosUsuarioLogeado.userData.credenciales !=
                                    "Desvinculado" && (
                                      <>
                                        <select
                                          className="precio-video-caja selecct-valor-video"
                                          placeholder="Valor del video"
                                          {...register("valorVideo", {
                                            required: "Campo Requerido",
                                          })}
                                          onChange={(e) =>
                                            onChangeBotonMostrarPrecio(
                                              e.target.value
                                            )
                                          }
                                          disabled={
                                            disabledActivo === true ? true : false
                                          }
                                        >
                                          <option value="Estándar">
                                            Estándar
                                          </option>
                                          <option value="Premium">Premium</option>
                                        </select>
                                        {mostrarPrecio == "Premium" ? (
                                          <>
                                            <div className="precio-video-caja ">
                                              <div>
                                                <p className="valor-video-titulo">
                                                  ¿Cuánto vale tu video?
                                                </p>
                                              </div>
                                              <div className="precio-video">
                                                <input
                                                  disabled={
                                                    disabledActivo === true
                                                      ? true
                                                      : false
                                                  }
                                                  type="number"
                                                  onInput={(e) => {
                                                    if (
                                                      e.target.value.length >
                                                      e.target.maxLength
                                                    )
                                                      e.target.value =
                                                        e.target.value.slice(
                                                          0,
                                                          e.target.maxLength
                                                        );
                                                  }}
                                                  maxlength={5}
                                                  className="selecct-valor-video-premium icon"
                                                  {...register("precio", {
                                                    required: "Campo Requerido",
                                                  })}
                                                ></input>
                                              </div>
                                            </div>
                                            {errors.precio && (
                                              <p className="text-danger">
                                                {errors.precio.message}
                                              </p>
                                            )}
                                          </>
                                        ) : (
                                          ""
                                        )}
                                        {mostrarPrecio == "Estándar" ? (
                                          <div className="precio-video-caja ">
                                            <div className="box-info">
                                              <p className="valor-video-titulo">
                                                Valor del video
                                              </p>
                                            </div>
                                            <div className="precio-video">
                                              <RiMoneyDollarCircleLine color="#DA643A" />
                                              <p>2000</p>
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    )}
                                  {elegirPortada ? (
                                    <>
                                      {disabledActivo === true ? '' : (
                                        <div className="capturar-portada-seccion">
                                          <button
                                            type="button"
                                            className="capturar-imagen-video"
                                            onClick={captureThumbnail}
                                          >
                                            Volver a elegir portada
                                          </button>
                                        </div>
                                      )
                                      }
                                    </>
                                  ) : (
                                    <>
                                      {disabledActivo === true ? '' : (
                                        <button
                                          type="button"
                                          className="capturar-imagen-video"
                                          onClick={elegirPortadaVideo}
                                          disabled={
                                            disabledActivo === true ? true : false
                                          }
                                        >
                                          Elegí la portada para el video.
                                        </button>
                                      )
                                      }
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="seccion-boton-subir-video">
                              <label
                                id="videoUser"
                                htmlFor="videoUpload"
                                className={"boton-adjuntar"}
                              >
                                <div className="caja-cargar-video-input-vacio">
                                  <FiUpload />
                                  <p>Cargá un video aquí</p>
                                </div>
                              </label>
                              <input
                                id="videoUpload"
                                type="file"
                                ondrop="return true;" onpaste="return true;"
                                accept="video/mp4"
                                disabled={
                                  disabledActivo === true ? true : false
                                }
                                // onClick={() => { captureThumbnail(); setElegirPortada(true) }}
                                {...register("video", {
                                  required: "Campo Requerido",
                                  onChange: (e) => {
                                    onChangeBotonCargarVideo(e);
                                  },
                                })}
                              />

                              
                            </div>
                            {errors.video && (
                              <p className="text-danger">
                                {errors.video.message}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      <div className="caja-campos-subir-video">
                        <div className="subir-video-form-fila">
                          <input
                            type="text"
                            onKeyPress={(e) => pressEnter(e)}
                            // maxlength="80"
                            placeholder="Título (60-80 caracteres)"
                            disabled={disabledActivo === true ? true : false}
                            {...register("nombre", {
                              required: "Campo Requerido",
                              minLength: {
                                value: 10,
                                message: "Minimo 10 caracteres"
                              },
                              maxLength: {
                                value: 80,
                                message: "Maximo 80 caracteres"
                              }
                              // ,
                              // pattern: { value: /^[A-Za-z]+$/i, message: "Solo caracteres alfabéticos" }
                            })}

                          />
                          {errors.nombre && (
                            <p className="text-danger">
                              {errors.nombre.message}
                            </p>
                          )}
                        </div>
                        <div className="subir-video-form-fila">
                          <textarea
                            className="descripcion"
                            placeholder="Descripción (máximo 600 caracteres)"
                            disabled={disabledActivo === true ? true : false}
                            {...register("descripcion", {
                              required: "Campo Requerido",
                              maxLength: {
                                value: 600,
                                message: "Maximo 600 caracteres",
                              },
                              onChange: (e) => { setCount(600 - e.target.value.length); console.log(e.target.value.length) }

                            })}
                          ></textarea>
                          <p className={count <= 0 ? "info-caracteres-red" : "info-caracteres"}>{count <= 0 ? count + " Excedido el numero de caracteres permitidos  " : count}</p>
                          {errors.descripcion && (
                            <p className="text-danger">
                              {errors.descripcion.message}
                            </p>
                          )}
                        </div>
                        <div className="select-section">
                          <div className="contenedor-select-subir-video">
                            <div className="select-and-error-block">
                              <Controller
                                control={control}
                                rules={{
                                  required: true,
                                }}
                                render={({ field: { ref, ...field } }) => (
                                  <SelectPicker
                                    disabled={
                                      disabledActivo === true ? true : false
                                    }
                                    locale={locale}
                                    placeholder={"Provincia"}
                                    className="select-categorias-nuevos"
                                    data={provincias}
                                    inputRef={ref}
                                    onChange={(value, e) => {
                                      field.onChange(onChangeProvincia(value));
                                      field.onChange(value);
                                    }}
                                  />
                                )}
                                name="provincia"
                              />
                              {errors.provincia && (
                                <p className="text-danger">Campo Requerido</p>
                              )}
                            </div>
                            <div className="select-and-error-block">
                              <Controller
                                name="localidad"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { ref, ...field } }) => (
                                  <SelectPicker
                                    {...field}
                                    disabled={
                                      disabledActivo === true ? true : false
                                    }
                                    locale={locale}
                                    placeholder={"Localidad"}
                                    className="select-categorias-nuevos"
                                    data={arregloDeLocalidades}
                                    inputRef={ref}
                                  />
                                )}
                              />
                              {errors.localidad && (
                                <p className="text-danger">Campo Requerido</p>
                              )}
                            </div>
                            {vistaMobile == true && datosUsuarioLogeado.userData.credenciales != "Desvinculado" &&
                              (
                                <select
                                  className="precio-video-caja selecct-valor-video"
                                  placeholder="Valor del video"
                                  {...register("valorVideo", {
                                    required: "Campo Requerido",
                                  })}
                                  onChange={(e) =>
                                    onChangeBotonMostrarPrecio(
                                      e.target.value
                                    )
                                  }
                                  disabled={
                                    disabledActivo === true ? true : false
                                  }
                                >
                                  <option value="Estándar">
                                    Estándar
                                  </option>
                                  <option value="Premium">Premium</option>
                                </select>
                              )
                            }
                          </div>
                          <div className="contenedor-select-subir-video">
                            <div className="select-and-error-block">
                              <Controller
                                name="categoria"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { ref, ...field } }) => (
                                  <SelectPicker
                                    {...field}
                                    disabled={
                                      disabledActivo === true ? true : false
                                    }
                                    locale={locale}
                                    placeholder={"Categoría"}
                                    className="select-categorias-nuevos"
                                    data={categorias}
                                    inputRef={ref}
                                  />
                                )}
                              />
                              {errors.categoria && (
                                <p className="text-danger">Campo Requerido</p>
                              )}
                            </div>
                            <div className="checkbox-urgente">
                              <input
                                disabled={disabledActivo === true ? true : false}
                                type="checkbox"
                                id="urgente"
                                value="urgente"
                                checked={checkUrgente}
                                onClick={() => setMostrarModalUrgente(true)}
                              />
                              <label className="urgente-text">URGENTE</label>
                            </div>

                            {vistaMobile == true && datosUsuarioLogeado.userData.credenciales !=
                              "Desvinculado" && (
                                <>
                                  {mostrarPrecio == "Premium" ? (
                                    <>
                                      <div className="precio-video-caja ">
                                        {/* <div>
                                          <p className="valor-video-titulo">
                                            ¿Cuánto vale tu video?
                                          </p>
                                        </div> */}
                                        <div className="precio-video">
                                          <input
                                            disabled={
                                              disabledActivo === true
                                                ? true
                                                : false
                                            }
                                            type="number"
                                            onInput={(e) => {
                                              if (
                                                e.target.value.length >
                                                e.target.maxLength
                                              )
                                                e.target.value =
                                                  e.target.value.slice(
                                                    0,
                                                    e.target.maxLength
                                                  );
                                            }}
                                            maxlength={4}
                                            className="selecct-valor-video-premium icon"
                                            {...register("precio", {
                                              required: "Campo Requerido",
                                            })}
                                          ></input>
                                        </div>
                                      </div>
                                      {errors.precio && (
                                        <p className="text-danger">
                                          {errors.precio.message}
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {mostrarPrecio == "Estándar" ? (
                                    <div className="precio-video-caja ">
                                      <div className="box-info">
                                        {/* < FaInfoCircle
                                          onClick={handleShowInfo}
                                          fontSize={20}
                                          style={{ color: "#5dcb42" }}
                                        /> */}
                                      </div>
                                      <div className="precio-video">
                                        <RiMoneyDollarCircleLine />
                                        <p>2000</p>
                                      </div>
                                      <Modal open={showInfo} onClose={handleCloseInfo}
                                        size="md"
                                        className="modal-importante-precio"
                                      >

                                        <h4 style={{ color: "#DA643A" }} className='titulo-importante-precio-video'>IMPORTANTE:</h4>
                                        <br />
                                        <p className="subtitulo-importante-precio">
                                          El valor de este video está estipulado por el <br />
                                          convenio de Periodistas.
                                        </p>

                                        <br />
                                        <Modal.Footer>
                                          <button className="modal-boton-volver" onClick={() => setOpen(handleCloseInfo)}>Entiendo</button>
                                        </Modal.Footer>
                                      </Modal>


                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </>)
                            }
                            {vistaMobile == true ? mostrarPrecio == "Premium" ?
                              <div>
                                <div>
                                  <p className="valor-video-titulo">
                                    ¿Cuánto vale tu video?
                                  </p>
                                </div>
                              </div>
                              :
                              <div>
                                <div>
                                  <p className="valor-video-titulo">
                                    Valor del video
                                  </p>
                                </div>
                              </div>
                              : ''
                            }
                          </div>
                        </div>

                        {/* <select  {...register("ubicacion", {required: true})}>
                  {ubicacion}
              </select> */}
                        <div className="subir-video-form-fila">
                          <div className="recomendaciones">
                            <p>
                              <b>Recomendaciones</b>
                            </p>
                            <p className="parrafo-subir-video-info">
                              No te olvides de leer los Términos de Condiciones como así también las Políticas de Privacidad. Compartí información chequeada, combatir las fake news es una tarea de toda la comunidad. Hablá claro y fuerte. Una buena iluminación potenciará notablemente tus productos audiovisuales. La calidad del audio y el subtitulado te ayudará a mantener a los usuarios entretenidos con tu contenido. El tiempo apremia, no  grabes más 120 segundos.
                            </p>
                            <p>
                              <b>Formatos</b>
                            </p>
                            <p className="parrafo-subir-video-info">
                              En la era de las redes sociales, el contenido predilecto es el vertical (9:16), evitá grabarte en horizontal. Formato mp4. Duración máxima: 120 segundos y no utilices música con copyright, esto afectará notablemente tu contenido. Podés obtener sonidos libres de licencia desde cualquier biblioteca de audio.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {disabledActivo === true ? (
                      <>
                        {/* <Progress.Line percent={percent} strokeColor={color} status={status} showInfo={true} /> */}
                        <ProgressBar
                          now={percent}
                          label={`${percent}%`}
                          animated
                          variant="#DA643A"
                        />
                      </>
                    ) : (
                      <div className="modal-subir-video-seccion-botones">
                        <button
                          disabled={disabledActivo === true ? true : false}
                          className="boton-cancelar-subir-video"
                          onClick={cancelarSubirVideo}
                        >
                          Cancelar
                        </button>
                        <input
                          disabled={disabledActivo === true ? true : false}
                          className="boton-subir-video"
                          type="submit"
                          value="Aceptar"
                        // onClick={()=> {setDisabledActivo(true)}}
                        />
                      </div>
                    )}
                  </form>
                </Modal.Body>
              </Modal>
              {datosUsuarioLogeado.userData.credenciales === "Desvinculado" && (
                <Modal open={open} onClose={handleClose}
                  size="md"
                  className="modal-cuenta-desvinculada"
                >
                  <Modal.Body>
                    <p className="subtitulo-importante-precio">
                      Para subir tu pimer video necesitas vincular <br />
                      tu cuenta con un método de cobro.
                    </p>
                  </Modal.Body>

                  <Modal.Footer>
                    <Link className="button-enlazar-cuenta-modal" to="/User/Mis-finanzas" onClick={handlePrint} >
                      Continuar a MercadoPago
                    </Link>
                    <button className="boton-continuar-modal-vincular" onClick={() => setOpen(false)}>Continuar</button>
                  </Modal.Footer>
                </Modal>
              )}
              <Modal
                open={mostrarModalUrgente}
                backdrop="static"
                centered
                className="modal-categoria-urgente"
              >
                <Modal.Header>
                  <Modal.Title> <h3 className="titulo-modal-exitoso">IMPORTANTE:</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overlay: 'hidden' }}>
                  <p className="subtitulo-importante-precio">
                    Si nuestros administradores detectan que tu <br />
                    video no es para la categoría “URGENTE”, <br />
                    podrías recibir una penalización.
                  </p>
                  <p className="subtitulo-importante">¿Elegiste bien?</p>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="modal-boton-volver-urgente"
                    onClick={confirmarUrgente}
                  >
                    ¡Sí, es urgente!
                  </button>
                  <button
                    className="boton-continuar-modal-urgente"
                    onClick={cancelarUrgente}
                  >
                    Cancelar
                  </button>
                </Modal.Footer>



              </Modal>
            </>
          )}

          {/* <Modal className='modal-registro-exitoso' show={modalVideoCargado} size="lg" backdrop="static" centered>
                  <Modal.Body>
                    <BsCheckCircleFill />
                    
                    
                  </Modal.Body>
            </Modal> */}
          <Modal
            className="modal-cuenta-desvinculada"
            open={modalVideoCargado}
            // size="lg"
            backdrop="static"
            centered
          >
            <Modal.Body>
              <Modal.Title>
                <div className="contenedor-titulos-exitoso">
                  <h4 className="titulo-modal-exitoso">
                    ¡Video cargado exitosamente!
                  </h4>
                  <p className="subtitulo-modal-exitoso">
                    Ya podés disfrutarlo en tu galeria de videos
                  </p>
                </div>
              </Modal.Title>
              <Modal.Footer>
                <button
                  onClick={() => {
                    volverAlInicio();
                    setDisabledActivo(false);
                    setCount(600);
                  }}
                  className="modal-boton-volver"
                >
                  Volver al inicio
                </button>
              </Modal.Footer>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
}
