import React, { useEffect } from "react";
import { Modal, Button } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { setEliminarVideoUser } from "../../../../../../Actions/AccionEliminarVideoUser";
import { getRecibirMisVideos } from "../../../../../../Actions/MostrarVideos";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";



export default function ModalEliminarVideo({ open, setOpen, data, info, setChecked }) {
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);
  const storage = getStorage();
  var storageRef = "";
  var storageRefImage = "";

  const datosUser = useSelector((state) => state.reducerUsuarioDatos.data);
  const confirmarVideosEliminados = useSelector((state) => state.reducerConfirmarVideosEliminados.data);

  const testBorrar = () => {
    for (var i = 0; i < info.data.data.length; i++) {
      for (var j = 0; j < data.length; j++) {
        if (info.data.data[i].idPublicacion == data[j]) {
          deleteObject(ref(storage, info.data.data[i].path + "/" + "video-noticia.mp4")).then(() => {
            // File deleted successfully
          }).catch((error) => {
            // alert('no se pudo borrar el contenido');
          });

          deleteObject(ref(storage, info.data.data[i].path + "/" + "portada-video.png")).then(() => {
            // File deleted successfully
          }).catch((error) => {
            // alert('no se pudo borrar el contenido');
          });
        }
      }
    }
    // deleteObject(storageRef).then(() => {
    //   // File deleted successfully
    // }).catch((error) => {
    //   alert('no se pudo borrar el contenido');
    // });
    // deleteObject(storageRefImage).then(() => {
    //   // File deleted successfully
    // }).catch((error) => {
    //   alert('no se pudo borrar el contenido');
    // });
  }


  function eliminarVideoUsuario() {
    testBorrar();
    const array = data;
    dispatch(setEliminarVideoUser(array));
    handleClose();
    setChecked([]);
  }

  useEffect(() => {
    if (confirmarVideosEliminados != null) {
      const dataListaVideos = {
        // busqueda: "",
        idCategoria: "",
        // localidad:"",
        // provincia:"",
        calificacion: "",
        fechaInicio: "",
        fechaFin: "",
        page: 1,
        estado: "",
        urgente: "",
        userId: datosUser.userData.idUser,
      };
      dispatch(getRecibirMisVideos(dataListaVideos));

    }

  }, [confirmarVideosEliminados]);


  return (


    <Modal
      open={open}
      onClose={handleClose}
      className="modal-eliminar-video"
      size="xs"
    >
      {/* <Modal.Body> */}
        <div className='tittle-modal-cerrar'>
          ¿Estás seguro de eliminar este video?
        </div>
        <div className='container-button-cerrar'>
          <button className="modal-boton-eliminar-video" onClick={eliminarVideoUsuario}>
            Eliminar
          </button>
          <button className="modal-boton-cancelar-eliminar-video" onClick={handleClose}>
            Cancelar
          </button>
        </div>
      {/* </Modal.Body> */}
    </Modal>

  );
}
