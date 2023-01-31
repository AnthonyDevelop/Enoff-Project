import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import apiListaNotificacionesUser from "../api/listaNotificaciones";
import { setListaNotificacionesUser } from "../Actions/listaNotificacionesUser";

export const watchListaNotificacionUser = function * (){
    yield takeEvery(actionTypes.GET_LISTA_NOTIFICACIONES_USER, fetchListaNotificacionUser)
}

function* fetchListaNotificacionUser(action){
    try{
        const data = yield call(apiListaNotificacionesUser, action.data)
        if(data){
            yield put(setListaNotificacionesUser(data))
        }
    }catch(err){
        console.log(err)
    }
}