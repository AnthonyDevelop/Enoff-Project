import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import NavbarEditor from '../../../../Navbar/Navbar';
import { reenviarCodigoUser } from '../../../../../Actions/reenviarCodigoUser';
import { Modal, ButtonToolbar, Button, Placeholder } from 'rsuite';
import './codigoSeguridad.css'


export default function CodigoSeguridad() {
  const navegarRegistro = useNavigate();
  const [codigoEnviadoRespuesta, setCodigoEnviadoRespuesta] = useState(null);
  const [activarContador, setActivarContado] = useState(false);
  const [timer, setTimer] = useState(60);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const respuestaReenvioCodigo = useSelector((state) => state.reducerRespuestaReenviarCodigo.data);

  const handleClose = () => setOpen(false);

  const [codigo, setCodigo] = useState({
    codigo1: "",
    codigo2: "",
    codigo3: "",
    codigo4: "",
  })
  const dispatch = useDispatch();
  const handleCodigo = (e) => {
    const { name, value } = e.target;

    setCodigo((prev) => ({
      ...prev,
      [name]: value
    }));
    const codigo = e.target.form;
    if (name === "codigo1" && value.length >= 1) {
      // const form = e.target.form;
      const index = [...codigo].indexOf(e.target);
      codigo.elements[index + 1].focus();
      // e.preventDefault();
    }
    if (name === "codigo2" && value.length >= 1) {
      // const form = e.target.form;
      const index = [...codigo].indexOf(e.target);
      codigo.elements[index + 1].focus();
      // e.preventDefault();
    }
    if (name === "codigo3" && value.length >= 1) {
      // const form = e.target.form;
      const index = [...codigo].indexOf(e.target);
      codigo.elements[index + 1].focus();
      // e.preventDefault();
    }
    if (name === "codigo4" && value.length >= 1) {
      // const form = e.target.form;
      const index = [...codigo].indexOf(e.target);
      codigo.elements[index + 1].focus();
      // e.preventDefault();
    }
  };
  const urlParams = new URLSearchParams(window.location.search);
  function enviarCodigo() {

    let codigoMail = String(codigo.codigo1) + String(codigo.codigo2) + String(codigo.codigo3) + String(codigo.codigo4);



    const data = {
      codigoMail: codigoMail,
      email: urlParams.get('email')
    };
    axios.post(`https://enoff.com.ar/server/public/validarCodigoUser`, JSON.stringify(data))
      .then(function (response) {
        setCodigoEnviadoRespuesta(true);

        setTimeout(() => {
          return (navegarRegistro('/User'))
        }, 1000);
      })
      .catch(function (error) {
        setCodigoEnviadoRespuesta(false);
      });
  };

  const id = useRef(null);
  function reenviarCodigo() {
    setActivarContado(true);
    const dataEmail = {
      email: urlParams.get('email')
    }
    dispatch(reenviarCodigoUser(dataEmail))
  }

  const clear = () => {
    window.clearInterval(id.current);
  };

  useEffect(() => {
    if (activarContador == true) {
      id.current = window.setInterval(() => {
        setTimer((time) => time - 1);
      }, 1000);
      return () => clear();
    }
  }, [activarContador]);

  useEffect(() => {
    if (timer === 0) {
      setActivarContado(false);
      setTimer(60);
      clear();
    }
  }, [timer]);


  useEffect(() => {
    if (respuestaReenvioCodigo != null && respuestaReenvioCodigo.mensaje == "Codigo Reenviado") {
      setOpen(true);
    }
  }, [respuestaReenvioCodigo]);
  const handleOpen = value => {
    setSize(value);
    setOpen(true);
  };

  return (
    <>
      <NavbarEditor />
      <div className='validar-mail-container'>
        <h5>Ingresá el código de verificación</h5>
        <div className='validar-mail-box'>
          <p>Completá los casilleros con el código que recibiste.</p>
          <form className='formulario-validar-mail' >
            <div className='campos-codigos'>
              <input onChange={handleCodigo} name="codigo1" className='campo-codigo' pattern="[0-9]" type="text" maxlength="1" oninput="this.value=this.value.replace(/[^0-9]/g,'');" required />
              <input onChange={handleCodigo} name="codigo2" className='campo-codigo' pattern="[0-9]" type="text" maxlength="1" oninput="this.value=this.value.replace(/[^0-9]/g,'');" required />
              <input onChange={handleCodigo} name="codigo3" className='campo-codigo' pattern="[0-9]" type="text" maxlength="1" oninput="this.value=this.value.replace(/[^0-9]/g,'');" required />
              <input onChange={handleCodigo} name="codigo4" className='campo-codigo' pattern="[0-9]" type="text" maxlength="1" oninput="this.value=this.value.replace(/[^0-9]/g,'');" required />
            </div>
            <div className='reenviar-codigo-align-left'>
              <span>¿No te llegó? </span>
              {activarContador == true ?
                <p>{timer} segundos</p>
                :
                <input type="button" className='boton-reenviar-codigo' value="Reenviar código" onClick={reenviarCodigo} />
              }
            </div>
            <input type="button" className='boton-registrarse' value="Validar" onClick={enviarCodigo} />
          </form>
        </div>
        {(codigoEnviadoRespuesta) && <p className='codigo-enviado-correcto'>¡Código correcto!</p>}
        {(codigoEnviadoRespuesta == false) && <p className='codigo-enviado-error'>Código incorrecto.<br />Intentá nuevamente.</p>}
      </div>
      <Modal size={size} open={open} onClose={handleClose} className='contenedor-modal-reenvio-codigo'>
        <Modal.Header>
          <Modal.Title className='titulo-modal-reenviar'>Codigo reenviado, revise su correo!</Modal.Title>
        </Modal.Header>
        <br />
        <Modal.Footer>
          <Button className='boton-registrarse' onClick={handleClose} >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
