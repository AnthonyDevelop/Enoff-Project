import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import apiListaPeriodistasDisponibles from "../../api/Vedor/ListaPeriodistasDisponibles";
import { setListaPeriodistasDisponibles } from "../../Actions/VedorListaPeriodistasDisponibles";

export const watchListaPeriodistasDisponibles = function * (){
    yield takeEvery(actionTypes.GET_LISTA_PERIODISTA_DISPONIBLES, fetchListaPeriodistasDisponibles)
}

function* fetchListaPeriodistasDisponibles(action){
    try{
        const data = yield call(apiListaPeriodistasDisponibles, action.data)
        if(data){
            yield put(setListaPeriodistasDisponibles(data))
        }
    }catch(err){
        console.log(err)
    }
}