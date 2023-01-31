import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import listCategorias from "../api/categorias";
import { setCategorias } from "../Actions/categorias";

export const watchCategorias = function * (){
    yield takeEvery(actionTypes.GET_ALL_CATEGORIAS, fetchCategorias)
}

function* fetchCategorias(action){
    try{
        const data = yield call(listCategorias, action.data)
        if(data){
            yield put(setCategorias(data))    
        }
    }catch(err){
        console.log(err)
    }
}