import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import RecibirMisVideos from "../api/RecibirMisVideos";
import { setRecibirMisVideos } from "../Actions/MostrarVideos";
import { setRecibirVideosComprados } from "../Actions/MostrarVideos";

export const watchRecibirMisVideos= function * (){
    yield takeEvery(actionTypes.GET_RECIBIR_MISVIDEOS, fetchRecibirMisVideos)
}

function* fetchRecibirMisVideos(action){
    try{
        const data = yield call(RecibirMisVideos, action.data)
        if(data){
            yield put(setRecibirMisVideos(data))
        }
    }catch(err){
        console.log(err)

    }
}

export const watchRecibirVideosComprados= function * (){
    yield takeEvery(actionTypes.GET_RECIBIR_VIDEOS_COMPRADOS, fetchRecibirVideosComrpados)
}

function* fetchRecibirVideosComrpados(action){
    try{
        const data = yield call(RecibirMisVideos, action.data)
        if(data){
            yield put(setRecibirVideosComprados(data))
        }
    }catch(err){
        console.log(err)

    }
}

