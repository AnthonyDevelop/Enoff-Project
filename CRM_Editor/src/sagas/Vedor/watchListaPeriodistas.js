import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import apiListaPeriodista from "../../api/Vedor/ListaPeriodistas";
import { setListaPeriodistas } from "../../Actions/VedorListaPeriodistas";

export const watchListaPeriodistas = function * (){
    yield takeEvery(actionTypes.GET_LISTA_PERIODISTA, fetchListaPeriodistas)
}

function* fetchListaPeriodistas(action){
    try{
        const data = yield call(apiListaPeriodista, action.data)
        if(data){
            yield put(setListaPeriodistas(data))
        }
    }catch(err){
        console.log(err)
    }
}