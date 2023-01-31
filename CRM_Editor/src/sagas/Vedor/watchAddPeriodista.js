import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call,put } from'redux-saga/effects';
import apiAddPeriodista from "../../api/Vedor/AddPeriodista";
import { setRespuestaPeriodista } from "../../Actions/VedorAddPeriodista";

export const watchAddPeriodista = function * (){
    yield takeEvery(actionTypes.VEDOR_AGREGAR_PERIODISTA, fetchAddPeriodista)
}

function* fetchAddPeriodista(action){
    try{
        const data = yield call(apiAddPeriodista, action.data)
        if(data){
            yield put(setRespuestaPeriodista(data))
          
        }
    }catch(err){
        console.log(err)

    }
}