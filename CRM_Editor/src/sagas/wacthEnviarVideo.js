import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call } from'redux-saga/effects';
import EnviarVideo from "../api/EnviarVideo";

export const watchEnviarVideo = function * (){
    yield takeEvery(actionTypes.SET_ENVIAR_VIDEO, fetchEnviarVideo)
}

function* fetchEnviarVideo(action){
    try{
        const data = yield call(EnviarVideo, action.data)
        if(data){
        }
    }catch(err){
        console.log(err)

    }
}