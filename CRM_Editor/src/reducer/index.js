import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"
import reducerLogin from './login'
import reducerUsuarioDatos  from './usuarioDatos'
import reducerMostrarMisVideos from "./mostrarMisVideosReducer"
import reducerCategorias from "./categorias"
import reducerVideosComprados from "./mostrarVideosCompradosReducer"
import reducerListUsuario from "./Vedor/reducerListUsuarios"
import reducerListPeriodistas from "./Vedor/reducerListaPeriodistas"
import reducerCredencialMercadoPago from "./reducerCredencialMercadoPago"
import reducerActivarSeccionSideBar from './reducerActivarSeccionSideBar'
import reducerVeedorRecibirVideos from "./Vedor/reducerVeedorRecibirVideos"
import reducerListPeriodistasDisponibles from "./Vedor/reducerListaPeriodistasDisponibles"
import reducerVeedorRecibirVideosComprados from "./Vedor/reducerVeedorRecibirVideosComprados"
import reducerActualizarVistaReproductor from "./Vedor/reducerActualizarVistaReproductor"
import reducerVeedorRecibirVideosGuardados from "./Vedor/reducerVeedorRecibirVideosGuardados"
import reducerVeedorRecibirVideosTendencias from "./Vedor/reducerVeedorRecibirVideosTendencias"
import reducerListaVeedores from "./SuperAdmin/reducerListaVeedores"
import reducerMostrarVideosPorUsuario from "./reducerMostrarVideosPorUsuario"
import reducerVeedorRecibirVideosDescartados from "./Vedor/reducerVeedorRecibirVideosDescartados"
import reducerVeedorRecibirVideosDestacados from "./Vedor/reducerVeedorRecibirVideosDestacados"
import reducerAdminRecibirVideos from "./SuperAdmin/reducerAdminRecibirVideos"
import reducerAdminRecibirVideosComprados from "./SuperAdmin/reducerAdminRecibirVideosComprados"
import reducerAdminRecibirVideosGuardados from "./SuperAdmin/reducerAdminRecibirVideosGuardados"
import reducerListaUsuariosConVideos from "./SuperAdmin/reducerListaUsuariosConVideos"
import reducerAdminRecibirVideosDestacados from "./SuperAdmin/reducerAdminRecibirVideosDestacados"
import reducerAdminRecibirVideosDescartados from "./SuperAdmin/reducerAdminRecibirVideosDescartados"
import reducerUserUtilizoFiltros from "./SuperAdmin/reducerUserUtilizoFiltros"
import reducerListaEstadisticas from "./SuperAdmin/reducerListaEstadisticas"
import reducerListaNotificacionUser from "./reducerListaNotificacionUser"
import reducerSumarStrike from "./SuperAdmin/reducerSumarStrike"
import reducerConfirmarVideosEliminados from "./confirmarVideosEliminados"
import reducerMostrarDatosMercadoPago from "./reducerMostrarDatosMercadoPago"
import reducerValidarRegistro from "./validarRegistro"
import reducerRespuestaAddPeriodista from "./Vedor/reducerRespuestaAddPeriodista"
import reducerRespuestaPeriodistaEliminado from "./Vedor/reducerRespuestaPeriodistaEliminado"
import reducerRespuestaNotificaciones from "./reducerRespuestaNotificaciones"
import reducerRespuestaMailPeriodista from "./Vedor/reducerRespuestaMailPeriodista"
import reducerRespuestaReenviarCodigo from "./respuestaReenviarCodigoUser"
import reducerAvanzarVideoPostCompra from "./Vedor/reducerAvanzarVideoPostCompra"
import reducerEditarPerfilUsuario from "./reducerEditarPerfilUsuario"


const rootReducer = combineReducers({
    routing: routerReducer,
    reducerLogin:reducerLogin,
    reducerUsuarioDatos:reducerUsuarioDatos,
    reducerMostrarMisVideos:reducerMostrarMisVideos,
    reducerCategorias: reducerCategorias,
    reducerVideosComprados:reducerVideosComprados,
    reducerListUsuario: reducerListUsuario,
    reducerListPeriodistas: reducerListPeriodistas,
    reducerCredencialMercadoPago: reducerCredencialMercadoPago,
    reducerActivarSeccionSideBar: reducerActivarSeccionSideBar,
    reducerVeedorRecibirVideos: reducerVeedorRecibirVideos,
    reducerListPeriodistasDisponibles: reducerListPeriodistasDisponibles,
    reducerVeedorRecibirVideosComprados:reducerVeedorRecibirVideosComprados,
    reducerActualizarVistaReproductor:reducerActualizarVistaReproductor,
    reducerVeedorRecibirVideosGuardados:reducerVeedorRecibirVideosGuardados,
    reducerVeedorRecibirVideosTendencias:reducerVeedorRecibirVideosTendencias,
    reducerListaVeedores: reducerListaVeedores,
    reducerMostrarVideosPorUsuario: reducerMostrarVideosPorUsuario,
    reducerVeedorRecibirVideosDescartados:reducerVeedorRecibirVideosDescartados,
    reducerVeedorRecibirVideosDestacados:reducerVeedorRecibirVideosDestacados,
    reducerAdminRecibirVideos:reducerAdminRecibirVideos,
    reducerAdminRecibirVideosComprados:reducerAdminRecibirVideosComprados,
    reducerAdminRecibirVideosGuardados:reducerAdminRecibirVideosGuardados,
    reducerListaUsuariosConVideos:reducerListaUsuariosConVideos,
    reducerAdminRecibirVideosDestacados:reducerAdminRecibirVideosDestacados,
    reducerAdminRecibirVideosDescartados:reducerAdminRecibirVideosDescartados,
    reducerUserUtilizoFiltros:reducerUserUtilizoFiltros,    
    reducerListaEstadisticas: reducerListaEstadisticas,
    reducerListaNotificacionUser: reducerListaNotificacionUser,
    reducerSumarStrike:reducerSumarStrike,
    reducerConfirmarVideosEliminados:reducerConfirmarVideosEliminados,
    reducerMostrarDatosMercadoPago:reducerMostrarDatosMercadoPago,
    reducerValidarRegistro:reducerValidarRegistro,
    reducerRespuestaAddPeriodista:reducerRespuestaAddPeriodista,
    reducerRespuestaPeriodistaEliminado:reducerRespuestaPeriodistaEliminado,
    reducerRespuestaNotificaciones:reducerRespuestaNotificaciones,
    reducerRespuestaMailPeriodista:reducerRespuestaMailPeriodista,
    reducerRespuestaReenviarCodigo:reducerRespuestaReenviarCodigo,
    reducerAvanzarVideoPostCompra:reducerAvanzarVideoPostCompra,
    reducerEditarPerfilUsuario:reducerEditarPerfilUsuario,
})

export default rootReducer;