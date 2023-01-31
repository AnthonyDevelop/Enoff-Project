import React, { useState } from 'react'
import NavbarEditor from '../../../Navbar/Navbar'
import { useForm } from "react-hook-form";
import axios from 'axios';
import { Link } from 'react-router-dom';

import { Modal } from 'react-bootstrap';



function IngresarContraseñaNueva() {

    const urlParams = new URLSearchParams(window.location.search);
    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [show, setShow] = useState(false);

    // VALIDAD CODIGO USER
    const {
        register,
        formState: { errors },
        getValues,
        handleSubmit
    } = useForm();


    const handleLogin = (e) => {
        setNuevaContraseña({
            ...nuevaContraseña,
            [e.target.name]: e.target.value
        });
    }

    const onSubmitResetContrasena = () => {
        const infoNuevaContrasena = {
            password: nuevaContraseña.password,
            hash: urlParams.get('hs')

        };
        axios.post(`https://enoff.com.ar/server/public/recuperarContrasena`, infoNuevaContrasena)
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
                <h5 className='titulo-nueva-contraseña'>Ingrese su nueva contraseña</h5>
                <div className='validar-mail-box'>
                    <form onSubmit={handleSubmit(onSubmitResetContrasena)} className='formulario-nueva-contraseña'>
                        <label className='label-nueva-contraseña'>Nueva Contraseña: </label>
                        <input
                        type='password'
                            className='input-nueva-contraseña'
                            {...register("password", { required: "Password is required!" })}
                            onChange={handleLogin}
                        />
                        {errors.password && (
                            <p style={{ color: "red" }}>{errors.password.message}</p>
                        )}

                        <label className='label-nueva-contraseña'>Confirmar Nueva Contraseña: </label>
                        <input
                        type='password'
                            className='input-nueva-contraseña'
                            {...register("passwordConfirmation", {
                                required: "Por favor, confirme su contraseña",
                                validate: {
                                    matchesPreviousPassword: (value) => {
                                        const { password } = getValues();
                                        return password === value || "Las contraseñas no coinciden";
                                    }
                                }
                            })}
                            onChange={handleLogin}
                        />
                        {errors.passwordConfirmation && (
                            <p style={{ color: "red" }}>
                                {errors.passwordConfirmation.message}
                            </p>
                        )}
                        <div className='box-button-nueva-contraseña'>
                            <button className='button-nueva-contraseña' type="submit">Confirmar Contraseña</button>
                        </div>
                    </form>
                </div>
            </div>

            <Modal
                show={show}
                size="xs"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body  style={{ display:'flex',flexDirection:'row',justifyContent:'center' }}>
                    <h4 className='titulo-nueva-contraseña'>Ha cambiado su contraseña correctamente</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Link to='/' type="button" className='boton-cerrar-sesion' value="Iniciar sesión">Volver al Inicio</Link>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default IngresarContraseñaNueva