import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import veedorRecibirVideos from "../api/veedorRecibirVideos";
import { setVideosPorUsuario } from "../Actions/AccionVideosPorUsuario";

export const wacthMostrarVideosPorUsuario = function * (){
    yield takeEvery(actionTypes.GET_VIDEOS_POR_USUARIO, fetchObtenerVideosPorUsuario)
}

function* fetchObtenerVideosPorUsuario(action){
    try{
        const data = yield call(veedorRecibirVideos, action.data)
        if(data){
            yield put(setVideosPorUsuario(data))    
        }
    }catch(err){
        console.log(err)
    }
}