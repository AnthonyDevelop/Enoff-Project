import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';

import listaUsuarios from "../api/listaUsuarios";
import { setListaUsuarios } from "../Actions/listUsuarios";

export const watchListaUsuarios = function * (){
    yield takeEvery(actionTypes.GET_LISTA_USUARIOS, fetchListaUsuarios)
}

function* fetchListaUsuarios(action){
    try{
        const data = yield call(listaUsuarios, action.data)
        if(data){
            yield put(setListaUsuarios(data))
        }
    }catch(err){
        console.log(err)
        // toast.error('Revise su mail y/o contraseña', {
        // });
    }
}