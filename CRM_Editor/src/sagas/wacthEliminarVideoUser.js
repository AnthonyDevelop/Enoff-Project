import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call,put } from'redux-saga/effects';
import eliminarVideoUser from "../api/eliminarVideoUser";
import { confirmarVideosEliminados } from "../Actions/AccionEliminarVideoUser";

export const watchEliminarVideoUser = function * (){
    yield takeEvery(actionTypes.SET_ELIMINAR_VIDEO_USER, fetchEliminarVideoUser)
}

function* fetchEliminarVideoUser(action){
    try{
        const data = yield call(eliminarVideoUser, action.data)
        if(data){
            yield put(confirmarVideosEliminados(data))  
        }
    }catch(err){
        console.log(err)

    }
}