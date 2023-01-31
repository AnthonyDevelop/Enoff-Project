import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import loginService from '../api/login';
import { resultVerificar } from "../Actions/login";
import { verificarLogin } from "../Actions/login";
import {  toast } from 'react-toastify';

export const watchLoginService = function * (){
    yield takeEvery(actionTypes.RESULT_VERIFICAR_LOGIN, fetchLoginUser)
}

function* fetchLoginUser(action){
    try{
        const data = yield call(loginService, action.data)
        if(data){
            yield put(resultVerificar(data))
            yield put(verificarLogin())
            
            toast.success('¡Bienvenido a CRM EDITOR!', {
            });
        }
    }catch(err){
        console.log(err)
        // toast.error('Revise su mail y/o contraseña', {
        // });
    }
}