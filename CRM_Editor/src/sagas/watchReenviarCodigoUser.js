import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';

import reenviarCodigoUser from "../api/reenviarCodigoUser";
import { respuestaReenviarCodigoUser } from "../Actions/reenviarCodigoUser";


export const watchReenviarCodigoUser = function * (){
    yield takeEvery(actionTypes.REENVIAR_CODIGO_USER, fetchReenviarCodigoUser)
}

function* fetchReenviarCodigoUser(action){
    try{
        const data = yield call(reenviarCodigoUser, action.data)
        if(data){
            yield put(respuestaReenviarCodigoUser(data))
            
        }
    }catch(err){
        console.log(err)

    }
}