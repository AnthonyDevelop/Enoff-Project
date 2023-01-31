import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import sumarStrike from "../../api/SuperAdmin/sumarStrike";
import { setSumarStrike } from "../../Actions/SuperAdmin/sumarStrike";

export const watchSumarStrike = function * (){
    yield takeEvery(actionTypes.GET_SUMAR_STRIKE, fetchSumarStrike)
}

function* fetchSumarStrike(action){
    try{
        const data = yield call(sumarStrike, action.data)
        if(data){
            yield put(setSumarStrike(data))
        }
    }catch(err){
        console.log(err)
    }
}