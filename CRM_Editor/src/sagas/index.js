import { all } from'redux-saga/effects';
import {watchLoginService} from './wacthLogin'
import { watchRegistrarse } from './wacthRegistrarse';
import { watchEnviarVideo } from './wacthEnviarVideo';
import { wacthObtenerDatosUsuario } from './wacthObtenerDatosUsuario';
import { watchRecibirMisVideos } from './wacthRecibirMisVideos';
import { watchCategorias } from './watchCategorias';
import { watchEliminarVideoUser } from './wacthEliminarVideoUser';
import { watchRecibirVideosComprados } from './wacthRecibirMisVideos';
import { wacthEditarPerfil } from './wacthEditarPerfil';
import { watchListaUsuarios } from './watchListaUsuarios';
import { watchAddPeriodista } from './Vedor/watchAddPeriodista';
import { watchListaPeriodistas } from './Vedor/watchListaPeriodistas';
import { watchCredencialesMP } from './watchCredencialesMercadoPago';
import { watchEliminarCredencialMP } from './watchElminarCredencialesMercadoPago';
import { watchVeedorRecibirVideos, watchVeedorRecibirVideosComprados, watchVeedorRecibirVideosDescartados, watchVeedorRecibirVideosDestacados, watchVeedorRecibirVideosGuardados, watchVeedorRecibirVideosTendencias } from './Vedor/watchVeedorRecibirVideos';
import { watchEliminarVideo } from './Vedor/watchEliminarVideo';
import { watchGuardarVideo } from './Vedor/watchGuardarVideo';
import { watchComprarVideo } from './Vedor/watchComprarVideo';
import { watchListaVeedores } from './SuperAdmin/watchListaVeedores';
import { wacthMostrarVideosPorUsuario } from './wacthMostrarVideosPorUsuario';
import { watchAdminRecibirVideos, watchAdminRecibirVideosComprados, watchAdminRecibirVideosDescartados, watchAdminRecibirVideosDestacados, watchAdminRecibirVideosGuardados } from './SuperAdmin/watchAdminRecibirVideos';
import { watchListaUserConVideos } from './SuperAdmin/watchListaUserConVideos';
import { watchListaEstadisticas } from './SuperAdmin/watchListaEstadisticas';
import { watchListaNotificacionUser } from './watchListaNotificacionUser';
import { watchSumarStrike } from './SuperAdmin/watchSumarStrike';
import { watchVideoVisto } from './Vedor/watchVideoVisto';
import { watchEnviarMailAyuda } from './watchEnviarMailAyuda';
import { watchDatosMercadoPago } from './wacthDatosMercadoPago';
import { watchEstadoNotificacion } from './watchEstadoNotificacion';
import { watchEnviarMailPeriodista } from './Vedor/watchEnviarMailPeriodista';
import { watchListaPeriodistasDisponibles } from './Vedor/watchListaPeriodistasDispobles';
import { watchEliminarPeriodista } from './Vedor/watchEliminarPeriodistas';
import { watchReenviarCodigoUser } from './watchReenviarCodigoUser';

export default function * rootSaga(){
    yield all ([
        watchLoginService(),
        watchRegistrarse(),
        watchEnviarVideo(),
        wacthObtenerDatosUsuario(),
        watchRecibirMisVideos(),
        watchCategorias(),
        watchEliminarVideoUser(),
        watchRecibirVideosComprados(),
        wacthEditarPerfil(),
        watchListaUsuarios(),
        watchAddPeriodista(),
        watchListaPeriodistas(),
        watchCredencialesMP(),
        watchEliminarCredencialMP(),
        watchVeedorRecibirVideos(),
        watchEliminarVideo(),
        watchGuardarVideo(),
        watchComprarVideo(),
        watchVeedorRecibirVideosComprados(),
        watchVeedorRecibirVideosGuardados(),
        watchVeedorRecibirVideosTendencias(),
        watchListaVeedores(),
        wacthMostrarVideosPorUsuario(),
        watchVeedorRecibirVideosDescartados(),
        watchVeedorRecibirVideosDestacados(),
        watchAdminRecibirVideos(),
        watchAdminRecibirVideosComprados(),
        watchAdminRecibirVideosGuardados(),
        watchAdminRecibirVideosDestacados(),
        watchListaUserConVideos(),
        watchAdminRecibirVideosDescartados(),
        watchListaEstadisticas(),
        watchListaNotificacionUser(),
        watchSumarStrike(),
        watchVideoVisto(),
        watchEnviarMailAyuda(),
        watchDatosMercadoPago(),
        watchEstadoNotificacion(),
        watchEnviarMailPeriodista(),
        watchListaPeriodistasDisponibles(),
        watchEliminarPeriodista(),
        watchReenviarCodigoUser(),
    ])
}