import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import veedorRecibirVideos from "../../api/veedorRecibirVideos";
import { setVeedorRecibirMisVideos } from "../../Actions/veedorRecibirVideos";
import { setVeedorRecibirVideosComprados } from "../../Actions/veedorRecibirVideos";
import { setVeedorRecibirVideosGuardados } from "../../Actions/veedorRecibirVideos";
import { setVeedorRecibirVideosTendencias } from "../../Actions/veedorRecibirVideos";
import { setVeedorRecibirVideosDescartado } from "../../Actions/veedorRecibirVideos";
import { setVeedorRecibirVideosDestacados } from "../../Actions/veedorRecibirVideos";

export const watchVeedorRecibirVideos= function * (){
    yield takeEvery(actionTypes.GET_VEEDOR_RECIBIR_VIDEOS, fetchVeedorRecibirVideos)
}

function* fetchVeedorRecibirVideos(action){
    try{
        const data = yield call(veedorRecibirVideos, action.data)
        if(data){
            yield put(setVeedorRecibirMisVideos(data))
        }
    }catch(err){
        console.log(err)

    }
}

export const watchVeedorRecibirVideosComprados= function * (){
    yield takeEvery(actionTypes.GET_VEEDOR_RECIBIR_VIDEOS_COMPRADOS, fetchVeedorRecibirVideosComprados)
}

function* fetchVeedorRecibirVideosComprados(action){
    try{
        const data = yield call(veedorRecibirVideos, action.data)
        if(data){
            yield put(setVeedorRecibirVideosComprados(data))
        }
    }catch(err){
        console.log(err)

    }
}

export const watchVeedorRecibirVideosGuardados= function * (){
    yield takeEvery(actionTypes.GET_VEEDOR_RECIBIR_VIDEOS_GUARDADOS, fetchVeedorRecibirVideosGuardados)
}

function* fetchVeedorRecibirVideosGuardados(action){
    try{
        const data = yield call(veedorRecibirVideos, action.data)
        if(data){
            yield put(setVeedorRecibirVideosGuardados(data))
        }
    }catch(err){
        console.log(err)

    }
}

export const watchVeedorRecibirVideosTendencias= function * (){
    yield takeEvery(actionTypes.GET_VEEDOR_RECIBIR_VIDEOS_TENDENCIAS, fetchVeedorRecibirVideosTendencias)
}

function* fetchVeedorRecibirVideosTendencias(action){
    try{
        const data = yield call(veedorRecibirVideos, action.data)
        if(data){
            yield put(setVeedorRecibirVideosTendencias(data))
        }
    }catch(err){
        console.log(err)

    }
}

export const watchVeedorRecibirVideosDescartados= function * (){
    yield takeEvery(actionTypes.GET_VEEDOR_RECIBIR_VIDEOS_DESCARTADOS, fetchVeedorRecibirVideosDescartados)
}

function* fetchVeedorRecibirVideosDescartados(action){
    try{
        const data = yield call(veedorRecibirVideos, action.data)
        if(data){
            yield put(setVeedorRecibirVideosDescartado(data))
        }
    }catch(err){
        console.log(err)

    }
}

export const watchVeedorRecibirVideosDestacados= function * (){
    yield takeEvery(actionTypes.GET_VEEDOR_RECIBIR_VIDEOS_DESTACADOS, fetchVeedorRecibirVideosDestacados)
}

function* fetchVeedorRecibirVideosDestacados(action){
    try{
        const data = yield call(veedorRecibirVideos, action.data)
        if(data){
            yield put(setVeedorRecibirVideosDestacados(data))
        }
    }catch(err){
        console.log(err)

    }
}