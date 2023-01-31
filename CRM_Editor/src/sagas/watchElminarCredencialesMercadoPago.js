import { actionTypes } from "../Constantes/ActionTypes";
import { takeEvery, call, put} from'redux-saga/effects';
import eliminarCredencialMP from "../api/eliminarCredencialMP";
import { setRecibirCredenciales } from "../Actions/AccionCredencialMercadoPago";

export const watchEliminarCredencialMP = function * (){
    yield takeEvery(actionTypes.ELIMINAR_CREDENCIALES_MP, fetchEliminarCredencialMP)
}

function* fetchEliminarCredencialMP(action){
    try{
        const data = yield call(eliminarCredencialMP, action.data)
        if(data){
         yield put(setRecibirCredenciales(true))    
        }
    }catch(err){
        console.log(err)
    }
}

