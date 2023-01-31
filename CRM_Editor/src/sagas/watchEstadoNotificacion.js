import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import apiEstadoNotificacion from "../api/estadoNotificacion";
import { setRespuestaNotificaciones } from "../Actions/estadoNotificaciones";

export const watchEstadoNotificacion = function * (){
    yield takeEvery(actionTypes.SET_ESTADO_NOTIFICACIONES, fetchEstadoNotificacion)
}

function* fetchEstadoNotificacion(action){
    try{
        const data = yield call(apiEstadoNotificacion, action.data)
        if(data){
            //RESPUESTA NOTIFICACION
            yield put(setRespuestaNotificaciones(data))
        }
    }catch(err){
        console.log(err)
    }
}