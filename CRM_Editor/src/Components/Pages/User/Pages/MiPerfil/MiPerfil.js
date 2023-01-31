import React, { useState, useEffect } from "react";
import { Uploader, Message, Loader } from "rsuite";
import { Rate } from "rsuite";
import { useMediaQuery } from 'react-responsive'
import { useForm } from "react-hook-form";
import Avatar from "rsuite/Avatar";
import { BsCameraFill } from 'react-icons/bs';
//imports styles
import "./miPerfil.css";

//imports Icons
import { IoGolfOutline } from "react-icons/io5";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import { MdModeEditOutline } from "react-icons/md";

//UseSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";

import { editarPerfilUsuario } from '../../../../../Actions/EditarPerfil'
import { getDatosUsuario } from '../../../../../Actions/datosUsuario'

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";


export default function MiPerfil() {
  const [imagenUrl, setImagenUrl] = useState()
  const [datosEditados, setDatosEditados] = useState({})
  const [foto, setFile] = useState({ imagenPerfilUser: "" });

  //traer datos usuario
  const datosUser = useSelector((state) => state.reducerUsuarioDatos);
  const misVideos = useSelector((state) => state.reducerMostrarMisVideos);
  const respuestaEditarPerfil = useSelector((state) => state.reducerEditarPerfilUsuario);

  const storage = getStorage();
  // editar inputs-perfil 
  const [activarEdit, setActivarEdit] = useState(true);
  const dispatch = useDispatch();

  const [mostrarImagenPerfil, setMostrarImagenPerfil] = useState("");

  // ENVIAR FORMULARIO//
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: "onChange"
  });

  const onChangue = (event) => {
    setFile({
      ...foto,
      [event.target.name]: event.target.files[0]
    });
  }


  useEffect(() => {
    if (foto.imagenPerfilUser != null && foto.imagenPerfilUser != "") {
      //Cargar un archivo al bucket
      console.log("foto.imagenPerfilUser " + foto.imagenPerfilUser)
      let file = new File([foto.imagenPerfilUser], foto.imagenPerfilUser.name + ".jpg", { type: foto.imagenPerfilUser.type });
      let storageRef = ref(storage, imagenUrl);
      uploadBytes(storageRef, file);

      const enviarDatosEditados = ({
        nombreCompleto: datosUser.data.userData.nombreCompleto,
        telefono: datosUser.data.userData.telefono,
        descripcion: datosUser.data.userData.descripcion,
        pathFotoPerfil: imagenUrl,
      });
      dispatch(editarPerfilUsuario(enviarDatosEditados));
    }
  }, [foto]);

  useEffect(() => {
    if (datosUser != null && datosUser.data != null && datosUser.data.userData != null) {
      setDatosEditados({
        nombreCompleto: datosUser.data.userData.nombreCompleto,
        telefono: datosUser.data.userData.telefono,
        descripcion: datosUser.data.userData.descripcion,
      });
    }
  }, [datosUser]);



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


  const onSubmit = (data) => {
    if (foto.imagenPerfilUser != null && foto.imagenPerfilUser != "") {
      //Cargar un archivo al bucket
      console.log("foto.imagenPerfilUser " + foto.imagenPerfilUser)
      let file = new File([foto.imagenPerfilUser], foto.imagenPerfilUser.name + ".jpg", { type: foto.imagenPerfilUser.type });
      let storageRef = ref(storage, imagenUrl);
      uploadBytes(storageRef, file);
    }

    setActivarEdit(!activarEdit);
    const enviarDatosEditados = ({
      nombreCompleto: data.nombreCompleto,
      telefono: data.telefono,
      descripcion: data.descripcion,
      pathFotoPerfil: imagenUrl,
    });
    dispatch(editarPerfilUsuario(enviarDatosEditados));
  };


  useEffect(() => {
    if (respuestaEditarPerfil != null && respuestaEditarPerfil.data != null && respuestaEditarPerfil.data.message === "Usuario actualizado") {
      dispatch(getDatosUsuario());
    }
  }, [respuestaEditarPerfil]);




  const vistaMobile = useMediaQuery({
    query: '(max-width: 768px)'
  })


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


  return (
    <div className="mi-perfil-container">
      {vistaMobile == true ?
        <>
          <form onSubmit={handleSubmit(onSubmit)} className='contenedor-form-perfil'>
            <div className="contenedor-info-mobile-miperfil">
              <div className="titulo-edit-mobile">
                <h5 className="titulo-explorar">Mi perfil</h5>

                {activarEdit != true ? '' : <MdModeEditOutline className="lapiz-editar-mobile" fontSize={30} onClick={() => setActivarEdit(!activarEdit)} />}

                {activarEdit != true ? <input type="submit" className="guardar-cambios-editar" value='Guardar' /> : ''}

              </div>
              <div className="box-nombre-mobile-perfil">
                <div className="imagen-de-perfil">
                  {/* <label
                    htmlFor="imagenPerfil"
                    disabled={activarEdit}
                    className={activarEdit != true ? "boton-adjuntar-imagen-perfil-borde-mobile" : "boton-adjuntar-imagen-perfil-mobile"}
                  >
                    <img className="imagen" src={mostrarImagenPerfil} />
                  </label> */}
                  {mostrarImagenPerfil == false ?
                        <>

                          <label
                            htmlFor="imagenPerfil"
                            disabled={activarEdit}
                            className={activarEdit != true ? "boton-adjuntar-imagen-perfil-borde-mobile" : "boton-adjuntar-imagen-perfil-mobile"}
                          >

                            <img className="imagen" src='https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg' />
                            {/* <div className="overlay">
                              <BsCameraFill className="text"></BsCameraFill>
                            </div> */}
                          </label>
                        </>
                        :
                        <>
                          <label
                            htmlFor="imagenPerfil"
                            disabled={activarEdit}
                            className={activarEdit != true ? "boton-adjuntar-imagen-perfil-borde-mobile" : "boton-adjuntar-imagen-perfil-mobile"}
                          >

                            <img className="imagen" src={mostrarImagenPerfil} />
                            {/* <div className="overlay">
                              <BsCameraFill className="text"></BsCameraFill>
                            </div> */}
                          </label>
                        </>
                      }




                  <input

                    disabled={activarEdit}
                    name="imagenPerfilUser"
                    style={{ display: "none" }}
                    id="imagenPerfil"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => mostrarImagenUser(e)}
                  />
                </div>
                <div className="separacion-infor-mobile">
                  <div className="datos-usuario-perfil">
                    <h5 className="nombre-usuario-perfil">
                      <input
                        className="input-editar-perfil-usuario"
                        readOnly={activarEdit}
                        type="text"
                        defaultValue={datosUser.data != null ? datosUser.data.userData.nombreCompleto : ''}
                        {...register("nombreCompleto",
                        {
                          minLength: {
                            value: 4,
                            message: "Minimo 4 caracteres"
                          },
                          maxLength: {
                            value: 30,
                            message: "Maximo 30 caracteres"
                          },
                          pattern: { value: /[a-zA-Z ]{2,254}/i, message: "Solo caracteres alfabéticos" }
                        }
                        )}
                      />
                      {errors.nombreCompleto && <p className='error'>{errors.nombreCompleto.message}</p>}
                    </h5>
                    <Rate
                      style={{ color: '#DDE100!important' }}
                      className="sidebar-user-rate"
                      readOnly={true}
                      value={datosUser.data != null ? datosUser.data.userData.calificacion : ""}
                      size="xs"
                    />
                    <p className="otros-datos-usuario-perfil">
                      {datosUser.data != null ? datosUser.data.userData.email : ''}
                    </p>
                    <input
                      className="input-editar-perfil-usuario-telefono"
                      readOnly={activarEdit}
                      type="text"
                      defaultValue={datosUser.data != null ? datosUser.data.userData.telefono : ''}
                      {...register("telefono",
                      {
                        minLength: {
                          value: 6,
                          message: "Minimo 6 caracteres"
                        },
                        maxLength: {
                          value: 12,
                          message: "Maximo 12 caracteres"
                        },
                        pattern: { value: /^^[0-9]+$/i, message: "Solo caracteres numéricos" }
                      }
                      )}
                    />
                     {errors.telefono && <p className='error'>{errors.telefono.message}</p>}
                  </div>
                  <div className="contenedor-baneados-mobile">
                    <div className="box-baneado-strik-mobile">
                      <IoGolfOutline />
                      <p>Strike : <b>{datosUser.data != null ? datosUser.data.userData.strikes : ''}</b></p>
                    </div>
                    <div className="box-baneado-strik-mobile">
                      <img
                        className="icono-baneo"
                        alt="user-block"
                        src="https://res.cloudinary.com/grupo-delsud/image/upload/v1660836843/EditorPlus/userBlock.svg"
                      />
                      <p className="titulo-baneado"> BANEADO : {datosUser.data != null ? datosUser.data.userData.banneado == true ? <b>SI</b> : <b>NO</b> : null}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div className="box-descripcion-mobile" >
              {/* <div className="seccion-acerca-de-perfil-texto"> */}
              <textarea
                className="seccion-acerca-de-perfil-texto input-editar-perfil-usuario-text-area"
                readOnly={activarEdit}
                type="text"
                name="descripcion"
                placeholder="descripción"
                defaultValue={datosUser.data != null ? datosUser.data.userData.descripcion : 'Sin descripción'}
                {...register("descripcion",
                {
                  minLength: {
                    value: 6,
                    message: "Minimo 6 caracteres"
                  },
                  maxLength: {
                    value: 300,
                    message: "Maximo 300 caracteres"
                  }
                }
                )}
              />
              {errors.descripcion && <p className='error'>{errors.descripcion.message}</p>}
              {/* </div> */}
              {misVideos.data != null && misVideos != null && misVideos.data.data != null ? (
                <div className="estadisticas-videos-usuario">
                  <div className="estadisticas-videos-usuario-columna">
                    <div className="estadisticas-videos-usuario-fila">
                      <div className="circulo-mobile"><p className="font-botonVerde">{misVideos.data.data.length}</p></div>
                      <p className="cantidad-de-videos-valor">
                        Videos visualizados
                      </p>
                    </div>
                    <div className="estadisticas-videos-usuario-fila">
                      <p>Videos cargados</p>
                      <p className="cantidad-de-videos-valor">
                        {datosUser.data != null ? datosUser.data.userData.videosCargados : ''}
                      </p>
                    </div>
                  </div>
                  <div className="estadisticas-videos-usuario-columna">
                    <div className="estadisticas-videos-usuario-fila">
                      <p>Videos monetizados</p>
                      <p className="cantidad-de-videos-valor">
                        {datosUser.data != null ? datosUser.data.userData.videosMonetizados : ''}
                      </p>
                    </div>
                    <div className="estadisticas-videos-usuario-fila">
                      <p>Videos no monetizados</p>
                      <p className="cantidad-de-videos-valor">
                        {datosUser.data != null ? datosUser.data.userData.videosNoMonetizados : ''}
                      </p>
                    </div>
                    {/* <div className="estadisticas-videos-usuario-fila">
                      <p className="cantidad-de-videos-valor">
                        {misVideos.data.data.length}
                      </p>
                    </div> */}
                  </div>
                </div>
              ) :

                ''

              }
            </div>
          </form>
        </>
        :
        <>
          <div className="sub-container-mi-perfil">
            <form onSubmit={handleSubmit(onSubmit)} className='contenedor-form-perfil'>
              <div className="caja-header-seccion-perfil">
                <h5>Mi perfil</h5>
                {activarEdit != true ? '' : <button className="button-editar" onClick={() => setActivarEdit(!activarEdit)}>Editar perfil</button>}
                {activarEdit != true ? <input type="submit" className="guardar-cambios-editar" value='Guardar cambios personales' /> : ''}
              </div>
              <div className="caja-seccion-perfil">
                <div className="contenedor-informacion-usuario">
                  <div className="usuario-estado">
                    <div className="strikes-user-perfil">
                      <IoGolfOutline />
                      <p>Strike : <b>{datosUser.data != null ? datosUser.data.userData.strikes : ''}/3</b></p>
                    </div>
                    <div className="banned-user-perfil">
                      <img
                        alt="user-block"
                        src="https://res.cloudinary.com/grupo-delsud/image/upload/v1660836843/EditorPlus/userBlock.svg"
                      />
                      <p className="font-baneado">{datosUser.data != null ? datosUser.data.userData.banneado == true ? <b> BANEADO : SI</b> : <b> BANEADO : NO</b> : null}</p>
                    </div>
                  </div>
                  <div className="seccion-datos-usuario">


                    {/* <input
                      disabled={activarEdit}
                      name="imagenPerfilUser"
                      style={{ display: "none" }}
                      id="imagenPerfil"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={(e) => mostrarImagenUser(e)}
                    /> */}
                    <div className="cargar-imagen-perfil-box">
                      {/* <label
                        htmlFor="imagenPerfil"
                        className="boton-adjuntar-imagen-perfil "
                      >

                        <img className="imagen" src={mostrarImagenPerfil} />
                        <div className="overlay">
                          <BsCameraFill className="text"></BsCameraFill>
                        </div>
                      </label> */}
                      {mostrarImagenPerfil == false ?
                        <>

                          <label
                            htmlFor="imagenPerfil"
                            className="boton-adjuntar-imagen-perfil "
                          >

                            <img className="imagen" src='https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg' />
                            <div className="overlay">
                              <BsCameraFill className="text"></BsCameraFill>
                            </div>
                          </label>
                        </>
                        :
                        <>
                          <label
                            htmlFor="imagenPerfil"
                            className="boton-adjuntar-imagen-perfil "
                          >

                            <img className="imagen" src={mostrarImagenPerfil} />
                            <div className="overlay">
                              <BsCameraFill className="text"></BsCameraFill>
                            </div>
                          </label>
                        </>
                      }
                      <input
                        name="imagenPerfilUser"
                        style={{ display: "none" }}
                        id="imagenPerfil"
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e) => mostrarImagenUser(e)}
                      />
                    </div>
                    <div className="datos-usuario-perfil">
                      <p className="nombre-usuario-perfil">
                        <input
                          type="text"
                          contenteditable="true"
                          className="input-editar-perfil-usuario"
                          readOnly={activarEdit}

                          defaultValue={datosUser.data != null ? datosUser.data.userData.nombreCompleto : ''}
                          {...register("nombreCompleto",
                            {
                              minLength: {
                                value: 4,
                                message: "Minimo 4 caracteres"
                              },
                              maxLength: {
                                value: 30,
                                message: "Maximo 30 caracteres"
                              },
                              pattern: { value: /^[A-Za-z]+$/i, message: "Solo caracteres alfabéticos" }
                            }
                          )}
                        />
                        {errors.nombreCompleto && <p className='error'>{errors.nombreCompleto.message}</p>}
                      </p>
                      <Rate
                        style={{ color: '#DDE100!important' }}
                        className="sidebar-user-rate editar-perfil-rate"
                        readOnly={true}
                        value={datosUser.data != null ? datosUser.data.userData.calificacion : ""}
                        size="md"
                      />
                      <p className="otros-datos-usuario-perfil">
                        {datosUser.data != null ? datosUser.data.userData.email : ''}
                      </p>
                      <p className="otros-datos-usuario-perfil">
                        Celular:
                        <input
                          className="input-editar-perfil-usuario-telefono"
                          readOnly={activarEdit}
                          type="tel"
                          defaultValue={datosUser.data != null ? datosUser.data.userData.telefono : ''}
                          {...register("telefono",
                            {
                              minLength: {
                                value: 6,
                                message: "Minimo 6 caracteres"
                              },
                              maxLength: {
                                value: 12,
                                message: "Maximo 12 caracteres"
                              },
                              pattern: { value: /^^[0-9]+$/i, message: "Solo caracteres numéricos" }
                            }
                          )}
                        />
                        {errors.telefono && <p className='error'>{errors.telefono.message}</p>}
                      </p>
                    </div>

                  </div>
                </div>
                <div className="seccion-acerca-de-perfil">
                  <div className="seccion-acerca-de-perfil-texto">
                    <textarea
                      className="seccion-acerca-de-perfil-texto input-editar-perfil-usuario-text-area"
                      readOnly={activarEdit}
                      type="text"
                      placeholder="Descripción"
                      name="descripcion"
                      defaultValue={datosUser.data != null ? datosUser.data.userData.descripcion : ''}
                      {...register("descripcion",
                        {
                          minLength: {
                            value: 6,
                            message: "Minimo 6 caracteres"
                          },
                          maxLength: {
                            value: 300,
                            message: "Maximo 300 caracteres"
                          }
                        }
                      )}
                    />
                    {errors.descripcion && <p className='error'>{errors.descripcion.message}</p>}
                  </div>
                  <div className="container-cantidad-videos-perfil-usuario">
                    {misVideos.data != null && misVideos != null && misVideos.data.data != null ? (
                      <div className="cantidad-de-videos">
                        <p className="cantidad-de-videos-valor">
                          {misVideos.data.data.length}
                        </p>
                        <p className="cantidad-de-videos-texto">videos <br /> visualizados</p>
                      </div>
                    ) : (
                      <div className="cantidad-de-videos">
                        <p className="cantidad-de-videos-texto">Sin videos visualizados</p>
                      </div>
                    )}
                  </div>

                </div>
                <div style={{ width: '100%' }}>
                  {misVideos.data != null && misVideos != null && misVideos.data.data != null
                    ?
                    (
                      <div className="estadisticas-videos-usuario">
                        <div className="estadisticas-videos-usuario-columna">
                          <div className="estadisticas-videos-usuario-fila">
                            <p>Videos cargados</p>
                            <p className="cantidad-de-videos-valor">
                              {datosUser.data != null ? datosUser.data.userData.videosCargados : ''}
                            </p>
                          </div>
                          {/* <div className="estadisticas-videos-usuario-fila">
                      <p>Videos calificados</p>
                      <p className="cantidad-de-videos-valor">
                      {datosUser.data != null ? datosUser.data.userData.videosCalificados : ''}
                      </p>
                    </div> */}
                          <div className="estadisticas-videos-usuario-fila">
                            <p>Strikes</p>
                            <p className="cantidad-de-videos-valor">
                              {datosUser.data != null ? datosUser.data.userData.strikes : ''}
                            </p>
                          </div>
                        </div>
                        <div className="estadisticas-videos-usuario-columna">
                          <div className="estadisticas-videos-usuario-fila">
                            <p>Videos monetizados</p>
                            <p className="cantidad-de-videos-valor">
                              {datosUser.data != null ? datosUser.data.userData.videosMonetizados : ''}
                            </p>
                          </div>
                          <div className="estadisticas-videos-usuario-fila">
                            <p>Videos no monetizados</p>
                            <p className="cantidad-de-videos-valor">
                              {datosUser.data != null ? datosUser.data.userData.videosNoMonetizados : ''}
                            </p>
                          </div>
                          <div className="estadisticas-videos-usuario-fila">
                            <p>Baneado</p>
                            <p className="cantidad-de-videos-valor">
                              {/* {misVideos.data.data.length} */}
                              {datosUser.data != null ? datosUser.data.userData.banneado == true ? 'Si' : 'No' : null}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                    :
                    (
                      <div className="estadisticas-videos-usuario">
                        <p>Suba un video para ver sus estadísticas</p>
                      </div>
                    )
                  }
                </div>

              </div>
            </form>


          </div>
        </>
      }
    </div>
  );
}