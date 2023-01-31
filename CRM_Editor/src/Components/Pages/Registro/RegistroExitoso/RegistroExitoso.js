import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import './registroExitoso.css'

export default function RegistroExitoso(props) {
 
  const dataUser = props.dataUsuario;
  const modalEstado = props.abrirModalRegistroExitoso;
  const [open, setOpen] = useState(modalEstado != null);
  
  return (
    <>
      {(open) &&
        <Modal className='modal-registro-exitoso' open={modalEstado} size="md" backdrop="static">
          <Modal.Body>
            <div className='container-modal-exitoso'>
              <BsCheckCircleFill className='icon-register-exitoso' />
              <h5>¡Cuenta creada con éxito!</h5>
              <p>Te hemos enviado a tu mail un código y los pasos a seguir<br /> para verificar tu cuenta.</p>
              <hr className='linea-register' />
              <p><b>Revisá tu bandeja de correo no deseado, <br></br> puede haber llegado ahí.</b></p>
              { dataUser != null ?
              <Link to={"/CodigoSeguridad?email="+dataUser.email} className='modal-boton-volver'>Siguiente</Link>
              : ''
              }
            </div>
          </Modal.Body>
        </Modal>
      }
    </>
  )
}
