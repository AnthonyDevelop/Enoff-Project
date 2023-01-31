import React, { useState, useEffect } from "react";
import { Uploader, Message, Loader } from "rsuite";
import { Rate } from "rsuite";
import { useMediaQuery } from 'react-responsive'
import { useForm } from "react-hook-form";
import Avatar from "rsuite/Avatar";
import { Link } from 'react-router-dom'
//imports styles
import "./ConfiguracionPerfilAdmin.css";
import { BsCameraFill } from 'react-icons/bs';
//imports Icons
import { IoGolfOutline } from "react-icons/io5";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import { MdModeEditOutline } from "react-icons/md";

//UseSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";


import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { editarPerfilUsuario } from "../../../../../../Actions/EditarPerfil";
import { getDatosUsuario } from "../../../../../../Actions/datosUsuario";


export default function ConfiguracionPerfilAdmin() {
  const [imagenUrl, setImagenUrl] = useState()
  const [datosEditados, setDatosEditados] = useState({})
  const [foto, setFile] = useState({ imagenPerfilUser: "" });

  //traer datos usuario
  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
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
    if (datosUser != null && datosUser.data != null && datosUser.data.userData != null) {
      setDatosEditados({
        nombreCompleto: datosUser.data.userData.nombreCompleto,
        telefono: datosUser.data.userData.telefono,
        descripcion: datosUser.data.userData.descripcion,
      });
    }
  }, [datosUser]);



  useEffect(async () => {
    if (datosUser != null) {
      let gsReference = ref(storage, "gs://sistemas-delsud.appspot.com/" + datosUser.userData.pathFotoPerfil);
      setImagenUrl("imagenes-de-perfil/" + datosUser.userData.email)
      if (datosUser.userData.pathFotoPerfil == null) {
        setMostrarImagenPerfil("https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg")
      }
      if (datosUser.userData.pathFotoPerfil != null) {
        setMostrarImagenPerfil(await getDownloadURL(gsReference))
      }
    }
  }, [datosUser]);

  const onSubmit = (data) => {
    if (foto.imagenPerfilUser != null && foto.imagenPerfilUser != "") {
      //Cargar un archivo al bucket
      let file = new File([foto.imagenPerfilUser], foto.imagenPerfilUser.name + ".jpg", { type: foto.imagenPerfilUser.type });
      let storageRef = ref(storage, imagenUrl);
      uploadBytes(storageRef, file);
    }

    setActivarEdit(!activarEdit);
    const enviarDatosEditados = ({
      nombreCompleto: data.nombreCompleto,
      telefono: '',
      descripcion: '',
      pathFotoPerfil: imagenUrl,
    });
    dispatch(editarPerfilUsuario(enviarDatosEditados));
    // setTimeout(() => {
    //   dispatch(getDatosUsuario());
    // }, 2500);

  };

 useEffect(() => {
    if (respuestaEditarPerfil != null && respuestaEditarPerfil.data != null && respuestaEditarPerfil.data.message === "Usuario actualizado") {
      dispatch(getDatosUsuario());
    }
  }, [respuestaEditarPerfil]);


  const vistaMobile = useMediaQuery({
    query: '(max-width: 998px)'
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
      <div className="sub-container-mi-perfil">
        <form onSubmit={handleSubmit(onSubmit)} className='contenedor-form-perfil'>
          <div className="caja-header-seccion-perfil">
            <h5>Mi perfil</h5>
            {activarEdit != true ? '' : <button className="button-editar" onClick={() => setActivarEdit(!activarEdit)}>Editar perfil</button>}
            {activarEdit != true ? <input type="submit" className="guardar-cambios-editar" value='Guardar cambios personales' /> : ''}
          </div>
          <div className="caja-seccion-perfil">
            <div className="contenedor-informacion-usuario">

              <div className="seccion-datos-usuario">

                {/* {mostrarImagenPerfil == false ?
                  <div className="imagen-de-perfil">
                    <label
                      className={activarEdit != true ? "boton-adjuntar-imagen-perfil-borde" : "boton-adjuntar-imagen-perfil"}
                      htmlFor="imagenPerfil"
                      disabled={activarEdit}
                    >
                      <img className="imagen" src='https://res.cloudinary.com/grupo-delsud/image/upload/v1670252546/eleditorNoticias/Group_17778_ujcekc_1_otlhmv.svg' />
                    </label>
                  </div>
                  :
                  <div className="imagen-de-perfil">
                    <label
                      className={activarEdit != true ? "boton-adjuntar-imagen-perfil-borde" : "boton-adjuntar-imagen-perfil"}
                      htmlFor="imagenPerfil"
                      disabled={activarEdit}
                    >
                      <img className="imagen" src={mostrarImagenPerfil} />
                    </label>
                  </div>
                } */}
                <label
                  htmlFor="imagenPerfil"
                  className="boton-adjuntar-imagen-perfil "
                >

                  <img className="imagen" src={mostrarImagenPerfil} />
                  <div className="overlay">
                    <BsCameraFill className="text"></BsCameraFill>
                  </div>
                </label>
                <input
                  name="imagenPerfilUser"
                  style={{ display: "none" }}
                  id="imagenPerfil"
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={(e) => mostrarImagenUser(e)}
                />
                <div className="datos-usuario-perfil">
                  <p className="nombre-usuario-perfil">
                    <input
                      className="input-editar-perfil-usuario"
                      readOnly={activarEdit}
                      type="text"
                      defaultValue={datosUser != null ? datosUser.userData.nombreCompleto : ''}
                      {...register("nombreCompleto")}
                    />
                  </p>
                  <p className="otros-datos-usuario-perfil">
                    {datosUser != null ? datosUser.userData.email : ''}
                  </p>

                </div>

              </div>
            </div>
            <div className="box-viñetas-info-vista-Admin">
              <div className="box-titulo-burbujas">
                <h2>Actividad</h2>
              </div>
              <div className="contenedor-burbujas">
                <Link className="link-perfil-vedor" to='/Admincontenido/Descartados'>
                  <div className="cantidad-de-videos-vedor">
                    <p className="font-circulo-perfil-vedor">
                      {datosUser != null ? <p>$ {datosUser.userData.montoCompraMensual}</p> : 'Sin datos'}
                    </p>
                    <p >de $60.000</p>
                  </div>
                </Link>
                <Link className="link-perfil-vedor" to='/Admincontenido/Descartados'>
                  <div className="cantidad-de-videos-vedor">
                    <p className="cantidad-de-videos-valor-vedor">
                      {datosUser != null ? datosUser.userData.videosDescartados : ''}
                    </p>
                    <p className="cantidad-de-videos-texto-vedor">videos <br /> <b>descartados</b></p>
                  </div>
                </Link>
                <Link className="link-perfil-vedor" to='/Admincontenido/Guardado'>
                  <div className="cantidad-de-videos-vedor">
                    <p className="cantidad-de-videos-valor-vedor">
                      {datosUser != null ? datosUser.userData.videosGuardados : ''}
                    </p>
                    <p className="cantidad-de-videos-texto-vedor">videos <br /> <b>guardados</b></p>
                  </div>
                </Link>
                <Link className="link-perfil-vedor" to='/Admincontenido/Destacados'>
                  <div className="cantidad-de-videos-vedor">
                    <p className="cantidad-de-videos-valor-vedor">
                      {datosUser != null ? datosUser.userData.videosDestacados : ''}
                    </p>
                    <p className="cantidad-de-videos-texto-vedor">videos <br /> <b>destacados</b></p>
                  </div>
                </Link>
                <Link className="link-perfil-vedor" to='/Admincontenido/Adquiridos'>
                  <div className="cantidad-de-videos-vedor">
                    <p className="cantidad-de-videos-valor-vedor">
                      {datosUser != null ? datosUser.userData.videosAdquiridos : ''}
                    </p>
                    <p className="cantidad-de-videos-texto-vedor">videos <br /> <b>adquiridos</b></p>
                  </div>
                </Link>
              </div>
              <div>
                <p className="limite-compra-vedor-perfil">Límite de compra mensual</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}