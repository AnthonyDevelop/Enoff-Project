import React, { useState } from "react";
import { Button, SelectPicker } from "rsuite";
// import { useForm } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { enviarMailAyuda } from "../../../../../Actions/enviarMailAyuda";
import "./ayuda.css";
import { useSelector, useDispatch } from 'react-redux';
export default function Ayuda() {
  const dispatch = useDispatch();
  const data = [
    "Reclamo",
    "Consulta",
    "Sugerencia"
  ].map((item) => ({ label: item, value: item }));

  const {
    register,
    reset,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();


  const onSubmit = (data) => {
    dispatch(enviarMailAyuda(data));
  };

  const [reclamo, setReclamo] = useState("");
  const onChangeReclamo = (name) => {
    setReclamo(name);
  };


  return (
    <>
      <div className="contenedor-principal">
        <div className="subcontainer-ayuda">
          <div className="containerHelp">
            <h1 className="titleHelp">¿En qué te ayudamos?</h1>
          </div>
          <div className="containerFormHelp">
            <form className="formHelp" onSubmit={handleSubmit(onSubmit)}>
              <p>Envianos tu consulta</p>
              <div>

                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <SelectPicker

                    style={{ width: 420 }}
                      placeholder="Elegí una categoría"
                      className='select-ayuda'
                      data={data}
                      inputRef={ref}
                      onChange={(value, e) => {
                        field.onChange(onChangeReclamo(value));
                        field.onChange(value);
                      }}
                    />
                  )}
                  name="tipoDeConsulta"
                />
                {errors.provincia && (
                  <p className="text-danger">Campo Requerido</p>
                )}


              </div>

              <div className="container-text-area-ayuda">
                <textarea
                  className="messageHelp"
                  placeholder="Tu mensaje"
                  type="text"
                  {...register('mensaje', {
                    required: true,
                    maxLength: 500
                  })}
                />
                {errors.mensaje?.type === 'required' && <span className="errorHelp" style={{ top: "220px" }}>El campo mensaje es requerido.</span>}
                {errors.mensaje?.type === 'maxLength' && <span className="errorHelp" style={{ top: "220px" }}>Máximo 500 carácteres, nos pondremos en contacto con usted a la brevedad.</span>}
              </div>

              <div className="containerSubmit">
                <Button className="sendHelp" type="submit">Enviar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
