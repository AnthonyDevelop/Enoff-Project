import React, { useState, useEffect } from "react";
import { Pagination } from "rsuite";
import ListGroup from "react-bootstrap/ListGroup";
import { MdOutlineModeEdit } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import { Avatar } from "rsuite";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useSelector, useDispatch } from "react-redux";
import ModalEliminarPeriodista from "./ModalEliminarPeriodista/ModalEliminarPeriodista";

import { getListaPeriodistasDisponibles } from "../../../../../Actions/VedorListaPeriodistasDisponibles";
import { setAddPeriodista } from "../../../../../Actions/VedorAddPeriodista";
import { getListaPeriodistas } from "../../../../../Actions/VedorListaPeriodistas";
import { setEliminarPeriodista } from "../../../../../Actions/Veedor/eliminarPeriodista";
import { SelectPicker } from "rsuite";
import "./Perodistas.css";

function Periodistas(props) {

  const fotoPerfilesPeriodistas = props.fotoPerfilesPeriodistas;
  const listaPeriodistasDisponibles = props.dataPeriodistasDisponibles
  const listaPeriodistas = props.dataPeriodistasAsignados


  const [modalEliminarPeriodista, setModalEliminarPeriodista] = useState();
  const dispatch = useDispatch();

  //REDUX
  const listCategorias = useSelector((state) => state.reducerCategorias.data);
  const respuestaAddPeriodista = useSelector((state) => state.reducerRespuestaAddPeriodista.data);
  const respuestaPeriodistaEliminado = useSelector((state) => state.reducerRespuestaPeriodistaEliminado.data);

  //LISTA PERIODISTAS ASIGNADOS
  const [pageListaPeriodista, setPageListaPeriodista] = useState(1);
  const [estadoLoading, setEstadoLoading] = useState(false);

  useEffect(() => {
      const dataPeriodista = {
        idCategoria: "",
        page: pageListaPeriodista,
      };
      dispatch(getListaPeriodistas(dataPeriodista));
      dispatch(getListaPeriodistasDisponibles());
    
  }, [respuestaAddPeriodista, respuestaPeriodistaEliminado,pageListaPeriodista ]);

  useEffect(() => {
    if(respuestaAddPeriodista!=null && respuestaAddPeriodista.message=="Periodista agregado"){
      setEstadoLoading(false);
    }  
}, [respuestaAddPeriodista]);

  const locale = {
    noResultsText: "No existen resultados",
    placeholder: "",
    searchPlaceholder: "Buscar",
    checkAll: "",
  };

  //LISTA PERIODISTAS
  if (listaPeriodistas != null) {
    var listaDePeriodistas = [];
    var guardarIdPeriodista = 0;
    if (listaPeriodistas.data != null) { 
        for (var i = 0; i < listaPeriodistas.data.length; i++) {
          guardarIdPeriodista = listaPeriodistas.data[i].idPeriodista;
          listaDePeriodistas.push(
            <>
              <ListGroup.Item>
                <div className="caja-info-periodistas-admin">
                  <Avatar
                    size="lg"
                    circle
                    src={fotoPerfilesPeriodistas[i]}
                    alt="@SevenOutman"
                  />
                </div>
                <div className="caja-info-periodistas-admin-nombre">
                  <p className="nombre-periodista">
                    {" "}
                    {listaPeriodistas.data[i].nombreCompleto}
                  </p>
                  <p className="email-periodistas">
                    {" "}
                    {listaPeriodistas.data[i].email}{" "}
                  </p>
                </div>
                <div className="caja-info-periodistas-admin-boton-eliminar">
                  <p className="categoria-periodista">
                    {listaPeriodistas.data[i].nombreCategoria}
                  </p>
                  <button className="button-eliminar-periodista" value={listaPeriodistas.data[i].idPeriodista} onClick={(e) => handleEliminarPeriodista(e)}>
                    Eliminar
                  </button>

                </div>
              </ListGroup.Item>
            </>
          );
        
      }
    } else {
      listaDePeriodistas.push(<div className="container-sin-periodistas"><p>Sin periodistas asignados</p></div>);
    }
  }

  const handleEliminarPeriodista = (e) => {
    const eliminarPeriodista = {
      idPeriodista: e.target.value,
    }
    dispatch(setEliminarPeriodista(eliminarPeriodista));
  }

  const {
    register,
    formState: { errors },
    getValues,
    control,
    handleSubmit,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
    setEstadoLoading(true);
    dispatch(setAddPeriodista(data));
  };

  //LISTA USUARIOS
  const listaUsuariosArray = [];

  if (listaPeriodistasDisponibles != null && listaPeriodistasDisponibles.data != null) {
    for (let i = 0; i < listaPeriodistasDisponibles.data.length; i++) {
      listaUsuariosArray.push({
        label: listaPeriodistasDisponibles.data[i].nombreCompleto,
        value: listaPeriodistasDisponibles.data[i].id,
      });
    }
  } else {
    listaUsuariosArray.push(
      {
        label: "Sin Periodistas",
        value: ""
      })
  }

  //LISTA CATEGORIAS
  if (listCategorias != null) {
    var listaDeCategorias = [];
    for (var i = 0; i < listCategorias.data.length; i++) {
      listaDeCategorias.push({
        label: listCategorias.data[i].nombre,
        value: listCategorias.data[i].id,
      });
    }
  }

  return (
    <>
      <div className="explorar-principal-periodistas">
        <div className="contenedor-buscador-periodistas">
          <div>
            <h1 className="titulo-explorar">Periodista</h1>
          </div>
          <div className="container-subtittle">
            <p className="color-texto">
              Cargá las direcciones de correo de los periodistas para enviarles
              el contenido una vez adquirido.
            </p>
          </div>
          <form
            className="contendor-form-inputs-periodistas"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="box-inputs-periodistas">
              {listaPeriodistasDisponibles != null &&
                <>
                <div>
                <Controller
                    name="idPeriodista"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { ref, ...field } }) => (
                      <SelectPicker
                        {...field}
                        locale={locale}
                        placeholder={"Periodistas"}
                        className="periodistas-select"
                        data={listaUsuariosArray}
                        inputRef={ref}
                      />
                    )}
                  />
                  {errors.idPeriodista && (
                    <p className="text-danger"  style={{textAlign:'center'}}>Campo Requerido</p>
                  )}
                </div>
                  
                </>
              }
              <div>
              <Controller
                name="idCategoria"
                control={control}
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <SelectPicker
                    {...field}
                    locale={locale}
                    placeholder={"Categoría"}
                    className="periodistas-select"
                    data={listaDeCategorias}
                    inputRef={ref}
                  />
                )}
              />
              {errors.idCategoria && (
                <p className="text-danger" style={{textAlign:'center'}}>Campo Requerido</p>
              )}
              </div>
              
              <Button
                className="boton-cargar-periodistas"
                type="submit"
                Loading={estadoLoading}
              >
                {estadoLoading == true && 
                <Spinner
                style={{marginRight:"10px"}}
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />}
                Agregar Periodista
                </Button>
            </div>
          </form>
        </div>

        <div className="contenedor-lista-periodistas">
          <ListGroup variant="flush">
            {respuestaAddPeriodista != null && respuestaAddPeriodista.message == "Sin periodistas asignados" ? (
              ''
            ) : (
              ''
            )}

            {listaDePeriodistas}

          </ListGroup>
          <div className="box-pagination-periodistas">
            <Pagination
              limit={1}
              total={listaPeriodistas != null ? listaPeriodistas.maxPages : ''}
              activePage={pageListaPeriodista}
              onChangePage={setPageListaPeriodista}

            />
          </div>
        </div>
      </div>

      <ModalEliminarPeriodista
        dataModalEliminarPeriodista={modalEliminarPeriodista}
      />
    </>
  );
}

export default Periodistas;
