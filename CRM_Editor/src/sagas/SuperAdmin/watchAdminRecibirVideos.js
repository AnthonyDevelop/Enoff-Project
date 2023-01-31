import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import adminRecibirVideos from "../../api/SuperAdmin/adminRecibirVideos";
import { setAdminRecibirVideos } from "../../Actions/SuperAdmin/adminRecibirVideos";
import { setAdminRecibirVideosComprados } from "../../Actions/SuperAdmin/adminRecibirVideos";
import { setAdminRecibirVideosGuardados } from "../../Actions/SuperAdmin/adminRecibirVideos";
import { setAdminRecibirVideosDestacados } from "../../Actions/SuperAdmin/adminRecibirVideos";
import { setAdminRecibirVideosDescartados } from "../../Actions/SuperAdmin/adminRecibirVideos";

export const watchAdminRecibirVideos= function * (){
    yield takeEvery(actionTypes.GET_ADMIN_RECIBIR_VIDEOS, fetchAdminRecibirVideos)
}

function* fetchAdminRecibirVideos(action){
    try{
        const data = yield call(adminRecibirVideos, action.data)
        if(data){
            yield put(setAdminRecibirVideos(data))
        }
    }catch(err){
        console.log(err)

    }
}

export const watchAdminRecibirVideosComprados= function * (){
    yield takeEvery(actionTypes.GET_ADMIN_RECIBIR_VIDEOS_COMPRADOS, fetchAdminRecibirVideosComprados)
}

function* fetchAdminRecibirVideosComprados(action){
    try{
        const data = yield call(adminRecibirVideos, action.data)
        if(data){
            yield put(setAdminRecibirVideosComprados(data))
        }
    }catch(err){
        console.log(err)

    }
}

export const watchAdminRecibirVideosGuardados= function * (){
    yield takeEvery(actionTypes.GET_ADMIN_RECIBIR_VIDEOS_GUARDADOS, fetchAdminRecibirVideosGuardados)
}

function* fetchAdminRecibirVideosGuardados(action){
    try{
        const data = yield call(adminRecibirVideos, action.data)
        if(data){
            yield put(setAdminRecibirVideosGuardados(data))
        }
    }catch(err){
        console.log(err)

    }
}

export const watchAdminRecibirVideosDestacados= function * (){
    yield takeEvery(actionTypes.GET_ADMIN_RECIBIR_VIDEOS_DESTACADOS, fetchAdminRecibirVideosDestacados)
}

function* fetchAdminRecibirVideosDestacados(action){
    try{
        const data = yield call(adminRecibirVideos, action.data)
        if(data){
            yield put(setAdminRecibirVideosDestacados(data))
        }
    }catch(err){
        console.log(err)

    }
}


export const watchAdminRecibirVideosDescartados= function * (){
    yield takeEvery(actionTypes.GET_ADMIN_RECIBIR_VIDEOS_DESCARTADOS, fetchAdminRecibirVideosDescartados)
}

function* fetchAdminRecibirVideosDescartados(action){
    try{
        const data = yield call(adminRecibirVideos, action.data)
        if(data){
            yield put(setAdminRecibirVideosDescartados(data))
        }
    }catch(err){
        console.log(err)

    }
}

// export const watchVeedorRecibirVideosTendencias= function * (){
//     yield takeEvery(actionTypes.GET_VEEDOR_RECIBIR_VIDEOS_TENDENCIAS, fetchVeedorRecibirVideosTendencias)
// }

// function* fetchVeedorRecibirVideosTendencias(action){
//     try{
//         const data = yield call(veedorRecibirVideos, action.data)
//         if(data){
//             yield put(setVeedorRecibirVideosTendencias(data))
//         }
//     }catch(err){
//         console.log(err)

//     }
// }



