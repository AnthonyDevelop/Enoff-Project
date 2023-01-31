import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import guardarVideo from "../../api/Vedor/guardarVideo";
import { setReproductorVideoActualizarVista } from "../../Actions/Veedor/actualizarVistaReproductorVideos";

export const watchGuardarVideo= function * (){
    yield takeEvery(actionTypes.SET_GUARDAR_VIDEO, fetchGuardarVideo)
}

function* fetchGuardarVideo(action){
    try{
        const data = yield call(guardarVideo, action.data)
        if(data){
            yield put(setReproductorVideoActualizarVista(data))   
        }
    }catch(err){
        console.log(err)

    }
}