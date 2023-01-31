import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getListaUsuarios } from '../../../../../Actions/listUsuarios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import moment from 'moment'
import { Pie } from 'react-chartjs-2';
import { Progress } from 'rsuite';
import { Table, Pagination, Rate } from "rsuite";

import './estadisticas.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Column, HeaderCell, Cell } = Table;

function Estadisticas(props) {
  const dispatch = useDispatch();

  //LISTA DE ESTADISTICAS
  const listadoEstadisticas = useSelector((state) => state.reducerListaEstadisticas.data);
  if (listadoEstadisticas != null) {
    console.log(listadoEstadisticas);
  }


  //ESTADISTICA TORTA
  if (listadoEstadisticas != null && listadoEstadisticas.data != null) {
    var promAdquiridas = listadoEstadisticas.data.promedioAdquiridas
    var promDescartadas = listadoEstadisticas.data.promedioDescartadas
    var promGuardadas = listadoEstadisticas.data.promedioGuardadas
  }
  const data = {
    datasets: [
      {
        label: '# of Votes',
        data: [promDescartadas, promAdquiridas, promGuardadas],
        backgroundColor: [
          '#606060',
          '#DA643A',
          '#C6C7C4',
        ],
        borderColor: [
          '#606060',
          '#DA643A',
          '#C6C7C4',
        ],
        borderWidth: 1,
      },
    ],

    labels: [],
  };

  //TIPO DE CONTENIDO
  var lineaProcentaje = [];
  if (listadoEstadisticas && listadoEstadisticas.data != null) {
    for (var j = 0; j < listadoEstadisticas.data.cantPublisPorCategoria.length; j++) {
      lineaProcentaje.push(
        <>
          <div className='container-line'>
            <div className='porcentaje-line'>
              <p className='contenido-categoria'>{listadoEstadisticas.data.cantPublisPorCategoria[j].categoria}</p>
            </div>
            <div className="child-container-line">
              <Progress.Line percent={String(listadoEstadisticas.data.cantPublisPorCategoria[j].porcentaje).substring(0, 2)} />
              <p className='contenido-porcentaje'>{String(listadoEstadisticas.data.cantPublisPorCategoria[j].porcentaje).substring(0, 2)}%</p>
            </div>
          </div>
        </>
      );
    }
  }

  //DONDE ESTAN NUESTROS USUARIOS
  var lineaUsuarios = [];
  if (listadoEstadisticas && listadoEstadisticas.data != null) {
    for (var j = 0; j < listadoEstadisticas.data.cantUsersPorLocalidad.length; j++) {
      lineaUsuarios.push(
        <>
          <div className='container-localiadades-user'>
            <div className='child-container-localidades'>
              <p className='contenido-categoria'>{listadoEstadisticas.data.cantUsersPorLocalidad[j].localidad}</p>
            </div>
            <div className="child-container-localidades">
              <p className='contenido-porcentaje-user'>{String(listadoEstadisticas.data.cantUsersPorLocalidad[j].cantidad)}</p>
            </div>
          </div>
        </>
      );
    }
  }

  //TABLA CREADORES DE CONTENIDO
  const [activePageUsuario, setActivePageUsuario] = useState(1);
  useEffect(() => {
    const data = {
      nombre: "",
      page: activePageUsuario,
      calificacion: '',
      localidad: "",
      provincia: "",
    }
    dispatch(getListaUsuarios(data));
  }, [activePageUsuario])

  const listaUsuarios = useSelector((state) => state.reducerListUsuario.data);
  const listaVedores = useSelector((state) => state.reducerListaVeedores.data);

  const [loading, setLoading] = React.useState(false);

  const fotoPerfilUsuarios = props.fotoPerfiles;

  //LINEA DE TIEMPO USERS
  var FechaActual = new Date();
  var fechaActualFormateada = moment(FechaActual).format("YYYY-MM-DD"); //fecha actual 
  var fechaActualMenosSeisMeses = moment().subtract(12, "month").calendar(); //resto 12 meses a la fecha actual
  var fechaSeisMesesAtras = moment(fechaActualMenosSeisMeses).format("YYYY-MM-DD");
  let mesNumero = FechaActual.getMonth(); //mes actual
  // console.log("fecha actual formateada" + fechaActualFormateada)

  var arreglitoAtras = []

  const [tablaEstadistica, setTablaEstadistica] = useState(
    {
      series: [{
        data: [31, 40, 28, 51, 42, 109, 100]
      }],
      options: {
        chart: {
          type: 'area'
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
      },
    }
  )

  var options2 = {
    chart: {
      type: "line"
    },

    xaxis: {
      labels: {
        formatter: function (value) {
          return value;
        }
      }
    }
  };

  var series2 = [
    {
      name: "sales",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 333]
    },
  ];

  return (
    <>
      <div className='container-estadisticas'>
        <div className='container-tittle'>
          <h1 className='titulo-explorar'>Estadisticas</h1>
        </div>

        <div className='container-scrollbar'>
          <div className="child-container-estadisticas">
            <div className='container-child-estadisticas'>
              <div className='estadistica'>
                <div>
                  <p className='tittle-estadistica'>Usuarios totales</p>
                  <p className='number-estadistica'>{listadoEstadisticas != null ? listadoEstadisticas.data.cantUsersApp : ''}</p>
                </div>
              </div>
              <div className='estadistica'>
                <div className='separate-estadistica'>
                  <p className='tittle-estadistica'>Dinero transferido</p>
                  <p className='number-estadistica'>${listadoEstadisticas != null ? listadoEstadisticas.data.dineroTotalGastadoApp : ''}</p>
                </div>
              </div>
              <div className='estadistica'>
                <div className='separate-estadistica'>
                  <p className='tittle-estadistica'>Publicaciones</p>
                  <p className='number-estadistica'>{listadoEstadisticas != null ? listadoEstadisticas.data.cantTotalPublicacionesApp : ''}</p>
                </div>
              </div>
            </div>

            <div className='container-contenido'>
              <div className='child-container-user'>
                <div>
                  <h2 className='tittle-section'>Dónde están nuestros usuarios</h2>
                </div>
                <div className='container-lista-users'>
                  {lineaUsuarios}
                </div>
              </div>
              <div className='child-container-categorias'>
                <div>
                  <h2 className='tittle-section'>Tipo de contenido</h2>
                </div>
                <div>
                  {lineaProcentaje}
                </div>
              </div>
              <div className='child-container-torta'>
                <div className='tittle-torta'>
                  <h2 className='tittle-section'>Contenido</h2>
                </div>
                <div className="container-grafico-torta">
                  <Pie data={data} />
                  <div className="container-dots">
                    <div className="container-dots">
                      <span class="dot" style={{ background: '#606060' }}></span><p>Descartado</p>
                    </div>
                    <div className="container-dots">
                      <span class="dot" style={{ background: '#C6C7C4' }}></span><p>Guardado</p>
                    </div>
                    <div className="container-dots">
                      <span class="dot"></span><p>Adquirido</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLA CREADORES DE CONTENIDO */}
            <div className="container-tabla-creadores">
              <div>
                <h2 className='tittle-section'>Creadores de Contenido</h2>
              </div>
              <Table
                height={300}
                data={listaUsuarios != null ? listaUsuarios.data : ''}
                loading={loading}
              >
                <Column flexGrow={1.5} align="left" fixed >
                  <HeaderCell className="tittle-Cell">Usuario</HeaderCell>
                  <Cell align="left">
                    {(rowData) => {
                      return (
                        <div className="boxNombre">
                          {/* <div className='sidebar-user-profile'>
                            <Avatar circle src={fotoPerfilUsuarios[i]} alt="Perfil Administrador" />
                          </div> */}
                          <div className="ajusteUbicacion">
                            {rowData.nombreCompleto}
                          </div>
                        </div>
                      );
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1.5} fixed>
                  <HeaderCell className="tittle-Cell">Localidad</HeaderCell>
                  <Cell dataKey="localidad" />
                </Column>

                <Column flexGrow={1.5}>
                  <HeaderCell className="tittle-Cell">Calificación</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return <Rate className='container-calificacion-user' size="sm" readOnly defaultValue={rowData.calificacion} allowHalf />
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1.5}>
                  <HeaderCell className="tittle-Cell">Videos subidos</HeaderCell>
                  <Cell dataKey="videosCargados" />
                </Column>

                <Column flexGrow={1.5}>
                  <HeaderCell className="tittle-Cell">Videos monetizados</HeaderCell>
                  <Cell dataKey="videosMonetizados" />
                </Column>

                <Column flexGrow={1.5}>
                  <HeaderCell className="tittle-Cell">Strikes/Ban</HeaderCell>
                  <Cell className="strikes">
                    {(rowData) => {
                      return (
                        <>
                          <div className='container-strike'>
                            {rowData.strikes}/0
                          </div>
                        </>
                      )
                    }}
                  </Cell>
                </Column>
              </Table>

              <Pagination
                prev
                next
                size="md"
                total={listaUsuarios != null ? listaUsuarios.totalRegister : ""}
                limit={15}
                activePage={activePageUsuario}
                onChangePage={setActivePageUsuario}
                style={{ justifyContent: "center", marginTop: "20px", maginBottom: "50px", }}
              />
            </div>

            {/* TABLA VEEDORES */}
            {/* {console.log(listaVedores != null ? listaVedores.data : '')} */}
            <div className="container-tabla-creadores">
              <div>
                <h2 className='tittle-section'>Veedores</h2>
              </div>
              <Table
                height={300}
                data={listaVedores != null ? listaVedores.data : ''}
              >
                <Column flexGrow={1.5} align="left" fixed >
                  <HeaderCell className="tittle-Cell">Usuario</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <div className="boxNombre">
                          {/* <div className='sidebar-user-profile'>
                            <Avatar circle src={fotoPerfilUsuarios[i]} alt="Perfil Administrador" />
                          </div> */}
                          <div className="ajusteUbicacion">
                            {rowData.nombreCompleto}
                          </div>
                        </div>
                      );
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1.5}>
                  <HeaderCell className="tittle-Cell">Videos adquiridos</HeaderCell>
                  <Cell dataKey="videosAdquiridos" />
                </Column>

                <Column flexGrow={1.5}>
                  <HeaderCell className="tittle-Cell">Videos descartados</HeaderCell>
                  <Cell dataKey="videosDescartados" />
                </Column>

                <Column flexGrow={1.5}>
                  <HeaderCell className="tittle-Cell">Gastos del mes</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <div className="ajusteUbicacion">
                          ${rowData.montoCompraMensual}
                        </div>
                      );
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1.5}>
                  <HeaderCell className="tittle-Cell">Gastos totales</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <div className="ajusteUbicacion">
                          ${rowData.montoCompraTotal}
                        </div>
                      );
                    }}
                  </Cell>
                </Column>

              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Estadisticas;