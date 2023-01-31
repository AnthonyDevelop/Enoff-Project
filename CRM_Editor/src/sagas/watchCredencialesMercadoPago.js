import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import enviarCodigoMP from "../api/enviarCodigoMercadoPago";

export const watchCredencialesMP = function * (){
    yield takeEvery(actionTypes.GET_RECIBIR_CREDENCIALES_MP, fetchCredencialesMP)
}

function* fetchCredencialesMP(action){
    try{
       yield call(enviarCodigoMP, action.data)
    }catch(err){
        console.log(err)
    }
}

