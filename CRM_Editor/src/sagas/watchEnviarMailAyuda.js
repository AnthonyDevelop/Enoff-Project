import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import enviarMailAyuda from "../api/enviarMailAyuda";


export const watchEnviarMailAyuda = function * (){
    yield takeEvery(actionTypes.ENVIAR_MAIL_AYUDA, fetchEnviarMailAyuda)
}

function* fetchEnviarMailAyuda(action){
    try{
        const data = yield call(enviarMailAyuda, action.data)
        if(data){

        }
    }catch(err){
        console.log(err)
    }
}