import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Modal } from 'react-bootstrap';
//Styles
import "./recordarContrasena.css"
import NavbarEditor from '../../../Navbar/Navbar';

export default function RecordarContrasena() {
  const navegarRegistro = useNavigate();
  const [mostarCodigo, setMostrarCodigo] = useState();
  const [codigoEnviadoRespuesta, setCodigoEnviadoRespuesta] = useState(null);
  const [show, setShow] = useState(false);

  // VALIDAD CODIGO USER
  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit
  } = useForm({
    mode: "onChange"
  });

  const onSubmitResetContrasena = (data) => {
    setMostrarCodigo(true);
    axios.post(`https://enoff.com.ar/server/public/correoResetContrasena`, data)
      .then(function (response) {
        console.log(response)
        setShow(true)
      })
      .catch(function (error) {
        console.log(error)
      });

  };

  return (
    <>
      <NavbarEditor />
      <div className='validar-mail-container'>
        <h5>Recuperá tu contraseña</h5>
        <div className='validar-mail-box'>
          <p>Ingresá el correo que registraste para poder enviarte un código de recuperación.</p>
          <form className='formulario-validar-mail' onSubmit={handleSubmit(onSubmitResetContrasena)}>
            <input type="text" className='input-acceso' placeholder="Correo electrónico"
              {...register("mail", { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors?.mail?.type === "required" && <p className='codigo-enviado-error'>Este campo es requerido</p>}
            {errors?.mail?.type === "pattern" && (
              <p className='error'>Formato de mail incorrecto</p>
            )}
            <input type="submit" className='boton-registrarse' value="Enviar" />
          </form>
        </div>
        {(codigoEnviadoRespuesta) && <p className='codigo-enviado-correcto'>¡Código correcto!</p>}
        {(codigoEnviadoRespuesta == false) && <p className='codigo-enviado-error'>Código incorrecto.<br />Intentá nuevamente.</p>}
      </div>
      <Modal
        show={show}
        size="xs"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <h4 >Revise su casilla de correo por favor</h4>
        </Modal.Body>
        <Modal.Footer>
          <Link to='/' type="button" className='boton-cerrar-sesion' value="Iniciar sesión">Volver al Inicio</Link>
        </Modal.Footer>
      </Modal>
    </>
  )
}
