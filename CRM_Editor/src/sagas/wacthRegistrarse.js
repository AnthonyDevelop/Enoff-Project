import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import { validarRegistro } from "../Actions/ValidarRegistro";
import Registro from "../api/Registro";

export const watchRegistrarse = function * (){
    yield takeEvery(actionTypes.SET_REGISTRAR_USUARIO, fetchRegistrarUsuario)
}

function* fetchRegistrarUsuario(action){
    try{
        const data = yield call(Registro, action.data)
        if(data){
            if (data.message === "Usuario creado"){
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
            }
            yield put(validarRegistro(data))
        }
    }catch(err){
        console.log(err)

    }
}