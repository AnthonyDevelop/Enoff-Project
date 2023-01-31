import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import comprarVideo from "../../api/Vedor/comprarVideo";
import { setReproductorVideoActualizarVista } from "../../Actions/Veedor/actualizarVistaReproductorVideos";

export const watchComprarVideo= function * (){
    yield takeEvery(actionTypes.SET_COMPRAR_VIDEO, fetchComprarVideo)
}

function* fetchComprarVideo(action){
    try{
        const data = yield call(comprarVideo, action.data)
        if(data){
            yield put(setReproductorVideoActualizarVista(data))   
            console.log(data.mensaje)
        }
    }catch(err){
        console.log(err)

    }
}