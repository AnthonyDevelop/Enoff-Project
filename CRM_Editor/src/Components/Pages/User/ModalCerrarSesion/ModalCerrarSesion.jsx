import React from 'react'
import { Modal} from 'rsuite';
import { useDispatch } from 'react-redux';
import { verificarLogin } from '../../../../Actions/login';

import "./modalCerrarSesion.css"

export default function ModalCerrarSesion({ open, setOpen }) {
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);

  //CERRAR SESION
  function handleCerrarSesion() {
    dispatch(verificarLogin(false))
    localStorage.removeItem('token');
    localStorage.clear()
    return (window.location = ("/"))
  }

  return (

    <>
      <Modal backdrop="static" size='xs' open={open} onClose={handleClose} 
      className="modal-cerrar-sesion"
      >
          <div className='tittle-modal-cerrar'> ¿Querés cerrar sesión? </div>
          <div className='container-button-cerrar'>
            <input type="button" className='boton-cerrar-sesion' onClick={handleCerrarSesion} value="Cerrar sesión" />
            <input type="button" className='button-cancelar' onClick={handleClose} value="Cancelar" />
          </div>
      </Modal>
    </>
  )
}
