import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';

import apiListaEstadisticas from "../../api/SuperAdmin/listaEstadisticas";
import { setListaEstadisticas } from "../../Actions/SuperAdmin/listaEstadisticas";

export const watchListaEstadisticas = function * (){
    yield takeEvery(actionTypes.GET_LISTA_ESTADISTICAS, fetchListaEstadisticas)
}

function* fetchListaEstadisticas(action){
    try{
        const data = yield call(apiListaEstadisticas, action.data)
        if(data){
            yield put(setListaEstadisticas(data))
        }
    }catch(err){
        console.log(err)
    }
}