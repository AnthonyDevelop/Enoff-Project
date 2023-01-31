import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import apiListaVeedores from "../../api/SuperAdmin/listaVeedores";
import { setListaVeedores } from "../../Actions/SuperAdmin/listaVeedores";

export const watchListaVeedores = function * (){
    yield takeEvery(actionTypes.GET_LISTA_VEEDORES, fetchListaVeedores)
}

function* fetchListaVeedores(action){
    try{
        const data = yield call(apiListaVeedores, action.data)
        if(data){
            yield put(setListaVeedores(data))
        }
    }catch(err){
        console.log(err)
    }
}