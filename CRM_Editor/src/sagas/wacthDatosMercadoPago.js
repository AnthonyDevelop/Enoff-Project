import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import DatosMercadoPago from "../api/DatosMercadoPago";
import { setDatosMercadoPago } from "../Actions/datosMercadoPago";

export const watchDatosMercadoPago = function * (){
    yield takeEvery(actionTypes.GET_MERCADOPAGO_DATA, fetchDatosMercadoPago)
}

function* fetchDatosMercadoPago(action){
    try{
        const data = yield call(DatosMercadoPago, action.data)
        if(data){
            yield put(setDatosMercadoPago(data))
        }
    }catch(err){
        console.log(err)
        // toast.error('Revise su mail y/o contraseña', {
        // });
    }
}