import React from "react";
import { SelectPicker } from "rsuite";
import { useForm } from "react-hook-form";
import { enviarMailAyuda } from "../../../../../Actions/enviarMailAyuda";
// import "./ayuda.css";

export default function Ayuda() {
  const data = [
    "Reclamo",
    "Consulta",
    "Sugerencia"
  ].map((item) => ({ label: item, value: item }));
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    enviarMailAyuda(data)
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
         <SelectPicker
            placeholder="Elegí una categoría"
            data={data}
            style={{ width: 420 }}
            {...register("opcion")}
            className='select-ayuda'
          />
         </div>
          
          <div className="container-text-area-ayuda">
          <textarea
            className="messageHelp"
            placeholder="Tu mensaje"
            type="text"
            {...register('mensaje', {
                required:true,
                maxLength:500
            })}
          />
          {errors.mensaje?.type === 'required' && <span className="errorHelp" style={{top: "220px"}}>El campo mensaje es requerido.</span>}
          {errors.mensaje?.type === 'maxLength' && <span className="errorHelp" style={{top: "220px"}}>Máximo 500 carácteres, nos pondremos en contacto con usted a la brevedad.</span>}
          </div>
         
          <div className="containerSubmit">
            <input className="sendHelp" type="submit" placeholder="Enviar" />
          </div>
        </form>
      </div>
      </div>
    </div>
    </>
  );
}
