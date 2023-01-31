import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call,put  } from'redux-saga/effects';
import eliminarVideo from "../../api/Vedor/eliminarVideo";
import { setReproductorVideoActualizarVista } from "../../Actions/Veedor/actualizarVistaReproductorVideos";

export const watchEliminarVideo= function * (){
    yield takeEvery(actionTypes.SET_ELIMINAR_VIDEO, fetchEliminarVideo)
}

function* fetchEliminarVideo(action){
    try{
        const data = yield call(eliminarVideo, action.data)
        if(data){
            yield put(setReproductorVideoActualizarVista(data))   
        }
    }catch(err){
        console.log(err)

    }
}