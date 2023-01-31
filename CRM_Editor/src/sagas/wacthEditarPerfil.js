import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import apiEditarPerfil from "../api/perfil";
import { respuestaEditarPerfilUsuario } from "../Actions/EditarPerfil";

export const wacthEditarPerfil = function * (){
    yield takeEvery(actionTypes.EDITAR_USUARIO_PERFIL, fetchEditarPerfilUsuario)
}

function* fetchEditarPerfilUsuario(action){
    try{
        const data = yield call(apiEditarPerfil, action.data)
        if(data){
            yield put(respuestaEditarPerfilUsuario(data));
        }
    }catch(err){
        console.log(err)

    }
}