import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';

import { actualizarPeriodistasEliminados } from "../../Actions/Veedor/eliminarPeriodista";
import apiEliminarPeriodista from "../../api/Vedor/eliminarPeriodista";

export const watchEliminarPeriodista = function * (){
    yield takeEvery(actionTypes.SET_ELIMINAR_PERIODISTA, fetchEliminarPeriodista)
}

function* fetchEliminarPeriodista(action){
    try{
        const data = yield call(apiEliminarPeriodista, action.data)
        if(data){
            //ACTUALIZAR VISTA
            yield put(actualizarPeriodistasEliminados(data))
        }
    }catch(err){
        console.log(err)
    }
}