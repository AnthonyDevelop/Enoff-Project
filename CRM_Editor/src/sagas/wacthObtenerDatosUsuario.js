import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import DatosUsuario from "../api/DatosUsuario";
import { setDatosUsuario } from "../Actions/datosUsuario";

export const wacthObtenerDatosUsuario = function * (){
    yield takeEvery(actionTypes.GET_USUARIO_DATA, fetchObtenerDatosUsuario)
}

function* fetchObtenerDatosUsuario(action){
    try{
        const data = yield call(DatosUsuario, action.data)
        if(data){
            yield put(setDatosUsuario(data))    
        }
    }catch(err){
        console.log(err)
    }
}