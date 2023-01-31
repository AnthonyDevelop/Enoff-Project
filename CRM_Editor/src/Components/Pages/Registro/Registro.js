import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'rsuite';
import { setRegistrarUsuario } from '../../../Actions/AccionRegistrarUsuario';
import TerminosYCondiciones from './TerminosYCondiciones/TerminosYCondiciones';
import RegistroExitoso from './RegistroExitoso/RegistroExitoso';
import paises from "./paises.json"

import Localidades from "../User/Pages/MisVideos/SubirVideo/localidades.json";

//Import css
import "./registro.css"
import NavbarEditor from '../../Navbar/Navbar';
import { GeoGobierno, GeoGobiernoLocalidades } from '../IniciarSesion/Acceso/GeoGobierno';

export default function Registro({ }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [abrirModalTerms, setAbrirModalTerms] = useState();
  const [loadingButton, setLoadingButton] = useState(false);
  const [maxDias, setMaxDias] = useState("32");
  const [abrirModalRegistroExitoso, setAbrirModalRegistroExitoso] = useState(false);
  const [dataUser, setDataRegistro] = useState();
  const [mostrarErrorMail, setMostrarErrorMail] = useState(null);
  const [datoProvincias, setDatoProvincias] = useState(null);
  const [datoLocalidad, setDatoLocalidad] = useState(null)
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
    'Octubre', 'Noviembre', 'Diciembre'];

  const navegador = useNavigate();
  const respuestaValidarRegistro = useSelector(
    (state) => state.reducerValidarRegistro.data
  );


  const onSubmit = (data) => {
    setLoadingButton(true)
    const dataRegistro = {
      email: data.email,
      nombreCompleto: data.nombre + " " + data.apellido,
      password: data.password,
      dias: data.dias,
      meses: data.meses,
      anios: data.anios,
      telefono: data.telefono,
      descripcion: data.descripcion,
      provincia: data.provincia,
      localidad: data.localidad
    }
    setDataRegistro(dataRegistro);
    dispatch(setRegistrarUsuario(dataRegistro));

  }

  const provincias = [
    { nombre: "Buenos Aires", value: "Buenos Aires" },
    { nombre: "Capital Federal", value: "Capital Federal" },
    { nombre: "Catamarca", value: "Catamarca" },
    { nombre: "Chaco", value: "Chaco" },
    { nombre: "Chubut", value: "Chubut" },
    { nombre: "Córdoba", value: "Cordoba" },
    { nombre: "Corrientes", value: "Corrientes" },
    { nombre: "Entre Ríos", value: "Entre Rios" },
    { nombre: "Formosa", value: "Formosa" },
    { nombre: "Jujuy", value: "Jujuy" },
    { nombre: "La Pampa", value: "La Pampa" },
    { nombre: "Mendoza", value: "Mendoza" },
    { nombre: "Misiones", value: "Misiones" },
    { nombre: "Neuquén", value: "Neuquen" },
    { nombre: "Rio Negro", value: "Rio Negro" },
    { nombre: "Salta", value: "Salta" },
    { nombre: "San Luis", value: "San Luis" },
    { nombre: "Santa Cruz", value: "Santa Cruz" },
    { nombre: "Santa Fe", value: "Santa Fe" },
    { nombre: "Santiago Del Estero", value: "Santiago Del Estero" },
    { nombre: "Tucumán", value: "Tucuman" },
  ];

  var provinciasArray = [];
  if (provincias != null) {
    for (var i = 0; i < provincias.length; i++) {
      provinciasArray.push(
        <option value={provincias[i].value}>{provincias[i].nombre}</option>
      );
    }
  }

  const [provincia, setProvincia] = useState("Buenos Aires");
  const onChangeProvincia = (name) => {
    setProvincia(name);
  };


  useEffect(() => {
    if (provincia != null) {
      const traerLocalidades = async () => {
        try {
          const data = await GeoGobiernoLocalidades(provincia)
          setDatoLocalidad(data);
          console.log(datoLocalidad)
        } catch (err) {
          console.error(err);
        }
      }

      traerLocalidades()
      // const vlsor = GeoGobiernoLocalidades(provincia)
      // console.log(vlsor)

      // setDatoLocalidad(GeoGobiernoLocalidades(provincia))
    }

  }, [provincia]);



  var LocalidadArregloVacio = [];

  if (datoLocalidad != null) {
    let arregloAux = []
    for (var i = 0; i < datoLocalidad.localidades.length; i++) {
      arregloAux.push(datoLocalidad.localidades[i].nombre);
    }
    arregloAux = arregloAux.sort();
    for (var i = 0; i < arregloAux.length; i++) {
       LocalidadArregloVacio.push(
        <option 
        value={arregloAux[i]}>
          {arregloAux[i]}
          </option>
      );
    }
  }




  const handleOpenTerms = () => {
    if (abrirModalTerms === true) {
      setAbrirModalTerms(false);
    } else {
      setAbrirModalTerms(!abrirModalTerms);
    }
  }

  useEffect(() => {
    if (abrirModalTerms === false) {
      setAbrirModalTerms(!abrirModalTerms);
    }
  }, [abrirModalTerms]);

  useEffect(() => {
    if (respuestaValidarRegistro != null && respuestaValidarRegistro.message === "El Usuario ya existe  ") {
      setMostrarErrorMail(true);
      setLoadingButton(false);
    }
    if (respuestaValidarRegistro != null && respuestaValidarRegistro.message === "Usuario creado") {
      setAbrirModalRegistroExitoso(true);
      setLoadingButton(false);
    }

  }, [respuestaValidarRegistro]);



  //PAISES
  if (paises != null) {
    var nacionalidad = [];
    const arregloLongitud = paises.countries.length;
    for (var i = 0; i < arregloLongitud; i++) {
      nacionalidad.push(
        <>
          <option value={paises.countries[i].name_es}>{paises.countries[i].name_es}</option>
        </>,
      );
    }
  }

  //FECHA CUMPLE
  if (meses != null) {
    var mesesOptions = [];
    const arregloMeses = meses.length;
    for (var i = 0; i < arregloMeses; i++) {
      mesesOptions.push(
        <>
          <option value={[i]}>{meses[i]}</option>
        </>,
      );
    }
  }
  var diasOption = [];
  for (var i = 1; i < maxDias; i++) {
    diasOption.push(
      <>
        <option value={i}>{i}</option>
      </>,
    );
  }
  var aniosOptions = [];
  var date = new Date();
  var year = date.getFullYear();
  for (var i = year - 100; i < year - 18; i++) {
    aniosOptions.push(
      <>
        <option value={i}>{i}</option>
      </>,
    );
  }

  function Calcular(e) {
    if (e.target.value === "Febrero") {
      setMaxDias("29")
    }
    if (e.target.value === "Abril" || e.target.value === "Junio" || e.target.value === "Septiembre" || e.target.value === "Noviembre") {
      setMaxDias("31")
    }
    if (e.target.value === "Enero" || e.target.value === "Marzo" || e.target.value === "Mayo" || e.target.value === "Julio" || e.target.value === "Agosto" || e.target.value === "Octubre" || e.target.value === "Diciembre") {
      setMaxDias("32")
    }
  }

  function permitirRegistro() {
    if (mostrarErrorMail == true) {
      setMostrarErrorMail(false);
    }
  }

  const traerPronvincias = async () => {
    try {
      const data = await GeoGobierno()
      setDatoProvincias(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    traerPronvincias();
    // setDatoProvincias("Buenos Aires")
  }, []);

  var provinciasArregloVacio = [];

  if (datoProvincias != null) {
    // console.log(datoProvincias)
    for (var i = 0; i < datoProvincias.provincias.length; i++) {
      provinciasArregloVacio.push(

        <option
          value={datoProvincias.provincias[i].nombre}
          selected={datoProvincias.provincias[i].nombre == "Buenos Aires"}>
          {datoProvincias.provincias[i].nombre}
        </option>

      );
    }
  }





  return (
    <>
      <NavbarEditor />
      <div className='register-container'>
        <h5>CREAR UNA CUENTA</h5>
        <br></br>
        <p>¿Ya tenés una cuenta? <Link className='tittle-iniciar' to="/">Iniciar sesión</Link></p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='fila-formulario-registro'>
            <div className='formulario-campo'>
              <input type="text" autoComplete='off' placeholder="Nombre" {...register("nombre", { required: true })} />
              {errors?.nombre?.type === "required" && <p className='error'>Ingrese un nombre</p>}
            </div>
            <div className='formulario-campo'>
              <input type="text" autoComplete='off' placeholder="Apellido" {...register("apellido", { required: true })} />
              {errors?.apellido?.type === "required" && <p className='error'>Ingrese un apellido</p>}
            </div>
          </div>
          <label className='style-label'>Fecha de nacimiento</label>
          <div className='fila-formulario-registro'>
            <div className='formulario-campo'>
              <select {...register("dias", { required: true, onChange: (e) => Calcular(e) })}>
                <option value="" selected disabled hidden >Dia</option>
                {diasOption}
              </select>
              {errors?.dias?.type === "required" && <p className='error'>Ingrese un año</p>}
            </div>
            <div className='formulario-campo'>
              <select {...register("meses", { required: true, onChange: (e) => Calcular(e) })}>
                <option value="" selected disabled hidden >Mes</option>
                {mesesOptions}
              </select>
              {errors?.meses?.type === "required" && <p className='error'>Ingrese un mes</p>}
            </div>
            <div className='formulario-campo'>
              <select {...register("anios", { required: true, onChange: (e) => Calcular(e) })}>
                <option value="" selected disabled hidden >Año</option>
                {aniosOptions}
              </select>
              {errors?.anios?.type === "required" && <p className='error'>Ingrese un día</p>}
            </div>
          </div>

          <div className='fila-formulario-registro'>
            <div className='formulario-campo'>
              {/* <label className='style-label'>Provincia</label> */}
              <select
                {...register("provincia", {
                  required: true,
                })}
                onChange={(e) => onChangeProvincia(e.target.value)}
              >
                <option value="" selected disabled hidden>
                  Provincia
                </option>
                {provinciasArregloVacio}
              </select>
              {errors?.provincia?.type === "required" && <p className='error'>Ingrese una provincia</p>}
            </div>
            <div className='formulario-campo'>
              {/* <label className='style-label'>Localidad</label> */}
              <select
                {...register("localidad", {
                  required: true,
                })}
              >
                <option value="" selected disabled hidden>
                  Localidad
                </option>

                {LocalidadArregloVacio}
              </select>
              {errors?.localidad?.type === "required" && <p className='error'>Ingrese una localidad</p>}
            </div>
          </div>

          {/* <label>Teléfono</label>
        <div className='fila-formulario-registro'>
          <div className='formulario-campo'>
            <input
              className='inputRegistroNumber'
              type="number"
              autoComplete='off'
              onWheel={(e) => e.target.blur()}
              {...register("telefono",
                { required: true, maxLength: 15 }
              )}
            />
            {errors?.telefono?.type === "required" && <p className='error'>Este campo es requerido</p>}
            {errors.telefono?.type === 'maxLength' && <p className='error'>Máximo 15 carácteres.</p>}
          </div>
        </div> */}

          <input className='boton-registro-campo-login' type="text" autoComplete='off' placeholder="Correo Electrónico"  {...register("email", {
            required: "Campo obligatorio", pattern:
            {
              value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            }
          })}
            onChange={permitirRegistro} />
          {errors?.email?.type === "required" && <p className='error'>Este campo es requerido</p>}
          {errors?.email?.type === "pattern" && (<p className='error'>Dirección de mail invalida</p>)}
          {mostrarErrorMail == true && <p className='error'>Este correo ya está registrado</p>}
          <input className='boton-registro-campo-login' autoComplete='off' type="password" placeholder="Contraseña" {...register("password", { required: true })} />
          {errors?.password?.type === "required" && <p className='error'>Este campo es requerido</p>}

          <div className='campo-terminos-y-condiciones'>
            <div className='formulario-campo'>
              <input type="checkbox" placeholder="terms" {...register("terms", { required: true })} />
              <p className='terminos-font-titulo'>Al registrarte, aceptás nuestros <span onClick={handleOpenTerms}>términos y condiciones.</span></p>
            </div>
            {errors?.terms?.type === "required" && <p className='error'>Este campo es requerido</p>}
          </div>

          <Button className='boton-registrarse' loading={loadingButton} type="submit" >Registrarse</Button>
        </form>
        <TerminosYCondiciones abrirModalTerms={abrirModalTerms} />
        <RegistroExitoso abrirModalRegistroExitoso={abrirModalRegistroExitoso} dataUsuario={dataUser} />
      </div>
    </>
  );
}


